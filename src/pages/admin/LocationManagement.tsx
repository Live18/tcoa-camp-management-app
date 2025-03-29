
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "@/contexts/LocationContext";
import { usePermission } from "@/contexts/PermissionContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";

const LocationManagement = () => {
  const navigate = useNavigate();
  const { locations } = useLocation();
  const [searchTerm, setSearchTerm] = React.useState("");
  const { can } = usePermission();

  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PermissionGate 
      action="location.view"
      redirectTo="/"
    >
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin")}
              className="mb-2 px-0"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Location Management</h1>
          </div>
          <PermissionGate action="location.create">
            <div className="flex mt-4 md:mt-0">
              <Button onClick={() => navigate("/admin/locations/new")}>
                Add Location
              </Button>
            </div>
          </PermissionGate>
        </div>

        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search locations by name, address, or city..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <Card key={location.id}>
                <CardHeader>
                  <CardTitle>{location.name}</CardTitle>
                  <CardDescription>{location.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>{location.city}, {location.state} {location.zipCode}</p>
                    {location.notes && <p className="text-sm text-muted-foreground">{location.notes}</p>}
                    
                    <div className="pt-4 flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/locations/${location.id}`)}
                      >
                        View Details
                      </Button>
                      
                      {can("location.edit") && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/admin/locations/edit/${location.id}`)}
                        >
                          Edit
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/locations/${location.id}/games`)}
                      >
                        Games
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/locations/${location.id}/sessions`)}
                      >
                        Sessions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <div className="mx-auto bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="font-medium text-lg">No locations found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchTerm ? "Try adjusting your search" : "Add a location to get started"}
                </p>
                {can("location.create") && !searchTerm && (
                  <Button className="mt-4" onClick={() => navigate("/admin/locations/new")}>
                    Add Location
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PermissionGate>
  );
};

export default LocationManagement;
