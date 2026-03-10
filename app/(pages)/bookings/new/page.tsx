'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/container';
import { BookingForm } from '@/components/booking/booking-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Studio } from '@/interface/Studio';
import { Loader2 } from 'lucide-react';

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const studioId = searchParams.get('studioId');
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');

  useEffect(() => {
    const fetchStudio = async () => {
      if (!studioId) {
        setError('No studio selected');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/studios/${studioId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch studio details');
        }
        const data = await response.json();
        setStudio(data);
      } catch (err) {
        setError('Failed to load studio details');
      } finally {
        setLoading(false);
      }
    };

    fetchStudio();
  }, [studioId]);

  if (loading) {
    return (
      <Container className="py-12">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Container>
    );
  }

  if (error || !studio || !startTime || !endTime) {
    return (
      <Container className="py-12">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Error</CardTitle>
            <CardDescription>{error || 'Invalid booking request'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/studios')} variant="outline">
              Browse Studios
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <BookingForm
            studio={studio}
            slotStartTime={startTime}
            slotEndTime={endTime}
          />
        </div>

        {/* Sidebar with studio info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Studio Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Studio Name</p>
                <p className="font-semibold">{studio.name}</p>
              </div>
              {studio.location && (
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="text-sm">{studio.location}</p>
                </div>
              )}
              {studio.description && (
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="text-sm">{studio.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
