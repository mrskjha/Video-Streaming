"use client";

import { Pencil, Trash, Play } from "lucide-react";
import { useVideoContext } from "@/contexts/videoContext";
import { useAuth } from "@/contexts/authContext";
import { Video } from "@/types";
import Link from "next/link";
import { PencilSquareIcon, TrashIcon, PlayCircleIcon, EyeIcon } from "@heroicons/react/24/outline";

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
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-8 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Uploaded Videos
        </h2>
        <div className="space-y-5 overflow-y-auto">
          {ownedVideos.length > 0 ? (
            ownedVideos.map((video: Video) => (
              <div
                key={video._id}
                className="flex flex-col rounded-xl border border-neutral-200 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800/50 md:flex-row"
              >
                {/* Thumbnail Section */}
                <div className="relative flex-shrink-0">
                  <Link href={`/videos/${video._id}`} className="group">
                    <img
                      src={video.thumbnail || "/placeholder-thumbnail.jpg"}
                      alt={video.title}
                      className="h-40 w-full rounded-t-xl object-cover md:h-full md:w-48 md:rounded-l-xl md:rounded-r-none"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <PlayCircleIcon className="h-12 w-12 text-white" />
                    </div>
                  </Link>
                </div>

                {/* Video Info & Actions Section */}
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex-1">
                    <Link href={`/videos/${video._id}`} className="group">
                      <h3 className="text-lg font-semibold text-black group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {video.title}
                      </h3>
                    </Link>
                    <div className="mt-2 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                      <EyeIcon className="mr-1.5 h-4 w-4" />
                      <span>{video.views || 0} Views</span>
                      {/* You could add more metadata here, e.g., upload date */}
                      <span className="mx-2">·</span>
                      <span>Uploaded {new Date(video.createdAt).toLocaleDateString()} </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex items-center justify-end space-x-3">
                    <button
                      title="Edit Video"
                      className="flex items-center gap-2 rounded-md bg-neutral-200 px-3 py-1.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      title="Delete Video"
                      onClick={() => deleteHandler(video._id)}
                      className="flex items-center gap-2 rounded-md bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-900/60"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 text-center text-neutral-500 dark:border-neutral-700">
              <h3 className="text-lg font-semibold">No Videos Found</h3>
              <p className="mt-1 text-sm">Upload your first video to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadedVideos;
