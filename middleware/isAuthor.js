import Blog from "../models/blog.model.js";

export const isAuthor = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      req.flash("error", "Blog not found");
      return res.redirect("/blogs");
    }

    // Log to debug values
    console.log("Session User Name:", req.session.userName); // Should be the logged-in user name
    console.log("Blog Author:", blog.author); // Should be the author's name (string)

    // Compare blog.author (string) with req.session.userName (string)
    if (blog.author !== req.session.userName) {
      req.flash("error", "You are not authorized to do that!");
      return res.redirect(`/blogs/${req.params.id}`);
    }

    next();
  } catch (err) {
    console.error("Error in isAuthor middleware:", err);
    req.flash("error", "Something went wrong");
    res.redirect("/blogs");
  }
};
