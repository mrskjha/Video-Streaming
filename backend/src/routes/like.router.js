import express from "express";

import { verifyJWT } from "../middlewares/auth.js";
import { UpdateLikeCount, removeCount, toggleLike } from "../controllers/like.controller.js";

const router = express.Router();

router.use(verifyJWT);

router
  .route("/:videoId")
  .put(UpdateLikeCount)
  .delete(removeCount)
  .patch(toggleLike);


export default router;