
"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/contexts/authContext";
import { ThemeProvider } from "@/components/theme-provider";
import { VideoProvider } from "@/contexts/videoContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/navbar";

export default function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <VideoProvider>
          {!isPublicRoute ? (
            <ProtectedRoute>
              <div className="relative mx-auto  my-10 flex max-w-7xl flex-col items-center justify-center">
                <Navbar />
              </div>

              <div className="relative mx-auto my-10 max-w-7xl">{children}</div>
            </ProtectedRoute>
          ) : (
            <div className="relative mx-auto my-10 max-w-7xl">{children}</div>
          )}
        </VideoProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
