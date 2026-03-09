"use client";

import React, { useState, useCallback, useEffect } from "react";
import StudioSearchFilter from "./studio-search-filter";
import StudioList from "./studio-list";
import { Studio } from "@/interface/Studio";

interface SearchFilters {
  search: string;
  city: string;
  capacity?: number;
  equipment: string[];
  priceMin: number;
  priceMax: number;
  availabilityDate: string;
  page: number;
}

export default function StudioSearchPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    city: "",
    capacity: undefined,
    equipment: [],
    priceMin: 0,
    priceMax: 250,
    availabilityDate: "",
    page: 1,
  });

  // Fetch studios
  const fetchStudios = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.city) params.append("city", filters.city);
      if (filters.capacity) params.append("capacity", filters.capacity.toString());
      if (filters.equipment.length > 0) params.append("equipment", filters.equipment.join(","));
      if (filters.priceMin > 0) params.append("priceMin", filters.priceMin.toString());
      if (filters.priceMax < 250) params.append("priceMax", filters.priceMax.toString());
      if (filters.availabilityDate) params.append("availabilityDate", filters.availabilityDate);
      params.append("page", filters.page.toString());
      params.append("limit", "12");

      const response = await fetch(`/api/studios?${params.toString()}`);
      const data = await response.json();

      if (data && data.studios) {
        setStudios(data.studios);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Error fetching studios:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Fetch on filter/page change
  useEffect(() => {
    fetchStudios();
  }, [fetchStudios]);

  // Handle filter changes
  const handleSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const handleLocationChange = useCallback((city: string) => {
    setFilters((prev) => ({ ...prev, city, page: 1 }));
  }, []);

  const handleCapacityChange = useCallback((capacity: number | undefined) => {
    setFilters((prev) => ({ ...prev, capacity, page: 1 }));
  }, []);

  const handleEquipmentChange = useCallback((equipment: string[]) => {
    setFilters((prev) => ({ ...prev, equipment, page: 1 }));
  }, []);

  const handlePriceRangeChange = useCallback((priceMin: number, priceMax: number) => {
    setFilters((prev) => ({ ...prev, priceMin, priceMax, page: 1 }));
  }, []);

  const handleAvailabilityChange = useCallback((date: string) => {
    setFilters((prev) => ({ ...prev, availabilityDate: date, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-2 py-4 md:gap-3 md:py-6">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Studio</h1>
          <p className="text-gray-600">
            Search and filter from our collection of professional recording studios
          </p>
        </div>

        {/* Main Layout: Filters Sidebar + Results */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <StudioSearchFilter
              onSearch={handleSearch}
              onLocationChange={handleLocationChange}
              onCapacityChange={handleCapacityChange}
              onEquipmentChange={handleEquipmentChange}
              onPriceRangeChange={handlePriceRangeChange}
              onAvailabilityChange={handleAvailabilityChange}
            />
          </div>

          {/* Results */}
          <div className="flex-1">
            <StudioList
              studios={studios}
              isLoading={isLoading}
              total={total}
              page={filters.page}
              limit={12}
              hasNextPage={filters.page * 12 < total}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
