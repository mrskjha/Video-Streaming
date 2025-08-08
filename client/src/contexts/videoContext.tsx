'use client';

import { Video } from "@/types";
import React, { useCallback, useMemo, useState, useContext, useEffect } from "react";
import { getVideos } from "@/services/video";
import { useAuth } from "./authContext";
import axios from "axios";

// Define the shape of the context value
type VideoContextType = {
  videos: Video[];
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  addVideo: (video: Video) => void;
  deleteVideo: (id: string) => void;
  updateVideo: (id: string, updatedVideo: Video) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

// Create the context
const VideoContext = React.createContext<VideoContextType | undefined>(undefined);

// Provider component that will wrap the application
const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { isAuthenticated } = useAuth(); // Get authentication status from AuthContext

  // Effect to fetch videos when authentication status changes
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const data = await getVideos();
        if (data) {
          setVideos(data);
        } else {
          // Handle cases where API returns no data
          setVideos([]);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        setVideos([]); // Clear videos on error
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      // Fetch videos only if the user is logged in
      fetchVideos();
    } else {
      // If user is not authenticated, clear videos and stop loading
      setVideos([]);
      setLoading(false);
    }
  }, [isAuthenticated]); // Re-run this effect when isAuthenticated changes

  // Function to add a new video to the state
  const addVideo = useCallback((video: Video) => {
    setVideos((prev) => [...prev, video]);
  }, []);

  // Function to delete a video from the state and server
  const deleteVideo = useCallback(async (id: string) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/${id}`);
      if (response.status !== 200) {
        throw new Error("Failed to delete video from server");
      }
      // Remove video from local state on successful deletion
      setVideos((prev) => prev.filter((video) => video._id !== id));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  }, []);

  // Function to update a video in the state
  const updateVideo = useCallback((id: string, updatedVideo: Video) => {
    setVideos((prev) =>
      prev.map((video) => (video._id === id ? updatedVideo : video))
    );
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    videos,
    addVideo,
    deleteVideo,
    updateVideo,
    setVideos,
    searchTerm,
    setSearchTerm,
    loading,
    setLoading
  }), [videos, addVideo, deleteVideo, updateVideo, searchTerm, loading]);

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

// Custom hook to easily consume the VideoContext
const useVideoContext = (): VideoContextType => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoContext must be used within a VideoProvider");
  }
  return context;
};

export { VideoProvider, useVideoContext };
