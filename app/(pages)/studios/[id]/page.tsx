"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Studio } from "@/interface/Studio";
import StudioGallery from "@/components/studio/studio-gallery";
import StudioInfo from "@/components/studio/studio-info";
import StudioAvailability from "@/components/studio/studio-availability";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function StudioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const studioId = params.id as string;

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/studios/${studioId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch studio");
        }
        const data = await res.json();
        setStudio(data);
      } catch (err) {
        console.error("Error fetching studio:", err);
        setError("Failed to load studio details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudio();
  }, [studioId]);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-6 py-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-96 lg:col-span-2" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !studio) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-12">
        <p className="mb-4 text-lg text-gray-600">{error || "Studio not found"}</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6 py-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{studio.name}</h1>
            {studio.city && (
              <p className="mt-1 text-gray-600">{studio.address}</p>
            )}
          </div>
        </div>

        {/* Gallery */}
        <StudioGallery studio={studio} />

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Info */}
          <div className="lg:col-span-2">
            <StudioInfo studio={studio} />
          </div>

          {/* Right Column - Booking */}
          <div>
            <StudioAvailability studioId={studio.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
