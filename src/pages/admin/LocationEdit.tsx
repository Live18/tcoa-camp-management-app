
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "@/contexts/LocationContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { toast } from "@/components/ui/use-toast";
import { LocationForm, LocationFormValues } from "@/components/admin/location/LocationForm";
import LocationPageHeader from "@/components/admin/location/LocationPageHeader";

const LocationEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getLocation, updateLocation } = useLocation();
  
  const location = getLocation(id || "");
  
  const handleSubmit = (data: LocationFormValues) => {
    if (!id) return;
    
    updateLocation(id, {
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      notes: data.notes || undefined,
    });
    
    toast({
      title: "Location updated",
      description: `${data.name} has been updated successfully.`,
    });
    navigate(`/admin/locations/${id}`);
  };

  if (!location) {
    return (
      <div className="container mx-auto py-6">
        <LocationPageHeader 
          title="Location Not Found" 
        />
        <p className="text-center py-8">The location you're trying to edit doesn't exist.</p>
      </div>
    );
  }

  return (
    <PermissionGate 
      action="location.edit"
      redirectTo="/admin/locations"
    >
      <div className="container mx-auto py-6">
        <LocationPageHeader 
          title={`Edit ${location.name}`} 
        />

        <LocationForm 
          defaultValues={{
            name: location.name,
            address: location.address,
            city: location.city,
            state: location.state,
            zipCode: location.zipCode,
            notes: location.notes || "",
          }}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      </div>
    </PermissionGate>
  );
};

export default LocationEdit;
