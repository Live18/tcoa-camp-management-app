
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { users, setCurrentUser } = useUser();

  const handleLogin = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to TCOA Camp Management</CardTitle>
          <CardDescription>Select a user to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.map(user => (
              <Button 
                key={user.id} 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleLogin(user.id)}
              >
                <div className="flex flex-col items-start">
                  <span>{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.role} {user.isAdmin ? "(admin)" : ""}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Don't have an account? Contact your administrator.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
