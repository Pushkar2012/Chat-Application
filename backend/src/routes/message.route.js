import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getUsersForSidebar } from '../controller/message.con.js';
import { getMessages } from '../controller/message.con.js';
import { sendMessage } from '../controller/message.con.js';

const router = express.Router();

router.get("/users",protectRoute,getUsersForSidebar);
router.get("/:id",protectRoute,getMessages);
router.post("/send/:id",protectRoute,sendMessage);


export default router;