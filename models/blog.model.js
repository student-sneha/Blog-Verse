// models/Blog.js
import mongoose from 'mongoose';

// blog.model.js
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String, // ✅ Changed from ObjectId to String
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
