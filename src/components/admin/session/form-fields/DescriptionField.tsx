
import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { SessionFormValues } from "../SessionFormSchema";

interface DescriptionFieldProps {
  control: Control<SessionFormValues>;
}

const DescriptionField: React.FC<DescriptionFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Learn advanced basketball strategies" 
              {...field} 
            />
          </FormControl>
          <FormDescription>
            A brief description of the session
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DescriptionField;
