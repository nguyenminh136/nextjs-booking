'use client';

import { Container } from '@/components/ui/container';
import { BookingConfirmation } from '@/components/booking/booking-confirmation';

interface ConfirmationPageProps {
  params: {
    id: string;
  };
}

export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  return (
    <Container className="py-12">
      <div className="max-w-2xl mx-auto">
        <BookingConfirmation bookingId={params.id} />
      </div>
    </Container>
  );
}
