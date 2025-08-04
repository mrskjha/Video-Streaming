"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/authContext";

const publicRoutes = ["/", "/videos", "/upload", "/login", "/signup"]; // Publicly accessible routes

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const isPublic = publicRoutes.includes(pathname);
      if (!user && !isPublic) {
        router.push("/login");
      }
    }
  }, [user, isLoading, pathname, router]);

  // While loading (e.g., checking localStorage), return null or a loader
  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  // If public route or authenticated, render children
  if (publicRoutes.includes(pathname) || user) {
    return <>{children}</>;
  }

  // Default fallback
  return null;
}
