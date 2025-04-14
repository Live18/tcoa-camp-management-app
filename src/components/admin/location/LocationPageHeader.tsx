
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface LocationPageHeaderProps {
  title: string;
  description?: string;
  backUrl?: string;
  backLabel?: string;
}

const LocationPageHeader: React.FC<LocationPageHeaderProps> = ({ 
  title, 
  description, 
  backUrl = "/admin/locations",
  backLabel = "Back to Locations"
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate(backUrl)}
        className="mb-2 px-0"
      >
        ← {backLabel}
      </Button>
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && (
        <p className="text-muted-foreground max-w-2xl mt-2">{description}</p>
      )}
    </div>
  );
};

export default LocationPageHeader;
