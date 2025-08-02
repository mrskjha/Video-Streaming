// src/app/allvideos/page.tsx
"use client";
import AllVideos from "@/components/AllVideos";
import ProtectedRoute from "@/components/ProtectedRoute";


export default function AllVideosPage() {
  return (
    <ProtectedRoute>
      <AllVideos />
    </ProtectedRoute>
  );
}
