"use client";
import React, { useState } from "react";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/authContext";
import { useVideoContext } from "@/contexts/videoContext";
import { Video } from "@/types";
import { Pencil, Play, Trash } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const { videos } = useVideoContext();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const links = [
    {
      label: "Dashboard",
      key: "dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "All Videos",
      key: "videos",
      icon: (
        <IconUserBolt className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      key: "settings",
      icon: (
        <IconSettings className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      key: "logout",
      icon: (
        <IconArrowLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div key={idx} onClick={() => setActiveTab(link.key)}>
                  <SidebarLink
                    link={{
                      label: link.label,
                      href: "#",
                      icon: link.icon,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user?.fullname || "Profile",
                href: "#",
                icon: (
                  <img
                    src={user?.avatar || "/default-avatar.png"}
                    className="h-7 w-7 rounded-full"
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Conditionally render sections based on activeTab */}
      {activeTab === "dashboard" && <Dashboard videos={videos} user={user} />}
      {activeTab === "videos" && <UploadedVideos videos={videos} user={user} />}
      {activeTab === "settings" && (
        <div className="flex-1 p-10 text-white">Settings Page</div>
      )}
      {activeTab === "logout" && (
        <div className="flex-1 p-10 text-white">Logging out...</div>
      )}
    </div>
  );
}

const Logo = () => (
  <a
    href="#"
    className="flex items-center space-x-2 py-1 text-sm font-normal text-black"
  >
    <div className="h-5 w-6 bg-black dark:bg-white rounded-lg" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium text-black dark:text-white"
    >
      Acet Labs
    </motion.span>
  </a>
);

const LogoIcon = () => (
  <a
    href="#"
    className="flex items-center space-x-2 py-1 text-sm font-normal text-black"
  >
    <div className="h-5 w-6 bg-black dark:bg-white rounded-lg" />
  </a>
);

interface DashboardProps {
  videos: Video[];
  user: any;
}

const UploadedVideos: React.FC<DashboardProps> = ({ videos, user }) => (
  <div className="flex flex-1">
    <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
      <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
        Uploaded Videos
      </h2>
      <div className="space-y-4">
        {videos && videos.length > 0 ? (
          videos
            .filter((video: Video) => video.owner._id === user?._id)
            .map((video: Video) => (
              <div
                key={video.id}
                className="grid grid-cols-3 items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow p-3 gap-4"
              >
                <div className="flex justify-center">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-20 w-36 object-cover rounded"
                  />
                </div>
                <div className="text-center text-base font-medium text-black dark:text-white">
                  {video.title.toUpperCase()}
                </div>
                <div className="flex justify-center space-x-16 text-black dark:text-white">
                  <button title="Edit">
                    <Pencil />
                  </button>
                  <button title="Delete">
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
            No videos uploaded yet.
          </div>
        )}
      </div>
    </div>
  </div>
);

// You can customize or remove Dashboard if needed
const Dashboard: React.FC<DashboardProps> = ({ videos, user }) => (
  <div className="flex flex-1 items-center justify-center text-white">
    <h1 className="text-3xl font-bold">Welcome, {user?.fullname || "User"}!</h1>
  </div>
);
