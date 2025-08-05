import { Video, User } from "@/types";
import axiosInstance from "@/lib/axiosInstance";

const getVideos = async (): Promise<Video[]> => {
  const response = await axiosInstance.get("/videos");
  const videos = response.data.message;
  return videos;
};

const getVideoById = async (videoId: string): Promise<Video> => {
  const response = await axiosInstance.get(`/videos/${videoId}`);
  return response.data;
};


const createVideo = async (formData: FormData) => { 
  const response = await axiosInstance.post("/videos", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const updateVideo = async (id: string, video: Video): Promise<Video> => {
  const response = await axiosInstance.put(`/videos/${id}`, video);
  return response.data;
};

const deleteVideo = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/videos/${id}`);
};

const incrementVideoViews = async (videoId: string) => {
  const response = await axiosInstance.patch(`/videos/${videoId}/views`);
  return response.data;
};
export { getVideos,getVideoById, createVideo, updateVideo, deleteVideo, incrementVideoViews };
