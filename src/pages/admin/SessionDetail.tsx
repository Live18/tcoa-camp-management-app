
import React from "react";
import { useParams } from "react-router-dom";

const SessionDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Session Details (ID: {id})</h1>
      <p>Session detail content will be implemented later.</p>
    </div>
  );
};

export default SessionDetail;
