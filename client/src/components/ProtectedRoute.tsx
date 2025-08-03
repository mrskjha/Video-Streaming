"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/authContext";

const publicRoutes = ["/", "/videos", "/upload"]; // Allow these without login

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      if (!user && !publicRoutes.includes(pathname)) {
        router.push("/login"); // Redirect if not logged in
      }
    }
  }, [user, pathname, router]);

  // If it's public or logged in, show the children
  if (publicRoutes.includes(pathname) || user) {
    return <>{children}</>;
  }

  return null;
}
