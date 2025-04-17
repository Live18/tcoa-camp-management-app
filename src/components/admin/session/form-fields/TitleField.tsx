
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
import { Input } from "@/components/ui/input";
import { SessionFormValues } from "../SessionFormSchema";

interface TitleFieldProps {
  control: Control<SessionFormValues>;
}

const TitleField: React.FC<TitleFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input placeholder="Basketball Strategy" {...field} />
          </FormControl>
          <FormDescription>
            The display title for this session
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TitleField;
