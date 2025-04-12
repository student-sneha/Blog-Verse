import mongoose from "mongoose";
import { DB_URL } from "../config/env.js";
import initData from "../init/data.js";
import Blog from "../models/blog.model.js";


if (!DB_URL) {
  throw new Error(
    `Please define the MONGODB_URL enviroment variable inside .env.<development/production>.local`
  );
}
// connected to Database
const connectedToDatabase = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to the database");

    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      await Blog.insertMany(initData);
      console.log("Sample blog data inserted");
    } else {
      console.log("Blog data already exists, skipping seeding");
    }
  } catch (error) {
    console.error("Database error:", error);
    process.exit(1);
  }
};


export default connectedToDatabase;