
import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { User } from "@/types/userTypes";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  comments: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AdminEditFormProps {
  adminUser: User;
  onSave: (data: FormData) => void;
  onCancel: () => void;
}

const AdminEditForm: React.FC<AdminEditFormProps> = ({ adminUser, onSave, onCancel }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comments: adminUser.comments || "",
    },
  });

  React.useEffect(() => {
    if (adminUser) {
      form.reset({
        comments: adminUser.comments || "",
      });
    }
  }, [adminUser, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)}>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <Input value={adminUser.email} disabled />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Phone</label>
                  <Input value={adminUser.phone || "Not provided"} disabled />
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any notes about this admin user" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Add information about admin responsibilities or area of focus
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};

export default AdminEditForm;
