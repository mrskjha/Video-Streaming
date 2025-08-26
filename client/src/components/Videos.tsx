"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useVideoContext } from "@/contexts/videoContext";
import { useAuth } from "@/contexts/authContext";

import { Video } from "@/types";
import { ClockIcon, EyeIcon, FilmIcon } from "lucide-react";
import { LoaderOne } from "@/components/ui/loader";
import { Button } from "./ui/button";

// --- Helper Components ---
const VideoGridSkeleton = () => (
  <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="animate-pulse space-y-3">
        <div className="h-48 rounded-lg bg-neutral-800"></div>
        <div className="space-y-2">
          <div className="h-4 rounded bg-neutral-800"></div>
          <div className="h-4 w-3/4 rounded bg-neutral-800"></div>
        </div>
        <div className="flex items-center gap-x-3 pt-2">
          <div className="h-8 w-8 rounded-full bg-neutral-800"></div>
          <div className="h-4 w-1/3 rounded bg-neutral-800"></div>
        </div>
      </div>
    ))}
  </div>
);

interface EmptyStateProps {
  title: string;
  message: string;
}
const EmptyState = ({ title, message }: EmptyStateProps) => (
  <div className="col-span-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-800 py-20 text-center">
    <FilmIcon className="h-12 w-12 text-neutral-600" />
    <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
    <p className="mt-2 text-sm text-neutral-400">{message}</p>
  </div>
);

const AuthPrompt = () => {
  const router = useRouter();
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-800 py-20 text-center">
      <h3 className="text-xl font-semibold text-white">Login Required</h3>
      <p className="mt-2 text-sm text-neutral-400">
        Please log in to view and interact with videos.
      </p>
      <Button onClick={() => router.push("/login")} className="mt-6">
        Go to Login
      </Button>
    </div>
  );
};

// --- Main Videos Component ---
const Videos = () => {
  const { videos, loading, searchTerm } = useVideoContext();
  const { isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleMouseEnter = (index: number) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index]?.play().catch(() => {});
    }
  };

  const handleMouseLeave = (index: number) => {
    const videoElement = videoRefs.current[index];
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const renderContent = () => {
    // ✅ Always make sure videos is an array
    const safeVideos: Video[] = Array.isArray(videos) ? videos : [];

    const filteredVideos = searchTerm
      ? safeVideos.filter((video) =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : safeVideos;

    if (isAuthLoading) {
      return <LoaderOne />;
    }

    if (!isAuthenticated) {
      return <AuthPrompt />;
    }

    if (filteredVideos.length === 0) {
      return (
        <EmptyState
          title="No Videos Found"
          message="Your search did not match any videos. Please try a different term."
        />
      );
    }

    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredVideos.map((video, index) => (
          <Link href={`/videos/${video._id}`} key={video._id}>
            <div
              className="group flex h-full flex-col"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <div className="relative mb-3 h-48 w-full overflow-hidden rounded-lg border border-neutral-800">
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  src={video.videoFile}
                  poster={video.thumbnail}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                {video.duration && (
                  <div className="absolute bottom-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-xs font-semibold text-white">
                    {Math.round(video.duration / 60)}:
                    {String(Math.round(video.duration % 60)).padStart(2, "0")}
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex-1">
                  <h2 className="text-md font-semibold text-white line-clamp-2">
                    {video.title}
                  </h2>
                  <div className="mt-2 flex items-center space-x-3 text-xs text-neutral-400">
                    <div className="flex items-center">
                      <EyeIcon className="mr-1 h-3 w-3" /> {video.views || 0}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="mr-1 h-3 w-3" />{" "}
                      {formatDate(String(video.createdAt))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-x-3">
                  <img
                    src={video.owner.avatar}
                    alt={video.owner.fullname}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <h3 className="text-sm font-medium text-neutral-300">
                    {video.owner.fullname}
                  </h3>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="relative mx-auto my-10 w-full max-w-7xl">
      <div className="pointer-events-none absolute inset-y-0 left-0 h-full w-px bg-neutral-800/80">
        <div className="absolute top-1/4 h-40 w-px animate-glow bg-gradient-to-b from-transparent via-purple-500 to-transparent" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-px bg-neutral-800/80">
        <div className="absolute bottom-1/4 h-40 w-px animate-glow delay-1000 bg-gradient-to-b from-transparent via-purple-500 to-transparent" />
      </div>

      <div className="w-full px-4 py-10 md:py-20">
        <h1 className="mb-8 text-3xl font-bold text-white">All Videos</h1>
        {loading ? (
          <div className="flex justify-center">
            <LoaderOne />
          </div>
        ) : !Array.isArray(videos) || videos.length === 0 ? (
          <EmptyState
            title="No Videos Found"
            message="There are no videos to display at the moment."
          />
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default Videos;
