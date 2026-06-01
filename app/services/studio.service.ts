import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/auth-option";
import { Studio } from "@/interface/Studio";

export interface StudioSearchFilters {
  search?: string;
  location?: string;
  radius?: number;
  city?: string;
  capacity?: number;
  equipment?: string[];
  priceMin?: number;
  priceMax?: number;
  availabilityDate?: string;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  studios: Studio[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

const getStudios = async (
  filters?: StudioSearchFilters
): Promise<SearchResponse | { error: string; status: number }> => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return { error: "Unauthorized missing token", status: 401 };
    }

    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.location) params.append("location", filters.location);
    if (filters?.city) params.append("city", filters.city);
    if (filters?.radius) params.append("radius", filters.radius.toString());
    if (filters?.capacity)
      params.append("capacity", filters.capacity.toString());
    if (filters?.equipment && filters.equipment.length)
      params.append("equipment", filters.equipment.join(","));
    if (filters?.priceMin)
      params.append("priceMin", filters.priceMin.toString());
    if (filters?.priceMax)
      params.append("priceMax", filters.priceMax.toString());
    if (filters?.availabilityDate)
      params.append("availabilityDate", filters.availabilityDate);
    params.append("page", (filters?.page || 1).toString());
    params.append("limit", (filters?.limit || 12).toString());

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/studios?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json"
        },
        cache: "no-store"
      }
    );

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching studios:", error);
    return { error: error.message || "Failed to fetch", status: 500 };
  }
};

export { getStudios };
