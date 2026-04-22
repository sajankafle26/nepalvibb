import { Server } from 'socket.io';
import mongoose from 'mongoose';

// Inline DB connect to avoid ESM/CJS issues in pages/api
const MONGODB_URI = process.env.MONGODB_URI;
let cachedConn = global._mongooseConn;
if (!cachedConn) {
  cachedConn = global._mongooseConn = { conn: null, promise: null };
}
async function ensureDb() {
  if (cachedConn.conn) return cachedConn.conn;
  if (!cachedConn.promise) {
    cachedConn.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  cachedConn.conn = await cachedConn.promise;
  return cachedConn.conn;
}

// Inline TripRequest model reference
function getTripRequestModel() {
  if (mongoose.models.TripRequest) return mongoose.models.TripRequest;

  const MessageSchema = new mongoose.Schema({
    sender: { type: String, enum: ['user', 'specialist', 'system'], required: true },
    text: { type: String, required: false },
    attachment: {
      url: String,
      type: { type: String },
      name: String,
    },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  });

  const TripRequestSchema = new mongoose.Schema({
    userId: { type: String, required: false },
    destination: { type: String, default: 'Nepal' },
    status: { type: String, enum: ['active', 'closed', 'booked'], default: 'active' },
    group: String,
    dateType: String,
    month: String,
    startDate: Date,
    endDate: Date,
    duration: Number,
    interests: [String],
    budget: String,
    accommodation: String,
    name: String,
    email: { type: String, required: true },
    phone: String,
    notes: String,
    messages: [MessageSchema],
    price: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' },
    itineraryPdf: String,
  }, { timestamps: true });

  return mongoose.model('TripRequest', TripRequestSchema);
}

// Track online users per room: { tripId: { user: socketId, specialist: socketId } }
const roomPresence = {};

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  console.log('Socket is initializing');
  const io = new Server(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
  });
  res.socket.server.io = io;
  global._io = io; // Expose globally for App Router access

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join a trip room with role info
    socket.on('join-room', (data) => {
      // Support both old format (string tripId) and new format ({ tripId, role })
      const tripId = typeof data === 'string' ? data : data.tripId;
      const role = typeof data === 'string' ? 'user' : (data.role || 'user');

      socket.join(tripId);
      socket._tripId = tripId;
      socket._role = role;

      // Track presence
      if (!roomPresence[tripId]) roomPresence[tripId] = {};
      roomPresence[tripId][role] = socket.id;

      console.log(`${role} (${socket.id}) joined room ${tripId}`);

      // Notify room that someone came online
      io.to(tripId).emit('presence-update', {
        role,
        status: 'online',
        onlineRoles: Object.keys(roomPresence[tripId] || {}),
      });
    });

    // Handle sending messages — relay to room + persist to DB
    socket.on('send-message', async (data) => {
      const { tripId, message, from, attachment } = data;
      if (!tripId || (!message && !attachment)) return;

      const timestamp = new Date();
      const messagePayload = {
        id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 5),
        from: from || 'user',
        text: message,
        attachment: attachment || null,
        time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: timestamp.toISOString(),
        read: false,
      };

      // Broadcast to EVERYONE in the room (including sender for confirmation)
      io.to(tripId).emit('receive-message', messagePayload);

      // Persist to MongoDB
      try {
        await ensureDb();
        const TripRequest = getTripRequestModel();
        await TripRequest.findByIdAndUpdate(tripId, {
          $push: {
            messages: {
              sender: from === 'specialist' ? 'specialist' : 'user',
              text: message,
              attachment: attachment || null,
              timestamp,
              read: false,
            }
          }
        });
      } catch (err) {
        console.error('Failed to persist message:', err.message);
      }
    });

    // Typing indicators
    socket.on('typing', (data) => {
      const tripId = data.tripId || socket._tripId;
      const role = data.role || socket._role || 'user';
      if (tripId) {
        socket.broadcast.to(tripId).emit('user-typing', { role });
      }
    });

    socket.on('stop-typing', (data) => {
      const tripId = data.tripId || socket._tripId;
      const role = data.role || socket._role || 'user';
      if (tripId) {
        socket.broadcast.to(tripId).emit('user-stop-typing', { role });
      }
    });

    // Read receipts — mark messages as read
    socket.on('messages-read', async (data) => {
      const { tripId, role } = data;
      if (tripId) {
        socket.broadcast.to(tripId).emit('messages-marked-read', { by: role });

        // Persist read status
        try {
          await ensureDb();
          const TripRequest = getTripRequestModel();
          const senderToMark = role === 'specialist' ? 'user' : 'specialist';
          await TripRequest.updateMany(
            { _id: tripId, 'messages.sender': senderToMark, 'messages.read': false },
            { $set: { 'messages.$[elem].read': true } },
            { arrayFilters: [{ 'elem.sender': senderToMark, 'elem.read': false }] }
          );
        } catch (err) {
          console.error('Failed to update read status:', err.message);
        }
      }
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      const tripId = socket._tripId;
      const role = socket._role;

      if (tripId && role && roomPresence[tripId]) {
        delete roomPresence[tripId][role];
        if (Object.keys(roomPresence[tripId]).length === 0) {
          delete roomPresence[tripId];
        }

        // Notify room that someone went offline
        io.to(tripId).emit('presence-update', {
          role,
          status: 'offline',
          onlineRoles: Object.keys(roomPresence[tripId] || {}),
        });
      }

      console.log('Client disconnected:', socket.id);
    });
  });

  res.end();
}
