
import React from "react";
import { useParams } from "react-router-dom";

const LocationDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Location Details (ID: {id})</h1>
      <p>Location detail content will be implemented later.</p>
    </div>
  );
};

export default LocationDetail;
