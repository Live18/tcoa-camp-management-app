
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface SessionDetailHeaderProps {
  backPath: string;
  isClassroomSession: boolean;
}

const SessionDetailHeader: React.FC<SessionDetailHeaderProps> = ({
  backPath,
  isClassroomSession,
}) => {
  const navigate = useNavigate();

  return (
    <Button variant="ghost" onClick={() => navigate(backPath)} className="mb-4">
      <ArrowLeft className="mr-2 h-4 w-4" /> 
      Back to {isClassroomSession ? "Classroom Sessions" : "Sessions"}
    </Button>
  );
};

export default SessionDetailHeader;
