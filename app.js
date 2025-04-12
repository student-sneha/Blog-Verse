import express from "express";
import { PORT, DB_URL } from "./config/env.js"; // ⬅ Use DB_URL from env.js
import cookieParser from "cookie-parser";

import path from "path";
import { fileURLToPath } from "url";

import methodOverride from "method-override";

import flash from "connect-flash";
import session from "express-session";
import MongoStore from "connect-mongo";

import connectedToDatabase from "./database/mongodb.js";
import errorMiddleare from "./middleware/error.middleware.js";

import ejsMate from "ejs-mate";
import blogRouter from "./routes/blog.route.js";
import authRoutes from "./routes/auth.route.js";

const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.use(errorMiddleare);
app.use(flash());
app.use(cookieParser());

app.use(
  session({
    secret: "blogsecret",
    resave: false,
    saveUninitialized: false, // ← important!
    store: MongoStore.create({
      mongoUrl: DB_URL, // ⬅ CHANGED: now uses env-based Mongo URI
      ttl: 24 * 60 * 60,
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.userId = req.session.userId;
  res.locals.userName = req.session.userName;
  next();
});

// ⬇ Redirect root URL "/" to "/blogs" — acts as the landing page of the site.
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.use("/blogs", blogRouter);
app.use("/blogs/auth", authRoutes);


// ⬇ Only start the server with app.listen() during local development.
// In production (like on Vercel), we export the app and let the platform handle the serverless routing.
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, async () => {
    console.log(`Server is listening at http://localhost:${PORT}/blogs`);
    await connectedToDatabase();
  });
} else {
  // In production (Vercel), ensure the database is connected,
  // but do NOT call app.listen — Vercel wraps the app as a serverless function.
  await connectedToDatabase();
}

// Export the app for serverless deployment
export default app;
