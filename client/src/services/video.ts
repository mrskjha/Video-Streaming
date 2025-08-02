import { Video, User } from "@/types";
import axiosInstance from "@/lib/axiosInstance";

const getVideos = async (): Promise<Video[]> => {
  const response = await axiosInstance.get("/videos");
  const videos = response.data.message;
  return videos;
};

const createVideo = async (video: Video): Promise<Video> => {
  const response = await axiosInstance.post("/videos", video);
  return response.data;
};

const updateVideo = async (id: string, video: Video): Promise<Video> => {
  const response = await axiosInstance.put(`/videos/${id}`, video);
  return response.data;
};

const deleteVideo = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/videos/${id}`);
};

export { getVideos, createVideo, updateVideo, deleteVideo };
