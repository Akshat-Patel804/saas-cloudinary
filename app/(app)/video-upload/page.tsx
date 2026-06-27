"use client";

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

// Declare a type matching your backend Prisma video model return schema
interface VideoResponse {
  id: string;
  title: string;
  description: string;
  publicId: string;
  originalSize: string;
  compressSize: string;
  duration: string;
  createdAt: string;
}

interface ApiErrorResponse {
  error: string;
  details?: string;
}

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const router = useRouter();
  
  // Max file size configuration (70MB)
  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File size is too large. Max limit is 70MB.");
      return;
    }

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      // Type the axios post response with <VideoResponse>
      const response = await axios.post<VideoResponse>("/api/video-upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("Upload Success:", response.data);
      
      // Clear out inputs upon successful resolution
      setFile(null);
      setTitle("");
      setDescription("");
      
      // Refresh or push user somewhere else if you want
      router.refresh();
      
    } catch (error) {
      // Cast the caught item specifically to an AxiosError to safely read the backend messages
      const axiosError = error as AxiosError<ApiErrorResponse>;
      
      console.error("Upload Client Error:", {
        message: axiosError.message,
        backendDetails: axiosError.response?.data?.details || axiosError.response?.data?.error
      });
      
      alert(axiosError.response?.data?.details || "Upload failed. Please check server logs.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Video File</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
}

export default VideoUpload;