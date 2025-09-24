import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../utils/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';

const currentYear = new Date().getFullYear();

interface DatePickerProps {
  id?: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = 'Pick a date',
  className,
  error,
}: DatePickerProps) {
  return (
    <div className="space-y-1">
      <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          captionLayout="dropdown-buttons"
          fromYear={1940}
          toYear={currentYear}
        />
      </PopoverContent>
    </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export default DatePicker;
