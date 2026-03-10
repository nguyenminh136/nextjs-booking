'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Booking } from '@/interface/Booking';
import { handleAuthError, isAuthError } from '@/lib/auth-error-handler';
import { Studio } from '@/interface/Studio';

interface BookingFormProps {
  studio: Studio;
  slotStartTime: string;
  slotEndTime: string;
}

export function BookingForm({ studio, slotStartTime, slotEndTime }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    purpose: '',
    attendeesCount: 1,
    paymentMethod: 'pay_on_site' as const,
    note: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'attendeesCount' ? parseInt(value, 10) : value
    }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: value as 'online' | 'pay_on_site'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const bookingPayload: Partial<Booking> = {
        startTime: slotStartTime,
        endTime: slotEndTime,
        purpose: formData.purpose,
        attendeesCount: formData.attendeesCount,
        paymentMethod: formData.paymentMethod,
        note: formData.note,
        studio: studio,
        status: formData.paymentMethod === 'online' ? 'pending_payment' : 'confirmed'
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingPayload)
      });

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
        throw new Error(data.error || 'Failed to create booking');
      }

      // Redirect to confirmation page
      router.push(`/bookings/confirmation/${data.id}`);
    } catch (err: any) {
      if (isAuthError(err)) {
        handleAuthError();
        return;
      }
      setError(err.message || 'An error occurred while creating the booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Booking Details</CardTitle>
        <CardDescription>
          {studio.name} • {new Date(slotStartTime).toLocaleDateString()} {new Date(slotStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Booking *</Label>
            <Input
              id="purpose"
              name="purpose"
              placeholder="E.g., Photography session, rehearsal, meeting"
              value={formData.purpose}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Attendees */}
          <div className="space-y-2">
            <Label htmlFor="attendeesCount">Number of Attendees *</Label>
            <Input
              id="attendeesCount"
              name="attendeesCount"
              type="number"
              min="1"
              max="100"
              value={formData.attendeesCount}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>Payment Method *</Label>
            <RadioGroup value={formData.paymentMethod} onValueChange={handlePaymentMethodChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pay_on_site" id="pay_on_site" disabled={loading} />
                <Label htmlFor="pay_on_site" className="font-normal cursor-pointer">
                  Pay on Site
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" disabled={loading} />
                <Label htmlFor="online" className="font-normal cursor-pointer">
                  Pay Online
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="note">Additional Notes</Label>
            <Textarea
              id="note"
              name="note"
              placeholder="Any special requirements or notes..."
              value={formData.note}
              onChange={handleChange}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
