import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/auth-option";
import { NextRequest, NextResponse } from "next/server";
import { Studio } from "@/interface/Studio";

// Mock data for studios - in production, this would come from a database
const MOCK_STUDIOS: Studio[] = [
  {
    id: "037b0316-7d39-4744-92bc-158451c93af5",
    name: "Downtown Recording Studio",
    address: "123 Main St, New York, NY 10001",
    city: "New York",
    pricePerHour: "150",
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=400&fit=crop",
    capacity: 10,
    rating: 4.8,
    reviewCount: 45,
    equipment: ["microphone", "piano"],
    features: ["Sound Treated", "WiFi", "Parking"],
    createdAt: new Date().toISOString(),
    availability: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    description:
      "Professional downtown recording studio equipped with state-of-the-art equipment, perfect for all music genres and podcast production.",
    rules: [
      "No smoking inside",
      "Respect quiet hours after 10 PM",
      "Proper handling of equipment required",
      "Book cancellations must be made 24 hours in advance"
    ],
    cancellationPolicy:
      "Free cancellation up to 24 hours before booking. 50% refund between 12-24 hours. Non-refundable within 12 hours.",
    ownerContact: {
      name: "John Smith",
      email: "john@downtownstudio.com",
      phone: "+1-555-0101"
    }
  },
  {
    id: "b44e19d8-64ef-4baf-b9d8-e48068e906a4",
    name: "Creative Sound Lab",
    address: "456 Park Ave, New York, NY 10002",
    city: "New York",
    pricePerHour: "120",
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=400&fit=crop",
    capacity: 8,
    rating: 4.6,
    reviewCount: 32,
    equipment: ["microphone"],
    features: ["AC", "WiFi"],
    createdAt: new Date().toISOString(),
    availability: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
    },
    description:
      "Creative sound lab in the heart of Manhattan, ideal for podcasts, voiceovers, and indie music projects.",
    rules: [
      "Arrive 15 minutes early",
      "Bring your own cables if possible",
      "No food or drinks near equipment"
    ],
    cancellationPolicy:
      "Free cancellation up to 48 hours before booking. 25% refund between 24-48 hours. Non-refundable within 24 hours.",
    ownerContact: {
      name: "Sarah Johnson",
      email: "sarah@creativesoundlab.com",
      phone: "+1-555-0102"
    }
  },
  {
    id: "e5da49ae-2f31-4951-8312-cf1ed92fc09c",
    name: "Professional Music Hub",
    address: "789 Broadway, Los Angeles, CA 90001",
    city: "Los Angeles",
    pricePerHour: "180",
    imageUrl:
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&h=400&fit=crop",
    capacity: 15,
    rating: 4.9,
    reviewCount: 67,
    equipment: ["microphone", "piano"],
    features: ["Sound Treated", "AC", "WiFi", "Parking"],
    createdAt: new Date().toISOString(),
    availability: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
    },
    description:
      "Premium recording facility with world-class equipment and experienced sound engineers available for session support.",
    rules: [
      "Professional conduct required",
      "Equipment handling training provided",
      "Booking confirmation 72 hours in advance"
    ],
    cancellationPolicy:
      "Free cancellation up to 14 days. 25% refund 7-14 days. 50% refund 3-7 days. Non-refundable within 3 days.",
    ownerContact: {
      name: "Michael Chen",
      email: "michael@professionalmusiichub.com",
      phone: "+1-555-0103"
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
        studio =>
          studio.name.toLowerCase().includes(search) ||
          studio.address.toLowerCase().includes(search)
      );
    }

    // Filter by city
    if (city) {
      filtered = filtered.filter(studio => studio.city?.toLowerCase() === city);
    }

    // Filter by capacity
    if (capacity) {
      const minCapacity = parseInt(capacity);
      filtered = filtered.filter(
        studio => (studio.capacity || 0) >= minCapacity
      );
    }

    // Filter by equipment
    if (equipment.length > 0) {
      filtered = filtered.filter(studio =>
        equipment.some(eq =>
          studio.equipment?.some(
            studioEq => studioEq.toLowerCase() === eq.toLowerCase()
          )
        )
      );
    }

    // Filter by price range
    if (priceMin || priceMax) {
      filtered = filtered.filter(studio => {
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
      hasNextPage
    });
  } catch (error: any) {
    console.error("Error fetching studios:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch" },
      { status: 500 }
    );
  }
}
