
import React from "react";
import { User } from "@/contexts/UserContext";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";

interface UserSelectFieldProps {
  control: Control<any>;
  nonAdminUsers: User[];
}

export const UserSelectField: React.FC<UserSelectFieldProps> = ({
  control,
  nonAdminUsers,
}) => {
  return (
    <FormField
      control={control}
      name="userId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>User</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {nonAdminUsers.length > 0 ? (
                nonAdminUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                    {user.notificationPreference && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        • {user.notificationPreference} notifications enabled
                      </span>
                    )}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No eligible users found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormDescription>
            This user will be granted full administrator privileges
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
