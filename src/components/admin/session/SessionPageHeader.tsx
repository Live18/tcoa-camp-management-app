
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SessionPageHeaderProps {
  title: string;
  backPath: string;
  backLabel: string;
}

const SessionPageHeader: React.FC<SessionPageHeaderProps> = ({
  title,
  backPath,
  backLabel,
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
      <div>
        <Button 
          variant="ghost" 
          onClick={() => navigate(backPath)}
          className="mb-2 px-0"
        >
          ← Back to {backLabel}
        </Button>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
    </div>
  );
};

export default SessionPageHeader;
