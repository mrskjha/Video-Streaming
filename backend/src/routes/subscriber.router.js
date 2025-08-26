import express from "express";
import { isSubscribed, subscribedTo, totalSubscriptions } from "../controllers/subscribe.controller.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = express.Router();

router.post("/subscribe", verifyJWT, subscribedTo);
router.get("/subscriptions/total/:channelId", verifyJWT, totalSubscriptions);
router.get("/subscriptions/status/:channelId", verifyJWT, isSubscribed);

export default router;
