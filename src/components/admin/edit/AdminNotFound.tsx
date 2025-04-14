
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AdminNotFoundProps {
  redirectPath?: string;
}

const AdminNotFound: React.FC<AdminNotFoundProps> = ({ 
  redirectPath = "/admin/manage-admins" 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(redirectPath)}
          className="px-0"
        >
          ← Back to Admin Management
        </Button>
      </div>
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-center">User Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">The admin user you're looking for doesn't exist or isn't an admin.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate(redirectPath)}>
            Return to Admin Management
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminNotFound;
