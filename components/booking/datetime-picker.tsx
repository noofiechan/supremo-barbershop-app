'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TIME_SLOTS } from '@/lib/constants';

interface DateTimePickerProps {
  selectedDate?: string;
  selectedTime?: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export function DateTimePicker({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}: DateTimePickerProps) {
  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Select Date & Time</h3>

      <div>
        <label className="text-sm font-medium">Date</label>
        <Input
          type="date"
          min={today}
          value={selectedDate || ''}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Time</label>
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((slot) => (
            <Button
              key={slot}
              variant={selectedTime === slot ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeChange(slot)}
              className="text-xs"
            >
              {slot}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
