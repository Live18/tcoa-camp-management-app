
import * as z from "zod";

export const sessionFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  date: z.string().min(5, "Date is required"),
  locationId: z.string().min(1, "Location is required"),
  roomName: z.string().min(2, "Room name must be at least 2 characters"),
  maxCampers: z.coerce.number().min(1, "Maximum campers must be at least 1"),
});

export type SessionFormValues = z.infer<typeof sessionFormSchema>;

export const defaultSessionFormValues: SessionFormValues = {
  title: "",
  description: "",
  date: new Date().toISOString().slice(0, 16),
  locationId: "",
  roomName: "",
  maxCampers: 20,
};
