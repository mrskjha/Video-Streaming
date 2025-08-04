// app/upload/page.tsx
'use client';

import VideoUpload from "@/components/UploadVideo";
import { useAuth } from "@/contexts/authContext";


export default function UploadPage() {
  const auth = useAuth();
  if(!auth.isAuthenticated) return <div>Please log in to upload videos.</div>;
  return <VideoUpload />;
}
