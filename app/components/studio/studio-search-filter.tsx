"use client";

import React, { useState, useCallback } from "react";
import { Search, X } from "lucide-react";

interface SearchFilterProps {
  onSearch: (search: string) => void;
  onLocationChange: (location: string) => void;
  onCapacityChange: (capacity: number | undefined) => void;
  onEquipmentChange: (equipment: string[]) => void;
  onPriceRangeChange: (min: number, max: number) => void;
  onAvailabilityChange: (date: string) => void;
}

const EQUIPMENT_OPTIONS = [
  { id: "microphone", label: "Microphone" },
  { id: "piano", label: "Piano" },
];

const CITY_OPTIONS = ["New York", "Los Angeles", "San Francisco"];
const CAPACITY_OPTIONS = [6, 8, 10, 12, 15];
const PRICE_RANGES = { min: 0, max: 250 };

export default function StudioSearchFilter({
  onSearch,
  onLocationChange,
  onCapacityChange,
  onEquipmentChange,
  onPriceRangeChange,
  onAvailabilityChange,
}: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState<number | undefined>();
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(250);
  const [availabilityDate, setAvailabilityDate] = useState("");

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      onSearch(value);
    },
    [onSearch]
  );

  const handleLocationChange = useCallback(
    (city: string) => {
      setSelectedCity(city === selectedCity ? "" : city);
      onLocationChange(city === selectedCity ? "" : city);
    },
    [selectedCity, onLocationChange]
  );

  const handleCapacityChange = useCallback(
    (capacity: number) => {
      const newCapacity = capacity === selectedCapacity ? undefined : capacity;
      setSelectedCapacity(newCapacity);
      onCapacityChange(newCapacity);
    },
    [selectedCapacity, onCapacityChange]
  );

  const handleEquipmentChange = useCallback(
    (equipment: string) => {
      const newEquipment = selectedEquipment.includes(equipment)
        ? selectedEquipment.filter((e) => e !== equipment)
        : [...selectedEquipment, equipment];
      setSelectedEquipment(newEquipment);
      onEquipmentChange(newEquipment);
    },
    [selectedEquipment, onEquipmentChange]
  );

  const handlePriceChange = useCallback(
    (newMin: number, newMax: number) => {
      setPriceMin(newMin);
      setPriceMax(newMax);
      onPriceRangeChange(newMin, newMax);
    },
    [onPriceRangeChange]
  );

  const handleAvailabilityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = e.target.value;
      setAvailabilityDate(date);
      onAvailabilityChange(date);
    },
    [onAvailabilityChange]
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("");
    setSelectedCapacity(undefined);
    setSelectedEquipment([]);
    setPriceMin(0);
    setPriceMax(250);
    setAvailabilityDate("");
    onSearch("");
    onLocationChange("");
    onCapacityChange(undefined);
    onEquipmentChange([]);
    onPriceRangeChange(0, 250);
    onAvailabilityChange("");
  };

  return (
    <div className="w-full space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Search */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Studio name or location..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Location Filter */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <div className="space-y-2">
          {CITY_OPTIONS.map((city) => (
            <button
              key={city}
              onClick={() => handleLocationChange(city)}
              className={`w-full rounded-lg border px-4 py-2 text-left text-sm font-medium transition-all ${
                selectedCity === city
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Capacity Filter */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Capacity</label>
        <div className="space-y-2">
          {CAPACITY_OPTIONS.map((capacity) => (
            <button
              key={capacity}
              onClick={() => handleCapacityChange(capacity)}
              className={`w-full rounded-lg border px-4 py-2 text-left text-sm font-medium transition-all ${
                selectedCapacity === capacity
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              {capacity}+ people
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Filter */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Equipment</label>
        <div className="space-y-2">
          {EQUIPMENT_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2 cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedEquipment.includes(option.id)}
                onChange={() => handleEquipmentChange(option.id)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Price Range: ${priceMin} - ${priceMax}/hour
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min={PRICE_RANGES.min}
            max={PRICE_RANGES.max}
            value={priceMin}
            onChange={(e) => {
              const newMin = parseInt(e.target.value);
              if (newMin <= priceMax) handlePriceChange(newMin, priceMax);
            }}
            className="w-full"
          />
          <input
            type="range"
            min={PRICE_RANGES.min}
            max={PRICE_RANGES.max}
            value={priceMax}
            onChange={(e) => {
              const newMax = parseInt(e.target.value);
              if (newMax >= priceMin) handlePriceChange(priceMin, newMax);
            }}
            className="w-full"
          />
        </div>
      </div>

      {/* Availability Date */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Available From</label>
        <input
          type="date"
          value={availabilityDate}
          onChange={handleAvailabilityChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <X className="h-4 w-4" />
        Clear Filters
      </button>
    </div>
  );
}
