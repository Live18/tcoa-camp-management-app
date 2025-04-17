
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

interface RoomFieldProps {
  control: Control<SessionFormValues>;
}

const RoomField: React.FC<RoomFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="roomName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Room Name</FormLabel>
          <FormControl>
            <Input placeholder="Lecture Hall A" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RoomField;
