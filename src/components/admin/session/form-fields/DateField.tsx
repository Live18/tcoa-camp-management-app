
import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SessionFormValues } from "../SessionFormSchema";

interface DateFieldProps {
  control: Control<SessionFormValues>;
  min?: string; // "YYYY-MM-DDThh:mm"
  max?: string; // "YYYY-MM-DDThh:mm"
}

const DateField: React.FC<DateFieldProps> = ({ control, min, max }) => {
  return (
    <FormField
      control={control}
      name="date"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Date and Time</FormLabel>
          <FormControl>
            <Input type="datetime-local" min={min} max={max} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateField;
