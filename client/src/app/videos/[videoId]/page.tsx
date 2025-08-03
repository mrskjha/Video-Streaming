"use client";

import { LoaderOne } from "@/components/ui/loader";
import { getVideoById } from "@/services/video";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const VideoPage = () => {
  const params = useParams();
  const videoId = params?.videoId as string;

  const [video, setVideo] = useState<any>(null);

  useEffect(() => {
    console.log("Video ID:", videoId);
    const fetchVideo = async () => {
      try {
        const response = await getVideoById(videoId);
        console.log("Fetched Video:", response);
        setVideo(response.message);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };
    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  return (
    <div className="px-4 py-6 dark:bg-black dark:text-white">
  {video ? (
    <div className="mx-auto flex flex-col md:flex-row items-start gap-6 max-w-6xl bg-neutral-950 border border-neutral-800 rounded-xl shadow-md p-6">
      
      {/* Left: Video Player */}
      <div className="w-full md:w-2/3">
        <video
          src={video.videoFile}
          controls
          poster={video.thumbnail}
          controlsList="nodownload"
          className="w-full max-w-4xl object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Right: Video Details */}
      <div className="w-full md:w-1/3 text-white space-y-3">
        <h1 className="text-xl font-bold">{video.title}</h1>

        {/* Description with 3-line clamp */}
        <p className="text-gray-400 text-sm line-clamp-3">
          {video.description}
        </p>

        <div className="text-gray-500 text-sm space-y-1">
          <p>
            <span className="font-sans text-white">Uploaded by:</span> {video.owner?.fullname || "Unknown"}
          </p>
          <p>
            <span className="font-medium text-white">Created at:</span>{" "}
            {new Date(video.createdAt).toLocaleDateString()}
          </p>

        </div>
        <div className="flex items-center mt-4">
                  <img
                    src={video.owner.avatar}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover mr-2"
                  />
                  <h3 className="text-sm font-semibold text-white ml-4">
                    {video.owner.fullname}
                  </h3>
                </div>
      </div>

    </div>
  ) : (
    <div className="flex justify-center items-center h-64">
      <LoaderOne />
    </div>
  )}
</div>

  );
};

export default VideoPage;
