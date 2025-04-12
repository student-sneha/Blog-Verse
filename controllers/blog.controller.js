import mongoose from "mongoose";
import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const allBlogs = await Blog.find({});
    res.render("listings/home.ejs", { allBlogs });
  } catch (err) {
    req.flash("error", "Failed to show blogs");
    res.redirect("/");
  }
};

// Render new blog form
export const renderBlogFrom = (req, res) => {
  res.render("listings/new.ejs");
};

// Create a new blog
export const createBlog = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!req.session.userName) {
      req.flash("error", "You must be logged in to write a blog.");
      return res.redirect("/blogs/auth/login");
    }

    const blog = new Blog({
      title,
      content,
      author: req.session.userName, // Save author name as string
    });

    await blog.save();
    req.flash("success", "Blog posted successfully!");
    res.redirect("/blogs");
  } catch (err) {
    next(err);
  }
};

// Show blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      req.flash("error", "Blog not found");
      return res.redirect("/blogs");
    }

    res.render("listings/show.ejs", {
      blog,
      userName: req.session.userName,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).send("Something went wrong");
  }
};

// Render edit form
export const renderEditFrom = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      req.flash("error", "Blog not found");
      return res.redirect("/blogs");
    }

    if (blog.author !== req.session.userName) {
      req.flash("error", "You are not authorized to edit this blog");
      return res.redirect(`/blogs/${blogId}`);
    }

    res.render("listings/edit.ejs", { blog });
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).send("Something went wrong");
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      req.flash("error", "Blog not found");
      return res.redirect("/blogs");
    }

    if (blog.author !== req.session.userName) {
      req.flash("error", "You are not authorized to update this blog");
      return res.redirect(`/blogs/${blogId}`);
    }

    const { title, content } = req.body;

    await Blog.findByIdAndUpdate(blogId, { title, content });
    req.flash("success", "Blog updated successfully!");
    res.redirect(`/blogs/${blogId}`);
  } catch (err) {
    console.error("Error updating blog:", err);
    req.flash("error", "Failed to update blog");
    res.redirect("/blogs");
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      req.flash("error", "Blog not found");
      return res.redirect("/blogs");
    }

    if (blog.author !== req.session.userName) {
      req.flash("error", "You are not authorized to delete this blog");
      return res.redirect(`/blogs/${blogId}`);
    }

    await Blog.findByIdAndDelete(blogId);
    req.flash("success", "Blog deleted successfully!");
    res.redirect("/blogs");
  } catch (err) {
    console.error("Failed to delete blog:", err);
    req.flash("error", "Error deleting blog");
    res.redirect("/blogs");
  }
};
