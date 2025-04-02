
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, UserRole } from "@/contexts/UserContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("camper");
  const { users, setUsers, setCurrentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
      toast({
        title: "Registration failed",
        description: "Email already in use. Please try a different email or login.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      role,
      isAdmin: false,
      notificationPreference: null,
    };
    
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    
    toast({
      title: "Registration successful",
      description: `Welcome to the camp, ${name}!`,
    });
    
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Create an account to join the basketball camp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={(value: UserRole) => setRole(value)} value={role}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="camper">Camper</SelectItem>
                  <SelectItem value="observer">Observer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Register</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => navigate("/login")}>
            Already have an account? Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
