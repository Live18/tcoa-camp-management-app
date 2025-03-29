
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { useLocation } from "@/contexts/LocationContext";
import { usePermission } from "@/contexts/PermissionContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  date: z.string().min(5, "Date is required"),
  locationId: z.string().min(1, "Location is required"),
  roomName: z.string().min(2, "Room name must be at least 2 characters"),
  maxCampers: z.coerce.number().min(1, "Maximum campers must be at least 1"),
});

type FormValues = z.infer<typeof formSchema>;

const ClassroomSessionEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSession, updateSession } = useClassroomSession();
  const { locations } = useLocation();
  
  const session = getSession(id || "");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      locationId: "",
      roomName: "",
      maxCampers: 20,
    },
  });
  
  useEffect(() => {
    if (session) {
      // Format the date to match the datetime-local input format (YYYY-MM-DDThh:mm)
      const dateObj = new Date(session.date);
      const formattedDate = dateObj.toISOString().slice(0, 16);
      
      form.reset({
        title: session.title,
        description: session.description,
        date: formattedDate,
        locationId: session.locationId,
        roomName: session.roomName,
        maxCampers: session.maxCampers,
      });
    } else {
      navigate("/admin/classroom-sessions");
    }
  }, [session, form, navigate]);
  
  const onSubmit = (data: FormValues) => {
    if (!session) return;
    
    updateSession(session.id, {
      title: data.title,
      description: data.description,
      date: data.date,
      locationId: data.locationId,
      roomName: data.roomName,
      maxCampers: data.maxCampers,
    });
    
    toast({
      title: "Session updated",
      description: `${data.title} has been updated successfully.`,
    });
    
    navigate("/admin/classroom-sessions");
  };

  if (!session) {
    return null;
  }

  return (
    <PermissionGate 
      action="session.edit"
      redirectTo="/admin/classroom-sessions"
    >
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin/classroom-sessions")}
              className="mb-2 px-0"
            >
              ← Back to Classroom Sessions
            </Button>
            <h1 className="text-3xl font-bold">Edit Classroom Session</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
            <CardDescription>
              Edit the details of "{session.title}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
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
                
                <FormField
                  control={form.control}
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date and Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
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
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
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
                  
                  <FormField
                    control={form.control}
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
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/admin/classroom-sessions")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
};

export default ClassroomSessionEdit;
