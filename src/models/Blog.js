import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Nepalvibb Editor' },
  category: { type: String, default: 'Travel Tips' },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
