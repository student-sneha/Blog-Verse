import { Router } from "express";
import {
  getBlogs,
  createBlog,
  getBlogById,
  renderBlogFrom,
  renderEditFrom,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import { isAuth } from "../middleware/isAuth.js";
import { isAuthor } from "../middleware/isAuthor.js"; 

const blogRouter = Router();

blogRouter.get("/", getBlogs);
blogRouter.get("/new", isAuth, renderBlogFrom);
blogRouter.post("/", isAuth, createBlog);
blogRouter.get("/:id", getBlogById);

// Apply both middlewares for protected routes
blogRouter.get("/:id/edit", isAuth, isAuthor, renderEditFrom);
blogRouter.put("/:id", isAuth, isAuthor, updateBlog);
blogRouter.delete("/:id", isAuth, isAuthor, deleteBlog);

export default blogRouter;
