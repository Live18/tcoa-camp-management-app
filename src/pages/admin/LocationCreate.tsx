
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "@/contexts/LocationContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { toast } from "@/components/ui/use-toast";
import { LocationForm, LocationFormValues } from "@/components/admin/location/LocationForm";
import LocationPageHeader from "@/components/admin/location/LocationPageHeader";

const LocationCreate = () => {
  const navigate = useNavigate();
  const { addLocation } = useLocation();
  
  const handleSubmit = (data: LocationFormValues) => {
    // Create a location object with all required fields and optional notes
    const newLocation = {
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      notes: data.notes || undefined, // Only include notes if it's not an empty string
    };
    
    addLocation(newLocation);
    toast({
      title: "Location created",
      description: `${data.name} has been created successfully.`,
    });
    navigate("/admin/locations");
  };

  return (
    <PermissionGate 
      action="location.create"
      redirectTo="/admin/locations"
    >
      <div className="container mx-auto py-6">
        <LocationPageHeader 
          title="Add Location" 
        />

        <LocationForm onSubmit={handleSubmit} />
      </div>
    </PermissionGate>
  );
};

export default LocationCreate;
