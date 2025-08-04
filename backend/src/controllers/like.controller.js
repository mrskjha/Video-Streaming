import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";

const UpdateLikeCount = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { like } = req.body;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  video.likes += like ? 1 : -1;
  await video.save();

  return res
    .status(200)
    .json(new ApiResponce(200, video, "Like count updated successfully"));
});

const toggleLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { like } = req.body;
  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (like) {
    video.likes += 1;
  } else {
    video.likes -= 1;
    video.likedUsers.pull(req.user.id); 
  }
  await video.save();
  return res
    .status(200)
    .json(new ApiResponce(200, video, "Like status updated successfully"));
});

const removeCount = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { like } = req.body;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  video.likes -= like ? 1 : -1;
  await video.save();

  return res
    .status(200)
    .json(new ApiResponce(200, video, "Like count updated successfully"));
});

export { UpdateLikeCount, removeCount, toggleLike };