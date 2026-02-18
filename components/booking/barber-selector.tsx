'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Barber } from '@/lib/types';
import { db } from '@/lib/supabase';

interface BarberSelectorProps {
  onSelect: (barber: Barber) => void;
  selectedId?: number;
}

export function BarberSelector({ onSelect, selectedId }: BarberSelectorProps) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    const { data, error } = await db.getAvailableBarbers();
    if (!error && data) {
      setBarbers(data);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading barbers...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Select Barber</h3>

      {barbers.length === 0 ? (
        <div className="text-center text-gray-600">No barbers available</div>
      ) : (
        <div className="grid gap-3">
          {barbers.map((barber) => (
            <Card
              key={barber.barber_id}
              className={`cursor-pointer transition-all ${
                selectedId === barber.barber_id
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-gray-400'
              }`}
              onClick={() => onSelect(barber)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {barber.barber_fname} {barber.barber_lname}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
