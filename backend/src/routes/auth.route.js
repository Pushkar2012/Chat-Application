import express from 'express';
import { signup, login, logout } from '../controller/auth.con.js';
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controller/auth.con.js";
import { checkAuth } from '../controller/auth.con.js';

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check",protectRoute,checkAuth);

export default router;