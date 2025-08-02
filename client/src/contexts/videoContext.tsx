import { Video } from "@/types";
import React from "react";


type VideoContextType = {
  videos: Video[];
  addVideo: (video: Video) => void;
  removeVideo: (id: string) => void;
  updateVideo: (id: string, updatedVideo: Video) => void;
};

// Create context

const VideoContext = React.createContext<VideoContextType | undefined>(undefined);

// Provider component
const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = React.useState<Video[]>([]);

  const addVideo = (video: Video) => {
    setVideos((prevVideos) => [...prevVideos, video]);
  };

  const removeVideo = (id: string) => {
    setVideos((prevVideos) => prevVideos.filter((video) => video._id !== id));
  };

  const updateVideo = (id: string, updatedVideo: Video) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) => (video._id === id ? updatedVideo : video))
    );
  };

  return (
    <VideoContext.Provider value={{ videos, addVideo, removeVideo, updateVideo }}>
      {children}
    </VideoContext.Provider>
  );
}

// Custom hook for accessing the VideoContext
const useVideoContext = () => {
  const context = React.useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoContext must be used within a VideoProvider");
  }
  return context;
};

export { VideoProvider, useVideoContext };
