"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { createVideo } from "@/services/video";
import { useVideoContext } from "@/contexts/videoContext";
import { useRouter } from "next/navigation";

// --- UI और आइकॉन इम्पोर्ट्स ---
import { Button } from "./ui/button";
import { Loader2Icon, UploadCloud, Image as ImageIcon, X } from "lucide-react";
import { BackgroundBeams } from "./ui/background-beams";

// --- टाइप्स ---
interface ToastProps {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
}



// --- टोस्ट नोटिफिकेशन हुक (UI सुधार के साथ) ---
const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(), 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const typeStyles = {
    success: "bg-green-100 border-green-400 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-200",
    error: "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-200",
  };

  return (
    <div className={`fixed top-5 right-5 z-50 flex max-w-sm items-center rounded-lg border p-4 shadow-lg transition-opacity duration-300 ${typeStyles[type]}`}>
      <p>{message}</p>
      <button onClick={onDismiss} className="ml-4 p-1 text-current/70 hover:text-current">&times;</button>
    </div>
  );
};

// ... useToast 
const useToast = () => {
    interface ToastItem { id: number; message: string; type: "success" | "error"; }
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    
    const showToast = useCallback((message: string, type: "success" | "error") => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);
    
    const dismissToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };
    
    const ToastContainer = () => (
        <div className="fixed top-5 right-5 z-50 space-y-2">
            {toasts.map(toast => <Toast key={toast.id} {...toast} onDismiss={() => dismissToast(toast.id)} />)}
        </div>
    );
    
    return { ToastContainer, toast: { success: (message: string) => showToast(message, "success"), error: (message: string) => showToast(message, "error") }};
};


//--UI components for form elements

const FormCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 shadow-sm ${className}`}>
    {children}
  </div>
);



interface FileDropzoneProps {
    onFileSelect: (file: File) => void;
    acceptedTypes: string;
    selectedFile: File | null;
    children: React.ReactNode;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileSelect, acceptedTypes, selectedFile, children }) => {
    const [isDragging, setIsDragging] = useState(false);
    const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
    const handleDragIn = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragOut = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const borderStyle = isDragging
        ? "border-blue-500"
        : "border-neutral-300 dark:border-neutral-700";

    if (selectedFile) return <>{children}</>;

    return (
        <div onDragEnter={handleDragIn} onDragLeave={handleDragOut} onDragOver={handleDrag} onDrop={handleDrop}
             className={`relative flex h-full min-h-[12rem] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed ${borderStyle} transition-colors`}>
            {children}
        </div>
    );
}

const StyledInput = ({ ...props }) => (
    <input className="mt-1 block w-full rounded-md border-neutral-300 bg-neutral-100/50 px-3 py-2 text-neutral-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" {...props}/>
)

const StyledTextarea = ({ ...props }) => (
    <textarea className="mt-1 block w-full rounded-md border-neutral-300 bg-neutral-100/50 px-3 py-2 text-neutral-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" {...props}/>
)

interface ToggleSwitchProps {
    checked: boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => (
    <label htmlFor="toggle" className="flex cursor-pointer items-center justify-between">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</span>
        <div className="relative">
            <input type="checkbox" id="toggle" className="peer sr-only" checked={checked} onChange={onChange} />
            <div className="block h-8 w-14 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition peer-checked:translate-x-full peer-checked:bg-blue-500"></div>
        </div>
    </label>
);

// --- मुख्य अपलोड कंपोनेंट ---
export default function VideoUpload() {
  const { ToastContainer, toast } = useToast();
  const router = useRouter();
  const { setVideos } = useVideoContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isPublished, setIsPublished] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File, type: 'video' | 'thumbnail') => {
      if (type === 'video' && file.type.startsWith('video/')) setVideoFile(file);
      else if (type === 'thumbnail' && file.type.startsWith('image/')) setThumbnailFile(file);
      else toast.error("Invalid file type.");
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
        setUploadProgress(0); 
        
        
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => (prev < 95 ? prev + 5 : prev));
        }, 200);

        const response = await createVideo(formData);
        
        clearInterval(progressInterval);
        setUploadProgress(100);

        setVideos((prev) => [...(prev || []), response.data]);
        toast.success("Video uploaded successfully!");

        setTimeout(() => {
            router.push('/profile'); 
        }, 1000);

    } catch (error) {
        toast.error("Upload failed. Please try again.");
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-neutral-950">
        <div className="absolute inset-0 z-0 dark:block hidden">
            <BackgroundBeams />
        </div>
        <ToastContainer />
      
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Upload Video</h1>
                <p className="mt-1 text-neutral-500 dark:text-neutral-400">Share your story with the world.</p>
            </header>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left Section */}
                <div className="lg:col-span-2 space-y-6">
                    <FormCard>
                        <div className="p-6 space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Title (required)</label>
                                <StyledInput id="title" value={title} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setTitle(e.target.value)} placeholder="A catchy title for your video" />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Description</label>
                                <StyledTextarea id="description" value={description} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setDescription(e.target.value)} placeholder="Tell viewers about your video" rows={6}/>
                            </div>
                        </div>
                    </FormCard>
                    <FormCard>
                        <div className="p-6">
                             <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Thumbnail</h3>
                             <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Select or drop an image that captures your video&apos;s essence.</p>
                             <div className="mt-4">
                                <FileDropzone onFileSelect={(file) => handleFileSelect(file, 'thumbnail')} acceptedTypes="image/*" selectedFile={thumbnailFile}>
                                    {thumbnailFile ? (
                                        <div className="relative w-full h-48 rounded-md overflow-hidden">
                                            <img src={URL.createObjectURL(thumbnailFile)} alt="Thumbnail Preview" className="h-full w-full object-cover"/>
                                            <button onClick={() => setThumbnailFile(null)} className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/75">
                                                <X size={16}/>
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon className="h-12 w-12 text-neutral-400" />
                                            <button type="button" onClick={() => thumbnailInputRef.current?.click()} className="mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                                Click to upload
                                            </button>
                                            <p className="text-xs text-neutral-500">or drag and drop</p>
                                        </>
                                    )}
                                </FileDropzone>
                                <input ref={thumbnailInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleFileSelect(e.target.files[0], 'thumbnail')}/>
                             </div>
                        </div>
                    </FormCard>
                </div>
                {/* Right Section */}
                <div className="lg:col-span-1 space-y-6">
                    <FormCard>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Video File</h3>
                            <div className="mt-4">
                                <FileDropzone onFileSelect={(file) => handleFileSelect(file, 'video')} acceptedTypes="video/*" selectedFile={videoFile}>
                                     {videoFile ? (
                                        <div className="w-full text-center">
                                            <video src={URL.createObjectURL(videoFile)} className="mx-auto h-24 rounded-md" controls={false} />
                                            <p className="mt-2 text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">{videoFile.name}</p>
                                            <button onClick={() => setVideoFile(null)} className="mt-1 text-sm text-red-600 dark:text-red-500 hover:underline">Remove</button>
                                        </div>
                                    ) : (
                                        <>
                                            <UploadCloud className="h-12 w-12 text-neutral-400" />
                                            <button type="button" onClick={() => videoInputRef.current?.click()} className="mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                                Click to upload
                                            </button>
                                            <p className="text-xs text-neutral-500">or drag and drop</p>
                                        </>
                                    )}
                                </FileDropzone>
                                <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files && handleFileSelect(e.target.files[0], 'video')}/>
                            </div>
                        </div>
                    </FormCard>
                    <FormCard>
                        <div className="p-6 space-y-4">
                            <ToggleSwitch checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} label="Publish Immediately"/>
                            <Button type="button" onClick={handlePublish} disabled={uploading || !videoFile || !thumbnailFile || !title} className="w-full" size="lg">
                                {uploading ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/> : null}
                                {uploading ? `Uploading... ${uploadProgress}%` : "Publish Video"}
                            </Button>
                        </div>
                    </FormCard>
                    {uploading && (
                         <div className="w-full bg-neutral-200 rounded-full h-2.5 dark:bg-neutral-700">
                             <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%`, transition: 'width 0.3s ease-in-out' }}></div>
                         </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}