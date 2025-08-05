"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// --- Contexts and Services ---
import { useAuth } from "@/contexts/authContext";
import { useVideoContext } from "@/contexts/videoContext";
import { getVideoById, incrementVideoViews } from "@/services/video";
// --- Types ---
import { Video } from "@/types"; 

// --- UI Components and Icons ---
import LikeButton from "@/components/LikeBtn"; // Assuming you have this
import { Button } from "@/components/ui/button";
import { Share2, ThumbsUp, Bell, MessageSquare } from "lucide-react";



// --- स्केलेटन लोडर ---
const VideoPageSkeleton = () => (
  <div className="mx-auto max-w-screen-2xl animate-pulse p-4">
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="aspect-video w-full rounded-xl bg-neutral-200 dark:bg-neutral-800"></div>
        <div className="mt-4 h-8 w-3/4 rounded-lg bg-neutral-200 dark:bg-neutral-800"></div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-neutral-200 dark:bg-neutral-800"></div>
            <div className="h-10 w-32 rounded-lg bg-neutral-200 dark:bg-neutral-800"></div>
          </div>
          <div className="h-10 w-48 rounded-lg bg-neutral-200 dark:bg-neutral-800"></div>
        </div>
        <div className="mt-4 h-24 w-full rounded-xl bg-neutral-200 dark:bg-neutral-800"></div>
      </div>
      <div className="hidden lg:block">
        <div className="h-8 w-1/2 rounded-lg bg-neutral-200 dark:bg-neutral-800"></div>
        <div className="mt-4 space-y-4">
          <div className="h-20 w-full rounded-lg bg-neutral-200 dark:bg-neutral-800"></div>
          <div className="h-20 w-full rounded-lg bg-neutral-200 dark:bg-neutral-800"></div>
          <div className="h-20 w-full rounded-lg bg-neutral-200 dark:bg-neutral-800"></div>
        </div>
      </div>
    </div>
  </div>
);

// --- डिस्क्रिप्शन बॉक्स ---
interface DescriptionBoxProps {
  description: string;
  views: number;
  createdAt: string | Date;
}

const DescriptionBox = ({ description, views, createdAt }: DescriptionBoxProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="mt-4 rounded-xl bg-neutral-100 p-4 dark:bg-neutral-800/50">
      <div className="flex gap-4 text-sm font-semibold text-neutral-800 dark:text-white">
        <p>{views?.toLocaleString('en-IN') || 0} views</p>
        <p>{new Date(createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
      </div>
      <p className={`mt-2 text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap ${!isExpanded && "line-clamp-2"}`}>
        {description}
      </p>
      <button onClick={() => setIsExpanded(!isExpanded)} className="mt-2 text-sm font-semibold text-neutral-800 dark:text-white hover:underline">
        Show {isExpanded ? "less" : "more"}
      </button>
    </div>
  );
};

// --- सजेस्टेड वीडियो कार्ड ---
const SuggestedVideoCard = ({ video }: { video: Video }) => (
    <a href={`/videos/${video._id}`} className="flex gap-3">
        <img src={video.thumbnail} alt={video.title} className="aspect-video w-40 flex-shrink-0 rounded-lg object-cover" />
        <div>
            <h4 className="font-semibold text-neutral-800 dark:text-neutral-100 line-clamp-2">{video.title}</h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{video.owner.fullname}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{video.views.toLocaleString('en-IN')} views</p>
        </div>
    </a>
)


// --- मुख्य वीडियो पेज कंपोनेंट ---
const VideoPage = () => {
  const params = useParams();
  const videoId = params?.videoId as string;
  const { videos: suggestedVideos } = useVideoContext(); // Context से सिर्फ सजेस्टेड वीडियो लेंगे
  
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (videoId) {
      const fetchVideoData = async () => {
        setIsLoading(true);
        try {
          const response = await getVideoById(videoId);
          setVideo(response.message as unknown as Video);
          await incrementVideoViews(videoId);
        } catch (err) {
          setError("Could not load video. Please try again later.");
          console.error("Error fetching video:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchVideoData();
    }
  }, [videoId]);

  if (isLoading) return <VideoPageSkeleton />;
  if (error || !video) return <div className="flex h-screen items-center justify-center text-red-500">{error || "Video not found."}</div>;

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-screen-2xl p-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Main Content: Player and Details */}
          <div className="lg:col-span-2">
            <div className="aspect-video w-full overflow-hidden rounded-xl shadow-lg">
              <video
                src={video.videoFile}
                controls
                autoPlay
                poster={video.thumbnail}
                controlsList="nodownload"
                className="h-full w-full bg-black object-contain"
              />
            </div>

            <h1 className="mt-4 text-2xl font-bold text-neutral-900 dark:text-white">{video.title}</h1>
            
            {/* Action Bar: Owner Info and Buttons */}
            <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <img src={video.owner.avatar} alt={video.owner.fullname} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{video.owner.fullname}</h2>
                  <p className="text-sm text-neutral-500">{video.owner.subscribersCount || 0} subscribers</p>
                </div>
                <Button variant="outline" size="sm" className="ml-4 rounded-full">
                    <Bell size={16} className="mr-2"/> Subscribe
                </Button>
              </div>

              <div className="flex items-center gap-2">
                  <LikeButton videoId={video._id} initialLikes={video.likes} initialLiked={false} />
                  <Button variant="outline" className="rounded-full">
                    <Share2 size={16} className="mr-2"/> Share
                  </Button>
              </div>
            </div>

            <DescriptionBox description={video.description} views={video.views} createdAt={video.createdAt}/>

          </div>

          {/* Sidebar: Suggested Videos */}
          <div className="space-y-4 lg:col-span-1">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Up Next</h3>
            {suggestedVideos
                .filter(v => v._id !== videoId) // वर्तमान वीडियो को लिस्ट से हटाएं
                .map(suggestedVideo => (
                    <SuggestedVideoCard key={suggestedVideo._id} video={suggestedVideo} />
                ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;