
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const UserNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>User Not Found</CardTitle>
          <CardDescription>The user you're looking for doesn't exist.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate("/admin/users")}>Back to Users</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
