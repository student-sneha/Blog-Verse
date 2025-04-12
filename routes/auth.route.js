import {Router} from "express";
import { signUp, logIn ,signOut} from "../controllers/auth.controller.js";

const authRoutes = Router();
authRoutes.get("/signup", (req, res) => res.render("auth/signup.ejs"));
authRoutes.post("/signup", signUp);

authRoutes.get("/login", (req, res) => res.render("auth/login.ejs"));
authRoutes.post("/login", logIn);

authRoutes.get("/logout", signOut);

export default authRoutes;
