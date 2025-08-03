"use client";

import { useEffect, useState } from "react";
import { Video } from "@/types";
import { getVideos } from "@/services/video";
import { ThumbsUp } from "lucide-react";
import { Button } from "./ui/button";

import { useRouter } from "next/navigation";
import { LoaderOne } from "@/components/ui/loader";

export default function Videos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
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

  const handleVideoDetails = (video: Video) => {
    // Navigate to video details page
    const videoId = video._id;
    router.push(`/videos/${videoId}`);
    console.log("Video details clicked for:", videoId);
  };

  return (
    <div className="relative mx-auto  my-10 flex max-w-7xl flex-col items-center justify-center">
      {/* Decorative Lines */}
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      </div>

      {/* Content */}
      <div className="px-4 py-10 md:py-20">
        <h1 className="text-2xl font-bold mb-6">All Videos</h1>

        {loading ? (
          <>
            <LoaderOne />
          </>
        ) : videos.length === 0 ? (
          <p>No videos found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video._id}
                className="border border-neutral-800 p-4 rounded-lg bg-neutral-950"
              >
                {/* Thumbnail Video with Fixed Height */}
                <div className="relative rounded-lg overflow-hidden mb-3 h-48">
                  <video
                    onClick={() => handleVideoDetails(video)}
                    className="w-full h-full object-cover rounded-lg shadow"
                    controls={false}
                    controlsList="nodownload"
                    poster={video.thumbnail}
                    src={video.videoFile}
                  />
                </div>

                <div className="flex flex-col mt-10">
                  <h2 className="text-lg font-semibold uppercase ">
                  {video.title}
                </h2>
                <p className="text-sm text-neutral-400 line-clamp-2 mt-1 truncate">
                  {video.description}
                </p>
                </div>

                {/* Owner Info */}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
