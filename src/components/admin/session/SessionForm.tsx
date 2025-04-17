
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { sessionFormSchema, SessionFormValues, defaultSessionFormValues } from "./SessionFormSchema";
import SessionFormHeader from "./form-sections/SessionFormHeader";
import SessionFormFields from "./form-sections/SessionFormFields";
import SessionFormActions from "./form-sections/SessionFormActions";

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
            <SessionFormFields control={form.control} />
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
