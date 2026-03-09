export interface Studio {
  id: string;
  name: string;
  address: string;
  pricePerHour?: string;
  imageUrl?: string;
  createdAt: string;
  capacity?: number;
  rating?: number;
  reviewCount?: number;
  equipment?: string[];
  features?: string[];
  city?: string;
  availabilityDate?: string;
  availability?: {
    startDate: string;
    endDate: string;
  };
  description?: string;
  rules?: string[];
  cancellationPolicy?: string;
  ownerContact?: {
    name: string;
    email: string;
    phone: string;
  };
}
