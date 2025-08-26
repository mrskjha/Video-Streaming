
import z from "zod";
import axiosInstance from "@/lib/axiosInstance";

const SubscribeSchema = z.object({
    channel: z.string().min(3).max(100),
});

const subscribeToChannel = async (channelId: string) => {
    const result = SubscribeSchema.safeParse({ channel: channelId });
    if (!result.success) {
        throw new Error("Invalid channel ID");
    }

    const response = await axiosInstance.post("/subscribe", { channel: channelId });
    return response.data;
};

const isSubscribedToChannel = async (channelId: string) => {
    const response = await axiosInstance.get(`/subscriptions/status/${channelId}`);
    return response.data;
};



export { subscribeToChannel, isSubscribedToChannel };