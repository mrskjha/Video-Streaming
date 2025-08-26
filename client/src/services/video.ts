import { Video } from "@/types";
import axiosInstance from "@/lib/axiosInstance";

const getVideos = async (): Promise<Video[]> => {
  const response = await axiosInstance.get("/videos");
  return response.data.data; // 👈 yaha se videos array milega
};


const getVideoById = async (videoId: string): Promise<Video> => {
  const response = await axiosInstance.get(`/videos/${videoId}`);
  return response.data.message; 
};



const createVideo = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post("/videos", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch {
    throw new Error("Failed to create video");
  }
};

const updateVideo = async (id: string, video: Video): Promise<Video> => {
  try {
    const response = await axiosInstance.put(`/videos/${id}`, video);
    return response.data;
  } catch  {
    throw new Error("Failed to update video");
  }
};

const deleteVideo = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/videos/${id}`);
  } catch {
    throw new Error("Failed to delete video");
  }
};

const incrementVideoViews = async (videoId: string) => {
  try {
    const response = await axiosInstance.patch(`/videos/${videoId}/views`);
    return response.data;
  } catch {
    throw new Error("Failed to increment video views");
  }
};
export { getVideos,getVideoById, createVideo, updateVideo, deleteVideo, incrementVideoViews };
