'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Booking } from '@/interface/Booking';
import { handleAuthError, isAuthError } from '@/lib/auth-error-handler';
import { Loader2 } from 'lucide-react';

interface BookingConfirmationProps {
  bookingId: string;
}

export function BookingConfirmation({ bookingId }: BookingConfirmationProps) {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`);

        if (response.status === 401) {
          handleAuthError();
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          if (isAuthError(data)) {
            handleAuthError();
            return;
          }
          throw new Error(data.error || 'Failed to fetch booking');
        }

        setBooking(data);
      } catch (err: any) {
        if (isAuthError(err)) {
          handleAuthError();
          return;
        }
        setError(err.message || 'Failed to load booking confirmation');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
          <Button onClick={() => router.push('/bookings')} variant="outline">
            Go back to Bookings
          </Button>
        </CardContent>
      </Card>
    );
  }

  const statusBadgeVariant = booking.status === 'confirmed' ? 'default' : 'secondary';
  const statusLabel = booking.status === 'pending_payment' ? 'Pending Payment' : 'Confirmed';

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-700">Booking Confirmed!</CardTitle>
          <CardDescription>
            Your booking has been successfully created. Please review the details below.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Booking Details</CardTitle>
            <Badge variant={statusBadgeVariant}>{statusLabel}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {/* Studio */}
            <div>
              <p className="text-sm text-gray-600">Studio</p>
              <p className="font-semibold">{booking.studio?.name}</p>
            </div>

            {/* Date */}
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold">
                {new Date(booking.startTime).toLocaleDateString()}
              </p>
            </div>

            {/* Time */}
            <div>
              <p className="text-sm text-gray-600">Time</p>
              <p className="font-semibold">
                {new Date(booking.startTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                {' - '}
                {new Date(booking.endTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* Purpose */}
            <div>
              <p className="text-sm text-gray-600">Purpose</p>
              <p className="font-semibold">{booking.purpose}</p>
            </div>

            {/* Attendees */}
            <div>
              <p className="text-sm text-gray-600">Attendees</p>
              <p className="font-semibold">{booking.attendeesCount} people</p>
            </div>

            {/* Payment Method */}
            <div>
              <p className="text-sm text-gray-600">Payment</p>
              <p className="font-semibold capitalize">
                {booking.paymentMethod === 'pay_on_site' ? 'Pay on Site' : 'Online Payment'}
              </p>
            </div>
          </div>

          {booking.note && (
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">Notes</p>
              <p className="text-sm mt-1">{booking.note}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      {booking.status === 'pending_payment' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-700">Payment Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-blue-700">
              Your booking is pending payment. Please complete the payment to confirm your reservation.
            </p>
            <Button className="w-full" onClick={() => router.push(`/bookings/${bookingId}/payment`)}>
              Proceed to Payment
            </Button>
          </CardContent>
        </Card>
      )}

      {booking.status === 'confirmed' && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-700">Booking Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700">
              Your booking is confirmed. You will receive a confirmation email shortly.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => router.push('/bookings')}
        >
          View My Bookings
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => router.push('/studios')}
        >
          Continue Booking
        </Button>
      </div>
    </div>
  );
}
