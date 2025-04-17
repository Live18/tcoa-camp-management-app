
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

interface MaxCampersFieldProps {
  control: Control<SessionFormValues>;
}

const MaxCampersField: React.FC<MaxCampersFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="maxCampers"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Maximum Campers</FormLabel>
          <FormControl>
            <Input type="number" min={1} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MaxCampersField;
