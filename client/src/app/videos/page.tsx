// src/app/allvideos/page.tsx
"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Videos from "@/components/Videos";


export default function AllVideosPage() {
  return (
    
    <ProtectedRoute>
      <Videos />
    </ProtectedRoute>
  );
}
