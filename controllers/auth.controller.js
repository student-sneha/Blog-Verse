import mongoose from "mongoose";
import User from "../models/user.model.js";

// ➕ SIGNUP
export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      req.flash("error", "User already exists with that email");
      return res.redirect("/blogs/auth/signup");
    }

    const newUser = new User({ name, email, password });
    await newUser.save({ session });

    req.session.userId = newUser._id.toString();
    req.session.userName = newUser.name;
    res.locals.userId = req.session.userId;
    res.locals.userName = req.session.userName;

    req.session.save(() => {
      console.log("Session saved after signup");
    });
    await session.commitTransaction();
    session.endSession();

    req.flash("success", "Welcome, registered successfully!");
    res.redirect("/blogs?_=" + Date.now());
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

// 🔐 LOGIN
export const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/blogs/auth/login");
    }

    req.session.userId = user._id.toString();
    req.session.userName = user.name;
    await new Promise((resolve) => req.session.save(resolve));
    req.flash("success", `Welcome back, ${user.name}!`);
    res.redirect("/blogs?_=" + Date.now());
  } catch (err) {
    next(err);
  }
};

// 🚪 LOGOUT
export const signOut = (req, res) => {
  // Flash message before destroying session
  req.flash("success", "Logged out successfully");

  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session during logout:", err);
      return res.redirect("/blogs");
    }

    res.clearCookie("connect.sid");
    res.redirect("/blogs");
  });
};
