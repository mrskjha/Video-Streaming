'use client';

import { Video } from "@/types";
import React, { useCallback, useMemo, useState, useContext, useEffect, use } from "react";
import { getVideos } from "@/services/video";
import { useAuth } from "./authContext";
import axios from "axios";

type VideoContextType = {
  videos: Video[];
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  addVideo: (video: Video) => void;
  deleteVideo: (id: string) => void;
  updateVideo: (id: string, updatedVideo: Video) => void;
};

const VideoContext = React.createContext<VideoContextType | undefined>(undefined);

const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchVideos = async () => {
      const data = await getVideos();
      if (!data) {
        console.error("Failed to fetch videos");
        setLoading(false);
        return;
      }
      try {
        console.log("Fetched videos:", data);
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [user]);

  const addVideo = useCallback((video: Video) => {
    setVideos((prev) => [...prev, video]);
  }, []);

  const deleteVideo = useCallback(async (id: string) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/${id}`);
      if (response.status !== 200) {
        throw new Error("Failed to delete video");
      }
      setVideos((prev) => prev.filter((video) => video._id !== id));
      
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  }, []);


  const updateVideo = useCallback((id: string, updatedVideo: Video) => {
    setVideos((prev) =>
      prev.map((video) => (video._id === id ? updatedVideo : video))
    );
  }, []);

  

  const value = useMemo(() => ({
    videos,
    addVideo,
    deleteVideo,
    updateVideo,
    setVideos
  }), [videos, addVideo, deleteVideo, updateVideo, setVideos]);

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

const useVideoContext = (): VideoContextType => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoContext must be used within a VideoProvider");
  }
  return context;
};

export { VideoProvider, useVideoContext };
