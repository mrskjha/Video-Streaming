"use client";

import { useEffect, useState } from "react";
import { Video } from "@/types";
import { getVideos } from "@/services/video";



export default function AllVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

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
          <p>Loading...</p>
        ) : videos.length === 0 ? (
          <p>No videos found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video._id} className="border border-neutral-800 p-4 rounded-lg">
                <video
                  className="w-full h-auto rounded"
                  controls
                  src={video.videoFile}
                />
                <h2 className="text-lg font-semibold mt-2">{video.title.toUpperCase()}</h2>
                <p className="text-sm text-neutral-400">{video.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
