"use client";
import { useAuth } from "@/contexts/authContext";
import { useVideoContext } from "@/contexts/videoContext";
import React, { use, useEffect } from "react";
import { LoaderOne } from "./ui/loader";

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const { videos } = useVideoContext();

  
  if (isLoading) return <LoaderOne />;
  if (!videos) return <div>No videos found.</div>;
  const ownedVideos = videos.filter((video) => video.owner?._id === user?._id);
  console.log("Owned Videos:", ownedVideos);
  return (
    
    <div>
      {isLoading  ? (
        <LoaderOne />
      ) : (
        <>
          <p>You have {ownedVideos.length} videos uploaded.</p>
          <h1>Welcome back, {user?.fullname}!</h1>
        </>
      )}
    </div>
  );
};

export default Dashboard;
