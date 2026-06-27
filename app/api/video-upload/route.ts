import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { prisma } from "@/lib/prisma";

require('dotenv').config();

export const maxDuration = 60; 
export const dynamic = 'force-dynamic'; 

// Fallbacks to bypass the Next.js runtime environment bug
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const API_KEY = process.env.CLOUDINARY_API_KEY 
const API_SECRET = process.env.CLOUDINARY_API_SECRET 
// Configuration
cloudinary.config({ 
    cloud_name: CLOUD_NAME, 
    api_key: API_KEY, 
    api_secret: API_SECRET
});

interface CloudinaryUploadResult {
    public_id: string;
    bytes: number;
    duration?: number;
    [key: string]: any;
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // FIX: Check the local fallback variables instead of process.env
        if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
            return NextResponse.json({ error: "Cloudinary credentials not found" }, { status: 500 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const originalSize = formData.get("originalSize") as string; 
        
        if (!file) {
            return NextResponse.json({ error: "file not found" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "video",
                        folder: "video-upload",
                        transformation: [
                            { quality: "auto", fetch_format: "mp4" } 
                        ]
                    },
                    (error, result) => { 
                        if (error) reject(error);
                        else if (!result) reject(new Error("Upload failed"));
                        else resolve(result);
                    }
                );
                uploadStream.end(buffer);
            }
        );

        const video = await prisma.video.create({
            data: {
                title,
                description,
                publicId: result.public_id,
                originalSize: originalSize,
                compressSize: String(result.bytes),
                duration: result.duration?.toString() ?? ""
            }
        });

        return NextResponse.json(video);

    } catch (error) {
        console.log("upload video failed", error);
        return NextResponse.json({ error: "upload video failed" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}