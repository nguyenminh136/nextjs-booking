"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Studio } from "@/interface/Studio";
import { Button } from "@/components/ui/button";

interface StudioGalleryProps {
  studio: Studio;
}

export default function StudioGallery({ studio }: StudioGalleryProps) {
  const images = (studio as any).galleryImages || [studio.imageUrl];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handlePrevious = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Large Image */}
        <div
          className="relative h-96 w-full overflow-hidden rounded-lg bg-gray-100 cursor-pointer group"
          onClick={() => setIsLightboxOpen(true)}
        >
          {images[selectedImageIndex] ? (
            <Image
              src={images[selectedImageIndex]}
              alt={`${studio.name} - Image ${selectedImageIndex + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <span className="text-gray-500">No image</span>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="rounded-full bg-black/50 p-2 text-white hover:bg-black/75 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="rounded-full bg-black/50 p-2 text-white hover:bg-black/75 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 rounded-lg bg-black/50 px-3 py-1 text-sm text-white">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  index === selectedImageIndex
                    ? "border-blue-600"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative flex h-full max-h-screen w-full max-w-4xl flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Large Image */}
            <div className="relative flex-1">
              <Image
                src={images[selectedImageIndex]}
                alt={`${studio.name} - Large view`}
                fill
                className="object-contain"
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 py-4">
              <Button
                onClick={handlePrevious}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <div className="text-center text-white text-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>
              <Button
                onClick={handleNext}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
