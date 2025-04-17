
import React from "react";
import { Button } from "@/components/ui/button";

interface SessionFormActionsProps {
  onCancel: () => void;
  submitLabel: string;
}

const SessionFormActions: React.FC<SessionFormActionsProps> = ({
  onCancel,
  submitLabel,
}) => {
  return (
    <div className="flex justify-end space-x-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit">
        {submitLabel}
      </Button>
    </div>
  );
};

export default SessionFormActions;
