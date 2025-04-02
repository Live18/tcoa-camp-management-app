
import React from "react";
import { useParams } from "react-router-dom";

const SessionEdit = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Edit Session (ID: {id})</h1>
      <p>Session edit form will be implemented later.</p>
    </div>
  );
};

export default SessionEdit;
