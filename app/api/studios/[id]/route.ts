import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/auth-option";
import { NextRequest, NextResponse } from "next/server";

// Mock data - same as in parent route
const MOCK_STUDIOS = [
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
    description: "Professional downtown recording studio equipped with state-of-the-art equipment, perfect for all music genres and podcast production.",
    rules: ["No smoking inside", "Respect quiet hours after 10 PM", "Proper handling of equipment required", "Book cancellations must be made 24 hours in advance"],
    cancellationPolicy: "Free cancellation up to 24 hours before booking. 50% refund between 12-24 hours. Non-refundable within 12 hours.",
    ownerContact: { name: "John Smith", email: "john@downtownstudio.com", phone: "+1-555-0101" },
    galleryImages: [
      "https://images.unsplash.com/photo-1519415537368-c53beca7f7f1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1501612546272-f3fdca59fce0?w=800&h=600&fit=crop",
    ],
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
    description: "Creative sound lab in the heart of Manhattan, ideal for podcasts, voiceovers, and indie music projects.",
    rules: ["Arrive 15 minutes early", "Bring your own cables if possible", "No food or drinks near equipment"],
    cancellationPolicy: "Free cancellation up to 48 hours before booking. 25% refund between 24-48 hours. Non-refundable within 24 hours.",
    ownerContact: { name: "Sarah Johnson", email: "sarah@creativesoundlab.com", phone: "+1-555-0102" },
    galleryImages: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519415537368-c53beca7f7f1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
    ],
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
    description: "Premium recording facility with world-class equipment and experienced sound engineers available for session support.",
    rules: ["Professional conduct required", "Equipment handling training provided", "Booking confirmation 72 hours in advance"],
    cancellationPolicy: "Free cancellation up to 14 days. 25% refund 7-14 days. 50% refund 3-7 days. Non-refundable within 3 days.",
    ownerContact: { name: "Michael Chen", email: "michael@professionalmusicchub.com", phone: "+1-555-0103" },
    galleryImages: [
      "https://images.unsplash.com/photo-1501612546272-f3fdca59fce0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519415537368-c53beca7f7f1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
    ],
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
    description: "Cozy hip-hop and beat production studio in the heart of LA's entertainment district.",
    rules: ["Keep volume reasonable", "No outside food except light snacks", "Return equipment as found"],
    cancellationPolicy: "Free cancellation up to 12 hours. Non-refundable within 12 hours.",
    ownerContact: { name: "DJ Marcus", email: "marcus@urbanbeat.com", phone: "+1-555-0104" },
    galleryImages: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519415537368-c53beca7f7f1?w=800&h=600&fit=crop",
    ],
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
    description: "Elite recording center offering professional mastering and mixing services alongside studio rental.",
    rules: ["Must provide own engineer or hire from our list", "Strict noise ordinance compliance", "Equipment deposit required"],
    cancellationPolicy: "Free cancellation up to 7 days. 50% refund 3-7 days. Non-refundable within 3 days.",
    ownerContact: { name: "Dr. Lisa Wang", email: "lisa@eliterecording.com", phone: "+1-555-0105" },
    galleryImages: [
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1501612546272-f3fdca59fce0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519415537368-c53beca7f7f1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    ],
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
    description: "Versatile studio space perfect for independent artists and small team projects.",
    rules: ["Respect neighboring spaces", "Clean up after session", "Report any equipment issues immediately"],
    cancellationPolicy: "Free cancellation up to 24 hours. 50% refund within 24 hours.",
    ownerContact: { name: "Alex Rivera", email: "alex@bayareasound.com", phone: "+1-555-0106" },
    galleryImages: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519415537368-c53beca7f7f1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
    ],
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: studioId } = await params;
    const studio = MOCK_STUDIOS.find((s) => s.id === studioId);

    if (!studio) {
      return NextResponse.json(
        { error: "Studio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(studio);
  } catch (error: any) {
    console.error("Error fetching studio:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch" },
      { status: 500 }
    );
  }
}
