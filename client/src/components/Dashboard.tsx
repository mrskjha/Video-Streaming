"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { useVideoContext } from "@/contexts/videoContext";

import { LoaderOne } from "./ui/loader";
import { Button } from "./ui/button";
import { ArrowUpRight, Plus, Eye, Heart, Video as VideoIcon, FilmIcon } from "lucide-react";
import { Video } from "@/types";

// --- Type Definitions ---




// --- Helper Components with Theme-Aware Styles ---

// 1. Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, className }) => (
  <div className={`rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 ${className}`}>
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
      {icon}
    </div>
    <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">{value}</p>
  </div>
);

// 2. Dashboard Skeleton Loader
const DashboardSkeleton: React.FC = () => (
    <div className="w-full animate-pulse">
        <div className="h-10 w-3/4 rounded-md bg-neutral-200 dark:bg-neutral-800"></div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="h-32 rounded-xl bg-neutral-200 dark:bg-neutral-800"></div>
            <div className="h-32 rounded-xl bg-neutral-200 dark:bg-neutral-800"></div>
            <div className="h-32 rounded-xl bg-neutral-200 dark:bg-neutral-800"></div>
        </div>
        <div className="mt-10 h-8 w-1/3 rounded-md bg-neutral-200 dark:bg-neutral-800"></div>
        <div className="mt-4 space-y-4">
            <div className="h-16 rounded-lg bg-neutral-200 dark:bg-neutral-800"></div>
            <div className="h-16 rounded-lg bg-neutral-200 dark:bg-neutral-800"></div>
        </div>
    </div>
);

// 3. Recent Video Item Component
interface RecentVideoItemProps {
    video: Video;
}
const RecentVideoItem: React.FC<RecentVideoItemProps> = ({ video }) => (
     <Link href={`/videos/${video._id}`}>
        <div className="group flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800">
            <img src={video.thumbnail} alt={video.title} className="h-14 w-24 flex-shrink-0 rounded-md object-cover"/>
            <div className="flex-1">
                <p className="font-semibold text-neutral-900 line-clamp-1 dark:text-white">{video.title}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{video.views || 0} views · {new Date(video.createdAt).toLocaleDateString('en-IN', {day: 'numeric', month:'short', year:'numeric'})}</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-neutral-500 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 dark:text-neutral-600"/>
        </div>
    </Link>
)

// --- Main Dashboard Component ---

const Dashboard: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { videos } = useVideoContext();
  const isVideosLoading = false;
  const router = useRouter();

  const pageIsLoading = isAuthLoading || isVideosLoading;

  const ownedVideos: Video[] = useMemo(
    () => videos?.filter((video: Video) => video.owner?._id === user?._id) || [],
    [videos, user?._id]
  );

  const totalViews: number = useMemo(
    () => ownedVideos.reduce((acc, video) => acc + (video.views || 0), 0),
    [ownedVideos]
  );

  const totalLikes: number = useMemo(
    () => ownedVideos.reduce((acc, video) => acc + (video.likes || 0), 0),
    [ownedVideos]
  );
  
  const recentVideos: Video[] = useMemo(
    () => [...ownedVideos].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3),
    [ownedVideos]
  );

  if (pageIsLoading) {
    return <DashboardSkeleton />;
  }

  // अगर यूज़र ने कोई वीडियो अपलोड नहीं किया है
  if (ownedVideos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 py-20 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
        <FilmIcon className="h-12 w-12 text-neutral-500 dark:text-neutral-600"/>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Welcome, {user?.fullname}!</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">You haven&apos;t uploaded any videos yet. Let&apos;s get started!</p>
        <Button onClick={() => router.push("/upload")} className="mt-6">
          <Plus className="mr-2 h-4 w-4" />
          Upload Your First Video
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Welcome back, {user?.fullname}!</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Here&apos;s a summary of your channel&apos;s activity.</p>
        </div>
        <Button onClick={() => router.push("/upload")} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Upload Video
        </Button>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Videos"
          value={ownedVideos.length}
          icon={<VideoIcon className="h-5 w-5 text-neutral-500" />}
        />
        <StatCard
          title="Total Views"
          value={totalViews.toLocaleString('en-IN')}
          icon={<Eye className="h-5 w-5 text-neutral-500" />}
        />
        <StatCard
          title="Total Likes"
          value={totalLikes.toLocaleString('en-IN')}
          icon={<Heart className="h-5 w-5 text-neutral-500" />}
        />
      </div>
      
      {/* Recent Videos Section */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Recent Uploads</h2>
        <div className="mt-4 flow-root">
            <div className="space-y-3">
                {recentVideos.map(video => (
                    <RecentVideoItem key={video._id} video={video}/>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;