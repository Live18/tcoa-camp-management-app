
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface CommentsFieldProps {
  control: Control<any>;
}

export const CommentsField: React.FC<CommentsFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="comments"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Comments (Optional)</FormLabel>
          <FormControl>
            <Input 
              placeholder="Add any notes about this admin assignment" 
              {...field} 
            />
          </FormControl>
          <FormDescription>
            Add any notes or reasons for granting admin access
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
