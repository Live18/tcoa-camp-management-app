
import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation } from "@/contexts/LocationContext";
import { SessionFormValues } from "../SessionFormSchema";

interface LocationFieldProps {
  control: Control<SessionFormValues>;
}

const LocationField: React.FC<LocationFieldProps> = ({ control }) => {
  const { locations } = useLocation();
  
  return (
    <FormField
      control={control}
      name="locationId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationField;
