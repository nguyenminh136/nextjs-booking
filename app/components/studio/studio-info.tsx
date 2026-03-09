"use client";

import React from "react";
import { Studio } from "@/interface/Studio";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Volume2, 
  AlertCircle, 
  FileText, 
  DollarSign, 
  Star,
  Mail,
  Phone,
  Mic,
  Music
} from "lucide-react";

interface StudioInfoProps {
  studio: Studio;
}

export default function StudioInfo({ studio }: StudioInfoProps) {
  return (
    <div className="space-y-6">
      {/* Description */}
      {studio.description && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">About</h2>
          <p className="text-gray-700 leading-relaxed">{studio.description}</p>
        </Card>
      )}

      {/* Rating & Reviews */}
      {studio.rating && (
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(studio.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">
                  {studio.rating.toFixed(1)}
                </p>
                <p className="text-sm text-gray-600">
                  ({studio.reviewCount || 0} reviews)
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Key Features */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Capacity */}
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-600">Capacity</p>
              <p className="text-lg font-bold text-gray-900">
                Up to {studio.capacity} people
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-600">Hourly Rate</p>
              <p className="text-lg font-bold text-gray-900">
                ${studio.pricePerHour}/hr
              </p>
            </div>
          </div>
        </div>

        {/* Studio Features */}
        {studio.features && studio.features.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Studio Features</p>
              <div className="flex flex-wrap gap-2">
                {studio.features.map((feature, index) => (
                  <Badge key={index} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Equipment */}
        {studio.equipment && studio.equipment.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Equipment</p>
              <div className="flex flex-wrap gap-2">
                {studio.equipment.map((eq, index) => (
                  <Badge key={index} variant="outline" className="gap-2">
                    {eq === "microphone" ? (
                      <Mic className="h-4 w-4" />
                    ) : eq === "piano" ? (
                      <Music className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                    {eq.charAt(0).toUpperCase() + eq.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Rules */}
      {studio.rules && studio.rules.length > 0 && (
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <h2 className="text-xl font-bold text-gray-900">House Rules</h2>
          </div>
          <ul className="space-y-2">
            {studio.rules.map((rule, index) => (
              <li key={index} className="flex gap-3 text-gray-700">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Cancellation Policy */}
      {studio.cancellationPolicy && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3 mb-3">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <h2 className="text-xl font-bold text-gray-900">Cancellation Policy</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {studio.cancellationPolicy}
          </p>
        </Card>
      )}

      {/* Owner Contact */}
      {studio.ownerContact && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Host</h2>
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-900">
              {studio.ownerContact.name}
            </p>
            <a
              href={`mailto:${studio.ownerContact.email}`}
              className="flex items-center gap-3 text-blue-600 hover:text-blue-700"
            >
              <Mail className="h-5 w-5" />
              {studio.ownerContact.email}
            </a>
            <a
              href={`tel:${studio.ownerContact.phone}`}
              className="flex items-center gap-3 text-blue-600 hover:text-blue-700"
            >
              <Phone className="h-5 w-5" />
              {studio.ownerContact.phone}
            </a>
          </div>
        </Card>
      )}
    </div>
  );
}
