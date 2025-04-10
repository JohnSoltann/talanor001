'use client';

import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
}: DateRangePickerProps) {
  return (
    <div className="flex flex-col space-y-2">
      <Label>بازه زمانی</Label>
      <div className="flex items-center space-x-2 space-x-reverse">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onChange(e.target.value, endDate)}
          placeholder="از تاریخ"
        />
        <span>تا</span>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onChange(startDate, e.target.value)}
          placeholder="تا تاریخ"
        />
      </div>
    </div>
  );
} 