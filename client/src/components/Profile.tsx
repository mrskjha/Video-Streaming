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

export default function ProfilePage() {
  const { user } = useAuth();
  const { videos } = useVideoContext();
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <IconBrandTabler className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "All Videos",
      href: "#",
      icon: <IconUserBolt className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <IconArrowLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />,
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
                <SidebarLink key={idx} link={link} />
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

      <Dashboard videos={videos.map((video) => ({
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
      }))} />
    </div>
  );
}

const Logo = () => (
  <a href="#" className="flex items-center space-x-2 py-1 text-sm font-normal text-black">
    <div className="h-5 w-6 bg-black dark:bg-white rounded-lg" />
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium text-black dark:text-white">
      Acet Labs
    </motion.span>
  </a>
);

const LogoIcon = () => (
  <a href="#" className="flex items-center space-x-2 py-1 text-sm font-normal text-black">
    <div className="h-5 w-6 bg-black dark:bg-white rounded-lg" />
  </a>
);

const Dashboard = ({ videos }: { videos: { id: string; title: string; thumbnail: string }[] }) => (
  <div className="flex flex-1">
    <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
      <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Uploaded Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {videos && videos.length > 0 ? (
          videos.map((video) => (
            <div key={video.id} className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow p-3">
              <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover rounded mb-2" />
              <span className="text-base font-medium text-black dark:text-white block text-center">
                {video.title}
              </span>
            </div>
          ))
        ) : (
          <div className="col-span-full text-neutral-500 text-center">No videos uploaded yet.</div>
        )}
      </div>
    </div>
  </div>
);
