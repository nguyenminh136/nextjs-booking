"use client";

import React from "react";
import Image from "next/image";
import { Star, MapPin, Users, Volume2 } from "lucide-react";
import { Studio } from "@/interface/Studio";

interface StudioCardProps {
  studio: Studio;
}

export default function StudioCard({ studio }: StudioCardProps) {
  const formatPrice = (price?: string) => {
    if (!price) return "Contact for pricing";
    return `$${price}/hr`;
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {studio.imageUrl ? (
          <Image
            src={studio.imageUrl}
            alt={studio.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <span className="text-gray-500">No image</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col gap-3 p-4">
        {/* Header with Rating */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 line-clamp-2">
              {studio.name}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{studio.address}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        {studio.rating ? (
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(studio.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-900">
              {studio.rating.toFixed(1)}
            </span>
            {studio.reviewCount && (
              <span className="text-sm text-gray-600">
                ({studio.reviewCount})
              </span>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500">No ratings yet</div>
        )}

        {/* Features */}
        <div className="flex flex-wrap gap-1">
          {studio.features && studio.features.length > 0 ? (
            studio.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="inline-block rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
              >
                {feature}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500">No features listed</span>
          )}
          {studio.features && studio.features.length > 2 && (
            <span className="inline-block rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              +{studio.features.length - 2} more
            </span>
          )}
        </div>

        {/* Equipment Indicators */}
        {studio.equipment && studio.equipment.length > 0 && (
          <div className="flex items-center gap-2 border-t border-gray-200 pt-3">
            {studio.equipment.map((eq, index) => (
              <div
                key={index}
                className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1"
              >
                <Volume2 className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-xs font-medium text-gray-700 capitalize">
                  {eq}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Capacity and Price Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>Up to {studio.capacity || 0}</span>
          </div>
          <div className="text-right">
            <div className="font-semibold text-gray-900">
              {formatPrice(studio.pricePerHour)}
            </div>
            <div className="text-xs text-gray-500">per hour</div>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}
