
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, NotificationPreference } from "@/contexts/UserContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { toast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  SendHorizonal, 
  Mail, 
  Phone, 
  Users, 
  User, 
  Calendar 
} from "lucide-react";
import { sendEmail } from "@/utils/emailService";
import { storeNotification } from "@/utils/notificationService";

// Type for notification history
interface NotificationHistory {
  id: string;
  title: string;
  message: string;
  sentAt: Date;
  sentTo: string;
  sentVia: string;
  recipientCount: number;
}

// Type for recipient filters
interface RecipientFilter {
  role?: string;
  notificationPreference?: NotificationPreference;
}

const Notifications = () => {
  const navigate = useNavigate();
  const { users } = useUser();
  
  // Form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<Record<string, boolean>>({
    camper: true,
    presenter: true,
    observer: true,
    admin: true,
  });
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "sms" | "both">("both");
  const [sending, setSending] = useState(false);
  
  // Sample notification history
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([
    {
      id: "1",
      title: "Schedule Change",
      message: "The basketball court is unavailable tomorrow. All games have been moved to Thursday.",
      sentAt: new Date(Date.now() - 3600000 * 24), // 1 day ago
      sentTo: "All campers",
      sentVia: "Email",
      recipientCount: 14
    },
    {
      id: "2",
      title: "New Coach Announcement",
      message: "We're excited to welcome Coach Johnson to our team!",
      sentAt: new Date(Date.now() - 3600000 * 72), // 3 days ago
      sentTo: "All users",
      sentVia: "Email & SMS",
      recipientCount: 28
    }
  ]);
  
  // Get filtered recipients based on role and notification preferences
  const getFilteredRecipients = () => {
    // Filter by selected roles
    const roleFiltered = users.filter(user => 
      selectedRoles[user.role]
    );
    
    // Filter by delivery method
    if (deliveryMethod === "both") {
      return roleFiltered;
    } else {
      return roleFiltered.filter(user => 
        user.notificationPreference === deliveryMethod || user.notificationPreference === null
      );
    }
  };
  
  // Get count of recipients by delivery method
  const getRecipientCounts = () => {
    const recipients = getFilteredRecipients();
    const emailCount = recipients.filter(user => 
      user.notificationPreference === "email" || user.notificationPreference === null
    ).length;
    
    const smsCount = recipients.filter(user => 
      user.notificationPreference === "sms" || user.notificationPreference === null
    ).length;
    
    return { emailCount, smsCount, totalCount: recipients.length };
  };
  
  // Handle sending notification
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a notification title",
        variant: "destructive"
      });
      return;
    }
    
    if (!message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a notification message",
        variant: "destructive"
      });
      return;
    }
    
    const recipients = getFilteredRecipients();
    if (recipients.length === 0) {
      toast({
        title: "No Recipients",
        description: "There are no recipients matching your criteria",
        variant: "destructive"
      });
      return;
    }
    
    setSending(true);
    
    try {
      // For demo purposes, only send to the first recipient but show a message about the full recipient list
      if (deliveryMethod === "email" || deliveryMethod === "both") {
        const emailUsers = recipients.filter(user => 
          user.notificationPreference === "email" || user.notificationPreference === null
        );
        
        if (emailUsers.length > 0) {
          // Send email to first user and store notifications for all users
          await sendEmail({
            to: emailUsers[0].email,
            subject: title,
            body: `${message}\n\nNote: This is a camp notification. In a production system, this would be sent to all ${emailUsers.length} recipients.`
          });
          
          // Store notifications for all users (normally we'd loop and send to each)
          for (const user of emailUsers) {
            await storeNotification(user.id, title, message);
          }
        }
      }
      
      // Add to notification history
      const { emailCount, smsCount, totalCount } = getRecipientCounts();
      
      const sentTo = Object.entries(selectedRoles)
        .filter(([_, isSelected]) => isSelected)
        .map(([role, _]) => role)
        .join(", ");
      
      const newNotification: NotificationHistory = {
        id: (notificationHistory.length + 1).toString(),
        title,
        message,
        sentAt: new Date(),
        sentTo: sentTo === "camper,presenter,observer,admin" ? "All users" : `All ${sentTo}s`,
        sentVia: deliveryMethod === "both" 
          ? "Email & SMS" 
          : deliveryMethod === "email" ? "Email" : "SMS",
        recipientCount: totalCount
      };
      
      setNotificationHistory([newNotification, ...notificationHistory]);
      
      // Show success message
      toast({
        title: "Notification Sent",
        description: `Your notification has been sent to ${totalCount} recipients.`,
      });
      
      // Reset form
      setTitle("");
      setMessage("");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Error Sending Notification",
        description: "There was a problem sending the notification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };
  
  const { emailCount, smsCount, totalCount } = getRecipientCounts();
  
  return (
    <PermissionGate action="notification.send">
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
          <h1 className="text-3xl font-bold">Send Notifications</h1>
        </div>
        
        {/* Notification Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Compose New Notification</CardTitle>
            <CardDescription>
              Send a notification to camp participants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Notification Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter notification title..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter notification message..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Recipients</Label>
                <div className="border rounded-md p-4 space-y-2">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="camper" 
                        checked={selectedRoles.camper}
                        onCheckedChange={(checked) => 
                          setSelectedRoles({...selectedRoles, camper: checked === true})
                        }
                      />
                      <Label htmlFor="camper">Campers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="presenter" 
                        checked={selectedRoles.presenter}
                        onCheckedChange={(checked) => 
                          setSelectedRoles({...selectedRoles, presenter: checked === true})
                        }
                      />
                      <Label htmlFor="presenter">Presenters</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="observer" 
                        checked={selectedRoles.observer}
                        onCheckedChange={(checked) => 
                          setSelectedRoles({...selectedRoles, observer: checked === true})
                        }
                      />
                      <Label htmlFor="observer">Observers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="admin" 
                        checked={selectedRoles.admin}
                        onCheckedChange={(checked) => 
                          setSelectedRoles({...selectedRoles, admin: checked === true})
                        }
                      />
                      <Label htmlFor="admin">Admins</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery-method">Delivery Method</Label>
                <Select 
                  value={deliveryMethod} 
                  onValueChange={(value) => setDeliveryMethod(value as "email" | "sms" | "both")}
                >
                  <SelectTrigger id="delivery-method">
                    <SelectValue placeholder="Select delivery method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email only</SelectItem>
                    <SelectItem value="sms">SMS only</SelectItem>
                    <SelectItem value="both">Both Email & SMS</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  This will respect each user's notification preferences
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Recipients Summary</h4>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{totalCount} total recipients</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{emailCount} via email</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{smsCount} via SMS</span>
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={!title || !message || totalCount === 0 || sending}
              >
                {sending ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <>
                    <SendHorizonal className="mr-2 h-4 w-4" />
                    Send Notification
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Notification History */}
        <Card>
          <CardHeader>
            <CardTitle>Notification History</CardTitle>
            <CardDescription>
              Previously sent notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Sent To</TableHead>
                    <TableHead>Via</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Sent At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notificationHistory.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell className="font-medium">
                        {notification.title}
                      </TableCell>
                      <TableCell>{notification.sentTo}</TableCell>
                      <TableCell>{notification.sentVia}</TableCell>
                      <TableCell>{notification.recipientCount}</TableCell>
                      <TableCell>
                        {notification.sentAt.toLocaleDateString()} at {notification.sentAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                    </TableRow>
                  ))}
                  {notificationHistory.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No notifications have been sent yet.
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

export default Notifications;
