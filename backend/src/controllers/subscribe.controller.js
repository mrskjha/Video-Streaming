import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";

// Subscribe to a channel
const subscribedTo = asyncHandler(async (req, res) => {
  const subscriberId = req.user._id; // user who is subscribing
  const { channel } = req.body || {}; // channel owner id

  if (!channel) throw new ApiError("Channel ID is required", 400);

  // Prevent duplicate subscription
  const exists = await Subscription.findOne({
    subscriber: subscriberId,
    channel,
  });
  if (exists) throw new ApiError("Already subscribed to this channel", 400);

  // Create subscription
  const subscription = await Subscription.create({
    subscriber: subscriberId,
    channel,
  });
  // Increment subscriber count of the channel owner
  await User.findByIdAndUpdate(channel, { $inc: { subscriberCount: 1 } });

  return res
    .status(201)
    .json(
      new ApiResponce(201, subscription, "Subscription created successfully")
    );
});

// Get total subscriptions for a channel/user
const totalSubscriptions = asyncHandler(async (req, res) => {
    const channelId = req.params.channelId; // channel owner id
    if (!channelId) throw new ApiError("Channel ID is required", 400);

    // Count subscriptions dynamically
    const total = await Subscription.countDocuments({ channel: channelId });

    return res
        .status(200)
        .json(new ApiResponce(200, "Total subscriptions retrieved successfully", total));
});

const isSubscribed = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const channelId = req.params.channelId;

    if (!channelId) throw new ApiError("Channel ID is required", 400);

    const subscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId,
    });


    return res
        .status(200)
        .json(new ApiResponce(200, "Subscription status retrieved successfully", !!subscription));
});

export { subscribedTo, totalSubscriptions, isSubscribed };
