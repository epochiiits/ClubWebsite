"use client";
import Image from "next/image";
import { useEffect } from "react";

interface GalleryImageProps {
  src: string;
  alt: string;
  aspect?: string; 
  className?: string;
  fill?: boolean; 
  width?: number;
  height?: number;
}

export default function GalleryImage({
  src,
  alt,
  aspect = "aspect-video",
  className = "",
  fill = true,
  width,
  height,
}: GalleryImageProps) {
  useEffect(() => {
    console.log("Image src:", src);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/placeholder.svg?height=200&width=300&text=No+Image";
  };

  return (
    <div
      className={`relative w-full bg-muted overflow-hidden ${aspect} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        onError={handleError}
      />
    </div>
  );
}
