import React,{useState,useEffect,useCallback} from "react";
import { getCldImageUrl,getCldVideoUrl } from "next-cloudinary";
import { Download, Clock, FileDown, FileUp} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {filesize} from "filesize"
import { Video } from "../generated/prisma/client";


dayjs.extend(relativeTime)

interface VideoCardProps {
    video: Video;
    onDownload: (args: { url: string; title: string }) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {

    const [isHovered,setIsHovered] = useState(false);
    const [previewError,setPreviewError] = useState(false);

    
    return (
        <div>VideoCard</div>
    )
}

export default VideoCard;