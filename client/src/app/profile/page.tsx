"use client";

import React, { useState, useEffect } from "react";
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
import { Loader, Pencil, Play, Trash } from "lucide-react";
import Link from "next/link";
import { LoaderOne } from "@/components/ui/loader";
import { useRouter } from "next/navigation";
import UploadedVideos from "@/components/UploadedVideos";
import Dashboard from "@/components/Dashboard";

export default function ProfilePage() {
  const { user } = useAuth();
  const { videos } = useVideoContext();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  // const router = useRouter();


  const links = [
    {
      label: "Dashboard",
      key: "dashboard",
      icon: <IconBrandTabler className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "All Videos",
      key: "videos",
      icon: <IconUserBolt className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Settings",
      key: "settings",
      icon: <IconSettings className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Logout",
      key: "logout",
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
              {links.map((link) => (
                <button key={link.key} onClick={() => setActiveTab(link.key)} className="text-left">
                  <SidebarLink
                    link={{
                      label: link.label,
                      href: "#",
                      icon: link.icon,
                    }}
                  />
                </button>
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

      {activeTab === "dashboard" && <Dashboard />}
      {activeTab === "videos" && <UploadedVideos />}
      {activeTab === "settings" && (
        <div className="flex-1 p-10 text-white">Settings Page (Coming Soon)</div>
      )}
    </div>
  );
}

const Logo = () => (
  <a href="#" className="flex items-center space-x-2 py-1 text-sm font-normal text-black">
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
  <a href="#" className="flex items-center space-x-2 py-1 text-sm font-normal text-black">
    <div className="h-5 w-6 bg-black dark:bg-white rounded-lg" />
  </a>
);


