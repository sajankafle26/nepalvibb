"use client";

import { useState, useEffect, useRef, use, useCallback } from 'react';
import { 
  ArrowLeft, Send, User, Clock, 
  CheckCircle2, MapPin, Tag, Calendar,
  Shield, CreditCard, Check, CheckCheck,
  Wifi, WifiOff, Paperclip, Image as ImageIcon, FileIcon, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

// Notification sound - short beep using Web Audio API
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) { /* ignore audio errors */ }
}

export default function AdminChatPage({ params }) {
  const { id } = use(params);
  const [request, setRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [userOnline, setUserOnline] = useState(false);
  const [connected, setConnected] = useState(false);
  const [messagesRead, setMessagesRead] = useState(false);
  const [showNewMsg, setShowNewMsg] = useState(false);
  const endRef = useRef(null);
  const chatContainerRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const isAtBottomRef = useRef(true);

  // Fetch initial data
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(`/api/chat?id=${id}`);
        const data = await res.json();
        if (data) {
          setRequest(data);
          if (data.messages) {
            setMessages(data.messages.map((m, i) => ({
              id: m._id || `db-${i}`,
              from: m.sender === 'user' ? 'user' : (m.sender === 'system' ? 'system' : 'specialist'),
              text: m.text,
              attachment: m.attachment || null,
              time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              timestamp: m.timestamp,
              read: m.read || false,
            })));
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  // Socket connection
  useEffect(() => {
    let socket;
    const initSocket = async () => {
      await fetch('/api/socket');
      socket = io({ path: '/api/socket' });
      socketRef.current = socket;

      socket.on('connect', () => {
        setConnected(true);
        socket.emit('join-room', { tripId: id, role: 'specialist' });
        // Mark messages as read when admin opens the chat
        socket.emit('messages-read', { tripId: id, role: 'specialist' });
      });

      socket.on('disconnect', () => {
        setConnected(false);
      });

      socket.on('receive-message', (data) => {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m.id === data.id)) return prev;
          return [...prev, data];
        });

        // If message is from user, play sound and show indicator
        if (data.from === 'user') {
          playNotificationSound();
          if (!isAtBottomRef.current) {
            setShowNewMsg(true);
          }
          // Mark as read since admin has the chat open
          if (socketRef.current) {
            socketRef.current.emit('messages-read', { tripId: id, role: 'specialist' });
          }
        }
      });

      socket.on('user-typing', (data) => {
        if (data.role === 'user') {
          setIsUserTyping(true);
        }
      });

      socket.on('user-stop-typing', (data) => {
        if (data.role === 'user') {
          setIsUserTyping(false);
        }
      });

      socket.on('presence-update', (data) => {
        setUserOnline(data.onlineRoles?.includes('user') || false);
      });

      socket.on('messages-marked-read', (data) => {
        if (data.by === 'user') {
          setMessagesRead(true);
          // Mark all specialist messages as read
          setMessages(prev => prev.map(m => 
            m.from === 'specialist' ? { ...m, read: true } : m
          ));
        }
      });
    };

    initSocket();
    return () => { if (socket) socket.disconnect(); };
  }, [id]);

  // Auto-scroll
  useEffect(() => {
    if (isAtBottomRef.current) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isUserTyping]);

  // Track scroll position
  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const threshold = 100;
    isAtBottomRef.current = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    if (isAtBottomRef.current) setShowNewMsg(false);
  }, []);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowNewMsg(false);
  };

  // Typing indicator emit
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (socketRef.current) {
      socketRef.current.emit('typing', { tripId: id, role: 'specialist' });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('stop-typing', { tripId: id, role: 'specialist' });
      }, 1500);
    }
  };

  // Send message
  const handleSend = async (e) => {
    e?.preventDefault();
    const msg = input.trim();
    if (!msg || sending) return;

    setInput('');
    setSending(true);

    // Stop typing indicator
    if (socketRef.current) {
      socketRef.current.emit('stop-typing', { tripId: id, role: 'specialist' });
    }

    if (socketRef.current?.connected) {
      // Send via socket — the server will persist and broadcast
      socketRef.current.emit('send-message', {
        tripId: id,
        message: msg,
        from: 'specialist',
      });
      setSending(false);
    } else {
      // Fallback to REST API
      try {
        const res = await fetch('/api/admin/chat/respond', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tripId: id, text: msg }),
        });
        if (res.ok) {
          // No need to add locally if broadcast works, but since we're in fallback:
          setMessages(prev => [...prev, {
            id: `fb-${Date.now()}`,
            from: 'specialist',
            text: msg,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: new Date().toISOString(),
            read: false,
          }]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setSending(false);
      }
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSending(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        if (socketRef.current?.connected) {
          socketRef.current.emit('send-message', {
            tripId: id,
            message: '',
            from: 'specialist',
            attachment: {
              url: data.url,
              type: data.type,
              name: data.name
            }
          });
        } else {
          // Fallback to REST API if needed
          const res = await fetch('/api/admin/chat/respond', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              tripId: id, 
              text: '', 
              attachment: { url: data.url, type: data.type, name: data.name } 
            }),
          });
          if (res.ok) {
            setMessages(prev => [...prev, {
              id: `fb-file-${Date.now()}`,
              from: 'specialist',
              text: '',
              attachment: { url: data.url, type: data.type, name: data.name },
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              timestamp: new Date().toISOString(),
              read: false,
            }]);
          }
        }
      }
    } catch (err) {
      console.error('File upload failed:', err);
    } finally {
      setSending(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Quick reply templates
  const quickReplies = [
    "I'll prepare your itinerary now!",
    "Could you share your preferred travel dates?",
    "Here's what I recommend for your trip:",
    "Your trip is confirmed! 🎉",
  ];

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!request) return (
    <div className="flex items-center justify-center p-20 text-gray-400">
      <p>Trip request not found.</p>
    </div>
  );

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col lg:flex-row gap-10">
      
      {/* Left: Chat Container */}
      <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
        
        {/* Chat Header */}
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center space-x-4">
            <Link href="/admin/requests" className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center font-black text-primary text-xs uppercase">
                  {request.name ? request.name.split(' ').map(n => n[0]).join('') : 'U'}
                </div>
                {/* Online indicator */}
                <div className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white transition-colors",
                  userOnline ? "bg-green-500" : "bg-gray-300"
                )} />
              </div>
              <div>
                <h2 className="text-sm font-black text-primary uppercase tracking-tight">{request.name || 'Anonymous'}</h2>
                <div className="flex items-center space-x-2">
                  {userOnline ? (
                    <>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-green-600">Online nå</span>
                    </>
                  ) : (
                    <>
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Offline</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Socket connection status */}
            <div className={cn(
              "flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
              connected ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
            )}>
              {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span>{connected ? 'Live' : 'Reconnecting...'}</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-orange-100 text-orange-600">
              {request.status}
            </span>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30"
        >
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex flex-col max-w-[80%]",
                msg.from === 'specialist' ? "ml-auto items-end" : 
                msg.from === 'system' ? "mx-auto items-center" : "items-start"
              )}
            >
              <div className={cn(
                "px-5 py-4 rounded-2xl text-sm font-medium shadow-sm",
                msg.from === 'specialist' ? "bg-primary text-white rounded-br-none" : 
                msg.from === 'system' ? "bg-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest border-0" :
                "bg-white text-gray-700 border border-gray-100 rounded-bl-none"
              )}>
                {msg.attachment ? (
                  <div className="space-y-2">
                    {msg.attachment.type === 'image' ? (
                      <div className="rounded-lg overflow-hidden border border-gray-100 max-w-sm">
                        <img src={msg.attachment.url} alt={msg.attachment.name} className="w-full h-auto max-h-64 object-cover" />
                      </div>
                    ) : (
                      <a 
                        href={msg.attachment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-xl border transition-all",
                          msg.from === 'specialist' ? "bg-white/10 border-white/20 hover:bg-white/20" : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-lg",
                          msg.from === 'specialist' ? "bg-white/20" : "bg-primary/10 text-primary"
                        )}>
                          <FileIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black truncate">{msg.attachment.name}</p>
                          <p className="text-[8px] opacity-60 font-bold uppercase tracking-widest">Klikk for å åpne</p>
                        </div>
                        <ExternalLink className="w-3 h-3 opacity-40" />
                      </a>
                    )}
                    {msg.text && <p className="mt-2">{msg.text}</p>}
                  </div>
                ) : (
                  msg.text
                )}
              </div>
              <div className="flex items-center space-x-1.5 mt-2 px-2">
                <span className="text-[10px] text-gray-300 font-bold">
                  {msg.time}
                </span>
                {/* Read receipts for specialist messages */}
                {msg.from === 'specialist' && (
                  msg.read ? (
                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                  ) : (
                    <Check className="w-3.5 h-3.5 text-gray-300" />
                  )
                )}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isUserTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-end space-x-3"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-[10px] font-black">
                  {request.name ? request.name[0] : 'U'}
                </div>
                <div className="bg-white rounded-2xl rounded-bl-none px-5 py-4 shadow-sm border border-gray-100 flex items-center space-x-1.5">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-gray-300 rounded-full"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                  <span className="text-[10px] text-gray-400 font-bold ml-2">typing...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={endRef} />
        </div>

        {/* New message indicator */}
        <AnimatePresence>
          {showNewMsg && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={scrollToBottom}
              className="absolute bottom-36 left-1/2 -translate-x-1/2 bg-primary text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl z-30 flex items-center space-x-2"
            >
              <span>New message ↓</span>
            </motion.button>
          )}
        </AnimatePresence>

        <div className="p-6 bg-white border-t border-gray-50 shrink-0 space-y-4">
          {/* Quick Replies */}
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => { setInput(reply); }}
                className="text-[10px] font-bold border border-gray-200 rounded-full px-3 py-1.5 text-gray-500 hover:border-primary hover:text-primary hover:bg-emerald-50 transition-all"
              >
                {reply}
              </button>
            ))}
          </div>
          <form onSubmit={handleSend} className="flex items-center space-x-4">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*,.pdf,.doc,.docx"
            />
            <button 
              type="button"
              onClick={handleFileClick}
              className="p-3 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input 
              value={input}
              onChange={handleInputChange}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend(e)}
              placeholder="Type your response..."
              className="flex-1 bg-gray-50 border-0 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20"
            />
            <button 
              type="submit"
              disabled={sending || !input.trim()}
              className={cn(
                "shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg",
                input.trim() ? "bg-primary text-white hover:bg-emerald-900 shadow-primary/20" : "bg-gray-100 text-gray-400 shadow-none"
              )}
            >
              {sending ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>

      {/* Right: Trip Context Sidebar */}
      <aside className="w-full lg:w-80 space-y-6 overflow-y-auto pr-2">
        <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-4">Traveler Profile</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-blue-500" />
              <p className="text-xs font-bold text-gray-600">{request.name || 'Anonymous'}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-orange-500" />
              <p className="text-xs font-bold text-gray-600">{request.month || 'Flexible dates'}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Tag className="w-4 h-4 text-emerald-500" />
              <p className="text-xs font-bold text-gray-600">{request.budget || 'Mid-range budget'}</p>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-purple-500" />
              <p className="text-xs font-bold text-gray-600">{request.destination || 'Nepal'}</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-4">Specialist Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Set Trip Price (NOK)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[10px]">NOK</span>
                  <input 
                    type="number" 
                    value={request.price || 0}
                    onChange={(e) => setRequest({ ...request, price: parseFloat(e.target.value) })}
                    className="w-full bg-gray-50 border-0 rounded-xl pl-8 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button 
                  onClick={async () => {
                    const res = await fetch(`/api/admin/chat/update-price`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ tripId: id, price: request.price })
                    });
                    if (res.ok) {
                      const updated = await res.json();
                      setRequest(updated);
                      alert('Price updated!');
                    }
                  }}
                  className="w-full bg-primary text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-900 transition-all"
                >
                  Save Price
                </button>
              </div>
            </div>
            <button 
              onClick={async () => {
                if (!confirm('Mark this trip as booked?')) return;
                const res = await fetch(`/api/admin/chat/update-status`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ tripId: id, status: 'booked' })
                });
                if (res.ok) {
                  const updated = await res.json();
                  setRequest(updated);
                }
              }}
              className="flex items-center justify-between p-4 bg-emerald-50 text-emerald-700 rounded-2xl hover:bg-emerald-100 transition-colors"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">Mark as Booked</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
            <button 
              onClick={async () => {
                const msg = "I've sent your custom itinerary draft. Please review it!";
                if (socketRef.current?.connected) {
                  socketRef.current.emit('send-message', {
                    tripId: id,
                    message: msg,
                    from: 'specialist',
                  });
                } else {
                  await fetch('/api/admin/chat/respond', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tripId: id, text: msg }),
                  });
                  setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    from: 'specialist',
                    text: msg,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    timestamp: new Date().toISOString(),
                    read: false,
                  }]);
                }
              }}
              className="flex items-center justify-between p-4 bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-100 transition-colors"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">Send Itinerary Draft</span>
              <Shield className="w-4 h-4" />
            </button>
          </div>
        </section>

        {request.notes && (
          <section className="bg-orange-50/50 rounded-[2.5rem] border border-orange-100 p-8">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-400 mb-4">Internal Notes</h3>
            <p className="text-xs text-orange-900 font-medium leading-relaxed italic">
              "{request.notes}"
            </p>
          </section>
        )}
      </aside>
    </div>
  );
}
