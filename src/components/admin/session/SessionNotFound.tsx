
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface SessionNotFoundProps {
  backPath: string;
}

const SessionNotFound: React.FC<SessionNotFoundProps> = ({ backPath }) => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={() => navigate(backPath)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back 
      </Button>
      <Card>
        <CardContent className="py-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Session Not Found</h2>
          <p className="text-muted-foreground">
            The classroom session you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate(backPath)} className="mt-4">
            View All Sessions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionNotFound;
