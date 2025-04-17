
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { sessionFormSchema, SessionFormValues, defaultSessionFormValues } from "./SessionFormSchema";
import SessionFormHeader from "./form-sections/SessionFormHeader";
import SessionFormActions from "./form-sections/SessionFormActions";
import TitleField from "./form-fields/TitleField";
import DescriptionField from "./form-fields/DescriptionField";
import DateField from "./form-fields/DateField";
import LocationField from "./form-fields/LocationField";
import RoomField from "./form-fields/RoomField";
import MaxCampersField from "./form-fields/MaxCampersField";

interface SessionFormProps {
  defaultValues?: SessionFormValues;
  onSubmit: (data: SessionFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
  title: string;
  description: string;
  isClassroomSession?: boolean;
}

const SessionForm: React.FC<SessionFormProps> = ({
  defaultValues = defaultSessionFormValues,
  onSubmit,
  onCancel,
  submitLabel = "Create Session",
  title,
  description,
  isClassroomSession = true,
}) => {
  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues,
  });

  return (
    <Card>
      <SessionFormHeader title={title} description={description} />
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TitleField control={form.control} />
            <DescriptionField control={form.control} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateField control={form.control} />
              <LocationField control={form.control} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RoomField control={form.control} />
              <MaxCampersField control={form.control} />
            </div>
            
            <SessionFormActions 
              onCancel={onCancel} 
              submitLabel={submitLabel} 
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SessionForm;

export type { SessionFormValues };
export { defaultSessionFormValues };
