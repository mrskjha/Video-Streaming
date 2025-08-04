"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Trash, Play } from "lucide-react";
import { useVideoContext } from "@/contexts/videoContext";
import { useAuth } from "@/contexts/authContext";
import { Video } from "@/types";
import Link from "next/link";

import { deleteVideo } from "@/services/video";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const UploadedVideos = () => {
  const { user } = useAuth();
  const { videos, setVideos } = useVideoContext();

  const ownedVideos = videos.filter((video) => video.owner?._id === user?._id);
  const deleteHandler = async (videoId: string) => {
    try {
      await deleteVideo(videoId);
      toast.success("Video deleted successfully");
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (error) {
      console.error("Failed to delete video:", error);
    }
  };
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
          Uploaded Videos
        </h2>
        <div className="space-y-4 overflow-y-auto ">
          {ownedVideos.length > 0 ? (
            ownedVideos.map((video: Video) => (
              <div
                key={video._id}
                className="grid grid-cols-3 items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow p-3 gap-4"
              >
                <div className="flex justify-center">
                  <img
                    src={video.thumbnail || "/placeholder-thumbnail.jpg"}
                    alt={video.title}
                    className="h-20 w-36 object-cover rounded"
                  />
                </div>
                <div className="text-center text-base font-medium text-black dark:text-white">
                  {video.title.toUpperCase()}
                </div>
                <div className="flex justify-center space-x-10 text-black dark:text-white">
                  <button title="Edit">
                    <Pencil />
                  </button>
                  <button
                    title="Delete"
                    className="cursor-pointer text-red-800"
                    onClick={() => deleteHandler(video._id)}
                  >
                    <Trash />
                  </button>
                  <Link href={`/videos/${video._id}`} title="Play">
                    <button className="hover:opacity-80 transition cursor-pointer">
                      <Play />
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-neutral-500">
              No uploaded videos found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadedVideos;
