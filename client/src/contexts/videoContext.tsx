'use client';

import { Video } from "@/types";
import React, { useCallback, useMemo, useState, useContext, useEffect } from "react";
import axios from "axios";
import { getVideos } from "@/services/video";

type VideoContextType = {
  videos: Video[];
  addVideo: (video: Video) => void;
  removeVideo: (id: string) => void;
  updateVideo: (id: string, updatedVideo: Video) => void;
};

const VideoContext = React.createContext<VideoContextType | undefined>(undefined);

const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const data = await getVideos();
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
  }, []);

  const addVideo = useCallback((video: Video) => {
    setVideos((prev) => [...prev, video]);
  }, []);

  const removeVideo = useCallback((id: string) => {
    setVideos((prev) => prev.filter((video) => video._id !== id));
  }, []);

  const updateVideo = useCallback((id: string, updatedVideo: Video) => {
    setVideos((prev) =>
      prev.map((video) => (video._id === id ? updatedVideo : video))
    );
  }, []);

  const value = useMemo(() => ({
    videos,
    addVideo,
    removeVideo,
    updateVideo,
  }), [videos, addVideo, removeVideo, updateVideo]);

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
