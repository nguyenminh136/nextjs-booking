import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/auth-option";
import { NextRequest, NextResponse } from "next/server";
import { Studio } from "@/interface/Studio";

// Mock data for studios - in production, this would come from a database
const MOCK_STUDIOS: Studio[] = [
  {
    id: "studio-1",
    name: "Downtown Recording Studio",
    address: "123 Main St, New York, NY 10001",
    city: "New York",
    pricePerHour: "150",
    imageUrl: "https://images.unsplash.com/photo-1519415537368-c53beca7f7f1?w=500&h=400&fit=crop",
    capacity: 10,
    rating: 4.8,
    reviewCount: 45,
    equipment: ["microphone", "piano"],
    features: ["Sound Treated", "WiFi", "Parking"],
    createdAt: new Date().toISOString(),
    availability: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "studio-2",
    name: "Creative Sound Lab",
    address: "456 Park Ave, New York, NY 10002",
    city: "New York",
    pricePerHour: "120",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=400&fit=crop",
    capacity: 8,
    rating: 4.6,
    reviewCount: 32,
    equipment: ["microphone"],
    features: ["AC", "WiFi"],
    createdAt: new Date().toISOString(),
    availability: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "studio-3",
    name: "Professional Music Hub",
    address: "789 Broadway, Los Angeles, CA 90001",
    city: "Los Angeles",
    pricePerHour: "180",
    imageUrl: "https://images.unsplash.com/photo-1501612546272-f3fdca59fce0?w=500&h=400&fit=crop",
    capacity: 15,
    rating: 4.9,
    reviewCount: 67,
    equipment: ["microphone", "piano"],
    features: ["Sound Treated", "AC", "WiFi", "Parking"],
    createdAt: new Date().toISOString(),
    availability: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "studio-4",
    name: "Urban Beat Studio",
    address: "321 Sunset Blvd, Los Angeles, CA 90002",
    city: "Los Angeles",
    pricePerHour: "100",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=400&fit=crop",
    capacity: 6,
    rating: 4.4,
    reviewCount: 23,
    equipment: ["microphone"],
    features: ["WiFi"],
    createdAt: new Date().toISOString(),
    availability: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "studio-5",
    name: "Elite Recording Center",
    address: "555 Market St, San Francisco, CA 94102",
    city: "San Francisco",
    pricePerHour: "200",
    imageUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&h=400&fit=crop",
    capacity: 12,
    rating: 4.7,
    reviewCount: 54,
    equipment: ["microphone", "piano"],
    features: ["Sound Treated", "AC", "WiFi", "Parking"],
    createdAt: new Date().toISOString(),
    availability: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "studio-6",
    name: "Bay Area Sound Studio",
    address: "777 Mission St, San Francisco, CA 94103",
    city: "San Francisco",
    pricePerHour: "140",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop",
    capacity: 9,
    rating: 4.5,
    reviewCount: 38,
    equipment: ["microphone"],
    features: ["AC", "WiFi", "Parking"],
    createdAt: new Date().toISOString(),
    availability: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search")?.toLowerCase() || "";
    const city = searchParams.get("city")?.toLowerCase() || "";
    const capacity = searchParams.get("capacity");
    const equipment = searchParams.get("equipment")?.split(",") || [];
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    let filtered = MOCK_STUDIOS;

    // Filter by search (name or address)
    if (search) {
      filtered = filtered.filter(
        (studio) =>
          studio.name.toLowerCase().includes(search) ||
          studio.address.toLowerCase().includes(search)
      );
    }

    // Filter by city
    if (city) {
      filtered = filtered.filter(
        (studio) => studio.city?.toLowerCase() === city
      );
    }

    // Filter by capacity
    if (capacity) {
      const minCapacity = parseInt(capacity);
      filtered = filtered.filter(
        (studio) => (studio.capacity || 0) >= minCapacity
      );
    }

    // Filter by equipment
    if (equipment.length > 0) {
      filtered = filtered.filter((studio) =>
        equipment.some((eq) =>
          studio.equipment?.some(
            (studioEq) => studioEq.toLowerCase() === eq.toLowerCase()
          )
        )
      );
    }

    // Filter by price range
    if (priceMin || priceMax) {
      filtered = filtered.filter((studio) => {
        const price = parseFloat(studio.pricePerHour || "0");
        if (priceMin && price < parseFloat(priceMin)) return false;
        if (priceMax && price > parseFloat(priceMax)) return false;
        return true;
      });
    }

    // Pagination
    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const studios = filtered.slice(start, end);
    const hasNextPage = end < total;

    return NextResponse.json({
      studios,
      total,
      page,
      limit,
      hasNextPage,
    });
  } catch (error: any) {
    console.error("Error fetching studios:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch" },
      { status: 500 }
    );
  }
}
