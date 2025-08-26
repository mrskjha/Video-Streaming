import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { Subscription } from "../models/subscription.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
  let { page = 1, limit = 12, query = "" } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const matchStage = { isPublished: true };
  if (query.trim()) matchStage.$text = { $search: query };

  const aggregateOptions = [
    { $match: matchStage },
    ...(query.trim() ? [{ $addFields: { score: { $meta: "textScore" } } }] : []),
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { username: 1, fullname: 1, avatar: 1 } }],
      },
    },
    { $addFields: { owner: { $first: "$owner" } } },
    { $sort: query.trim() ? { score: -1, views: -1 } : { views: -1, createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];

  const videos = await Video.aggregate(aggregateOptions);

  if (!videos || videos.length === 0) {
    return res.status(404).json(new ApiResponce(404, "No videos found", null));
  }

  let videosWithSubscribers;
  try {
    videosWithSubscribers = await Promise.all(
      videos.map(async (video) => {
        const ownerId = video.owner?._id;
        const count = ownerId
          ? await Subscription.countDocuments({ channel: ownerId })
          : 0;
        return { ...video, owner: { ...video.owner, subscribersCount: count } };
      })
    );
  } catch (err) {
    console.error("Error computing subscriber count:", err);
    throw new ApiError(500, "Failed to fetch videos");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, "Videos fetched successfully", videosWithSubscribers));
});


const publishVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;
  if (!title.trim() || !description.trim()) {
    throw new ApiError(400, "Title and description are required");
  }

  const thumbnailLocalPath = req.files?.thumbnail[0].path;
  const videoFileLocalPath = req.files?.videoFile[0].path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnail file is required !");
  }
  if (!videoFileLocalPath) {
    throw new ApiError(400, "video file is required !");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  const video = await uploadOnCloudinary(videoFileLocalPath);

  if (!video) {
    throw new ApiError(400, "video upload failed on cloudinary");
  }
  if (!thumbnail) {
    throw new ApiError(400, "thumbnail upload failed on cloudinary");
  }

  const uploadedVideo = await Video.create({
    title,
    description,
    videoFile: video.url,
    thumbnail: thumbnail.url,
    duration: video.duration,
    isPublished,
    owner: req.user?._id,
  });

  if (!uploadedVideo) {
    throw new ApiError(
      500,
      "Something went wrong while create the video document"
    );
  }

  return res
    .status(201)
    .json(new ApiResponce(200, uploadedVideo, "video uploaded Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID format");
  }

  const video = await Video.findById(videoId).populate(
    "owner",
    "username fullname avatar"
  );
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Count subscribers for this channel
  const subscribersCount = await Subscription.countDocuments({
    channel: video.owner._id,
  });

  // Check if logged in user is subscribed to this channel
  let isSubscribed = false;
  if (req.user) {
    const subscription = await Subscription.findOne({
      subscriber: req.user._id,
      channel: video.owner._id,
    });
    isSubscribed = !!subscription;
  }

  // Construct response
  const videoWithExtras = {
    ...video.toObject(),
    owner: {
      ...video.owner.toObject(),
      subscribersCount,
      isSubscribed,
    },
  };

  return res
    .status(200)
    .json(
      new ApiResponce(200, videoWithExtras, "Video fetched successfully")
    );
});


const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  //TODO: implement logic to update video by ID
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID format");
  }
  const video = await Video.findByIdAndDelete(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  return res
    .status(200)
    .json(new ApiResponce(200, null, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: implement logic to toggle publish status
});

const incrementViewCount = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  video.views += 1;
  await video.save();

  res.status(200).json(new ApiResponce(200, video, "View count updated"));
});

export {
  getAllVideos,
  publishVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  incrementViewCount,
};
