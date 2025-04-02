
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Mail, Send, RefreshCw, X } from "lucide-react";

// Invitation status types
type InvitationStatus = "pending" | "accepted" | "expired";

// Invitation interface
interface Invitation {
  id: string;
  email: string;
  role: string;
  message: string;
  status: InvitationStatus;
  sentAt: Date;
}

const Invitations = () => {
  const navigate = useNavigate();
  
  // Sample invitations data
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: "1",
      email: "coach@example.com",
      role: "presenter",
      message: "Please join us as a basketball coach!",
      status: "pending",
      sentAt: new Date(Date.now() - 3600000 * 24) // 1 day ago
    },
    {
      id: "2",
      email: "parent@example.com",
      role: "observer",
      message: "You're invited to observe your child's camp activities",
      status: "accepted",
      sentAt: new Date(Date.now() - 3600000 * 72) // 3 days ago
    },
    {
      id: "3",
      email: "student@example.com",
      role: "camper",
      message: "Join our summer basketball camp!",
      status: "expired",
      sentAt: new Date(Date.now() - 3600000 * 240) // 10 days ago
    }
  ]);
  
  // Form state
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("camper");
  const [message, setMessage] = useState("");
  
  // Status badge styling based on status
  const getStatusBadge = (status: InvitationStatus) => {
    switch(status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">Accepted</Badge>;
      case "expired":
        return <Badge variant="outline" className="bg-gray-50 text-gray-800 border-gray-300">Expired</Badge>;
    }
  };
  
  // Handle sending a new invitation
  const handleSendInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Missing Information",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }
    
    // Create new invitation
    const newInvitation: Invitation = {
      id: (invitations.length + 1).toString(),
      email,
      role,
      message,
      status: "pending",
      sentAt: new Date()
    };
    
    // Add to invitations list
    setInvitations([newInvitation, ...invitations]);
    
    // Show success message
    toast({
      title: "Invitation Sent",
      description: `An invitation has been sent to ${email}`,
    });
    
    // Reset form
    setEmail("");
    setMessage("");
  };
  
  // Handle resending an invitation
  const handleResendInvitation = (id: string) => {
    setInvitations(invitations.map(inv => 
      inv.id === id 
        ? { ...inv, sentAt: new Date(), status: "pending" } 
        : inv
    ));
    
    toast({
      title: "Invitation Resent",
      description: "The invitation has been resent",
    });
  };
  
  // Handle canceling an invitation
  const handleCancelInvitation = (id: string) => {
    setInvitations(invitations.filter(inv => inv.id !== id));
    
    toast({
      title: "Invitation Canceled",
      description: "The invitation has been canceled",
    });
  };
  
  return (
    <PermissionGate action="invitation.send">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin")}
            className="px-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Invitation Management</h1>
        </div>
        
        {/* Send Invitation Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Send New Invitation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendInvitation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    Role
                  </label>
                  <select
                    id="role"
                    className="w-full px-3 py-2 border rounded-md"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="camper">Camper</option>
                    <option value="presenter">Presenter</option>
                    <option value="observer">Observer</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Invitation Message (Optional)
                </label>
                <Textarea
                  id="message"
                  placeholder="Enter a personal message to include in the invitation..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button type="submit" className="w-full md:w-auto">
                <Mail className="mr-2 h-4 w-4" />
                Send Invitation
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Invitations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Invitation History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell>{invitation.email}</TableCell>
                      <TableCell className="capitalize">{invitation.role}</TableCell>
                      <TableCell>
                        {invitation.sentAt.toLocaleDateString()} at {invitation.sentAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {invitation.status !== "accepted" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResendInvitation(invitation.id)}
                              title="Resend invitation"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelInvitation(invitation.id)}
                            title="Cancel invitation"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {invitations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No invitations have been sent yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
};

export default Invitations;
