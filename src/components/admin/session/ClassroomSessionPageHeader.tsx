
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ClassroomSessionPageHeaderProps {
  title: string;
  backPath: string;
  backLabel?: string;
}

const ClassroomSessionPageHeader: React.FC<ClassroomSessionPageHeaderProps> = ({ 
  title, 
  backPath, 
  backLabel = "Back to Classroom Sessions" 
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
          ← {backLabel}
        </Button>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
    </div>
  );
};

export default ClassroomSessionPageHeader;
