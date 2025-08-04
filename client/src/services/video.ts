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
  // We use FormData to correctly handle file uploads.
  // The backend will need to be able to parse multipart/form-data.
  const response = await axiosInstance.post("/videos", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    // You might add an onUploadProgress handler here for real progress tracking
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

export { getVideos,getVideoById, createVideo, updateVideo, deleteVideo };
