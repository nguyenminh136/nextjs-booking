"use client";

import React from "react";
import { Studio } from "@/interface/Studio";
import StudioCard from "./studio-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StudioListProps {
  studios: Studio[];
  isLoading: boolean;
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export default function StudioList({
  studios,
  isLoading,
  total,
  page,
  limit,
  hasNextPage,
  onPageChange,
}: StudioListProps) {
  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, total);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-gray-200 bg-white overflow-hidden"
            >
              <div className="h-48 w-full bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (studios.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
        <div className="text-gray-500">
          <p className="text-lg font-medium">No studios found</p>
          <p className="mt-1 text-sm">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-medium text-gray-900">{startIdx}</span> to{" "}
        <span className="font-medium text-gray-900">{endIdx}</span> of{" "}
        <span className="font-medium text-gray-900">{total}</span> studios
      </div>

      {/* Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio) => (
          <StudioCard key={studio.id} studio={studio} />
        ))}
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          {/* Page Indicators */}
          <div className="flex items-center gap-2">
            {[...Array(Math.ceil(total / limit))].map((_, i) => {
              const pageNum = i + 1;
              if (
                pageNum === 1 ||
                pageNum === Math.ceil(total / limit) ||
                (pageNum >= page - 1 && pageNum <= page + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`h-9 w-9 rounded-lg border text-sm font-medium transition-all ${
                      pageNum === page
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                (pageNum === 2 && page > 3) ||
                (pageNum === Math.ceil(total / limit) - 1 && page < Math.ceil(total / limit) - 2)
              ) {
                return (
                  <span key={pageNum} className="text-gray-500">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
