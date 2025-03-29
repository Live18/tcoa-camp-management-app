
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  notes?: string;
}

interface LocationContextType {
  locations: Location[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  addLocation: (location: Omit<Location, "id">) => void;
  updateLocation: (id: string, locationData: Partial<Location>) => void;
  deleteLocation: (id: string) => void;
  getLocation: (id: string) => Location | undefined;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Sample locations
const sampleLocations: Location[] = [
  {
    id: "1",
    name: "Main Campus",
    address: "123 Camp Lane",
    city: "Springfield",
    state: "IL",
    zipCode: "62701",
    coordinates: {
      lat: 39.781721,
      lng: -89.650148,
    },
    notes: "Main camp location with all facilities",
  },
  {
    id: "2",
    name: "Sports Complex",
    address: "456 Athletic Drive",
    city: "Springfield",
    state: "IL",
    zipCode: "62702",
    coordinates: {
      lat: 39.785423,
      lng: -89.643211,
    },
    notes: "Indoor and outdoor sports facilities",
  },
];

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<Location[]>(sampleLocations);

  const addLocation = (location: Omit<Location, "id">) => {
    const newLocation = {
      ...location,
      id: Date.now().toString(),
    };
    setLocations((prev) => [...prev, newLocation]);
  };

  const updateLocation = (id: string, locationData: Partial<Location>) => {
    setLocations((prev) =>
      prev.map((location) =>
        location.id === id ? { ...location, ...locationData } : location
      )
    );
  };

  const deleteLocation = (id: string) => {
    setLocations((prev) => prev.filter((location) => location.id !== id));
  };

  const getLocation = (id: string) => {
    return locations.find((location) => location.id === id);
  };

  return (
    <LocationContext.Provider
      value={{
        locations,
        setLocations,
        addLocation,
        updateLocation,
        deleteLocation,
        getLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
