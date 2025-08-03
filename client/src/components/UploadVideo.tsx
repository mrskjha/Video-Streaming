"use client";
import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { createVideo } from "@/services/video";
import { ToastProps } from "@/types";
// import { FileUpload } from "./ui/file-upload";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { BackgroundBeams } from "./ui/background-beams";
import { Label } from "@radix-ui/react-dropdown-menu";

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const baseStyle =
    "fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white transition-opacity duration-300";
  const typeStyle = type === "success" ? "bg-green-600" : "bg-red-600";

  return <div className={`${baseStyle} ${typeStyle}`}>{message}</div>;
};

const useToast = () => {
  interface ToastItem {
    id: number;
    message: string;
    type: "success" | "error";
  }
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  let toastId = 0;

  const showToast = (message: any, type: "success" | "error") => {
    const id = toastId++;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onDismiss={() => dismissToast(toast.id)}
        />
      ))}
    </>
  );

  return {
    ToastContainer,
    toast: {
      success: (message: string) => showToast(message, "success"),
      error: (message: string) => showToast(message, "error"),
    },
  };
};

// /**
//  * Real Video Service using Axios
//  * This function sends the video data to a backend server.
//  * @param {FormData} formData - The form data containing video details and files.
//  * @returns {Promise<any>} A promise that resolves with the response data.
//  */

// --- UI Components ---
const FileUpload = () => (
  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
    <svg
      className="mx-auto h-12 w-12 text-gray-500"
      stroke="currentColor"
      fill="none"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <p className="mt-4 text-sm text-gray-400">
      <span className="font-semibold text-blue-400">Click to upload</span> or
      drag and drop
    </p>
    <p className="text-xs text-gray-500">MP4, AVI, MOV (max 2GB)</p>
  </div>
);

// export function FileUploadDemo() {
//   const [files, setFiles] = useState<File[]>([]);
//   const handleFileUpload = (files: File[]) => {
//     setFiles(files);
//     console.log(files);
//   };
// }

// --- Main App Component ---
export default function App() {
  const { ToastContainer, toast } = useToast();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Refs for file inputs to trigger them programmatically
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleVideoSelect = (file: File) => {
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
    } else {
      toast.error("Invalid file type. Please upload a video.");
    }
  };

  const handleThumbnailSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setThumbnailFile(file);
    } else {
      toast.error("Invalid thumbnail file.");
    }
  };

  const handleSaveDraft = () => {
    if (!title) {
      toast.error("A title is required to save a draft.");
      return;
    }
    toast.success("Draft saved successfully!");
    console.log("Saving draft:", { title, description });
  };

  const handlePublish = async () => {
    if (!videoFile || !thumbnailFile || !title) {
      toast.error("Please provide a title, video file, and thumbnail.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("isPublished", String(isPublished));
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnailFile);

    try {
      setUploading(true);
      // Call the createVideo service to upload the video
      await createVideo(formData);
      toast.success("Video uploaded successfully!");

      // Reset form state after successful upload
      setVideoFile(null);
      setThumbnailFile(null);
      setTitle("");
      setDescription("");
      setIsPublished(true);
    } catch (error) {
      toast.error("Upload failed. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased mt-20">
      <ToastContainer />
      <style>{`
        .toggle-checkbox:checked {
            right: 0;
            border-color: #4A90E2;
        }
        .toggle-checkbox:checked + .toggle-label {
            background-color: #4A90E2;
        }
      `}</style>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 z-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Upload Video
          </h1>
          <p className="mt-1 text-gray-400">
            Add details and upload your video file to share it with the world.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section: Details & Thumbnail */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-neutral-950 rounded-lg shadow-md p-6">
              <div>
                <Label className="block text-xl font-medium text-white mb-1">
                  Title (required)
                </Label>
                <textarea
                  id="video-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your video a catchy title"
                  className="rounded-lg border border-neutral-800 pl-6 mt-4 pt-2 focus:ring-2 focus:ring-teal-500  w-full relative z-10   bg-neutral-950 placeholder:text-white placeholder:font-semibold  "
                />
              </div>
              <div className="mt-4">
                <Label className="block text-xl font-medium text-white mb-1 ">
                  Description
                </Label>
                <textarea
                  id="video-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell viewers about your video"
                  rows={8}
                  className="rounded-lg border border-neutral-800 pl-6 mt-4 pt-2 focus:ring-2 focus:ring-teal-500  w-full relative z-10   bg-neutral-950 placeholder:text-white placeholder:font-semibold  "
                />
              </div>
            </div>

            <div className="bg-neutral-950 rounded-lg shadow-md p-6 -mt-10">
              <h2 className="text-xl font-semibold mb-2 text-white">
                Thumbnail
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Select or upload a picture that shows what's in your video.
              </p>
              <div className="flex items-center gap-4 mt-4 z-10">
                <div className="w-48 h-27 bg-gray-800 rounded-md flex items-center justify-center overflow-hidden">
                  {thumbnailFile ? (
                    <img
                      src={URL.createObjectURL(thumbnailFile)}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-48 w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <div className="text-center">
                        <svg
                          className="mx-auto h-10 w-10 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 16l4-4a3 3 0 014.24 0l3.6 3.6a1.5 1.5 0 002.12 0L21 10M3 20h18"
                          />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">
                          No thumbnail selected
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <Button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    disabled={uploading}
                    className="z-10"
                  >
                    Upload Thumbnail
                  </Button>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleThumbnailSelect(file);
                    }}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Upload & Publish */}
          <div className="space-y-6 z-10">
            <div
              className=" rounded-lg shadow-md p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => !videoFile && videoInputRef.current?.click()}
            >
              {videoFile ? (
                <div>
                  <p className="text-sm font-medium text-white truncate">
                    {videoFile.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Ready to be published!
                  </p>
                  <button
                    onClick={() => setVideoFile(null)}
                    className="mt-2 text-sm text-red-400 hover:text-red-500"
                  >
                    Remove Video
                  </button>
                </div>
              ) : (
                <FileUpload />
              )}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleVideoSelect(file);
                }}
              />
            </div>

            <div className="rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Visibility
              </h2>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="is-published"
                  className="text-sm font-medium text-gray-300"
                >
                  Publish Immediately
                </label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input
                    type="checkbox"
                    id="is-published"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <Label
                   
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"
                  ></Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={handleSaveDraft}
                disabled={uploading}
              >
                Save Draft
              </Button>
              <Button
                type="button"
                onClick={handlePublish}
                disabled={uploading}
              >
                {uploading ? (
                  <Button size="sm" disabled>
                    <Loader2Icon className="animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  "Publish"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}
