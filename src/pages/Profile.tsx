
import React, { useState } from "react";
import { useUser, NotificationPreference } from "@/contexts/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { Pencil, ArrowLeft, Mail, Phone, Bell } from "lucide-react";
import { usePermission } from "@/contexts/PermissionContext";
import { Link } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Profile = () => {
  const { currentUser, setCurrentUser } = useUser();
  const { can } = usePermission();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    bio: currentUser?.bio || "",
    phone: currentUser?.phone || "",
    comments: currentUser?.comments || "",
    feedback: currentUser?.feedback || "",
    photoUrl: currentUser?.photoUrl || "",
    notificationPreference: currentUser?.notificationPreference || null,
  });
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (value: NotificationPreference) => {
    setFormData(prev => ({
      ...prev,
      notificationPreference: value
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      setFormData(prev => ({
        ...prev,
        photoUrl: objectUrl
      }));
    }
  };

  const handleEditClick = () => {
    // Refresh form data when entering edit mode
    setFormData({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      bio: currentUser?.bio || "",
      phone: currentUser?.phone || "",
      comments: currentUser?.comments || "",
      feedback: currentUser?.feedback || "",
      photoUrl: currentUser?.photoUrl || "",
      notificationPreference: currentUser?.notificationPreference || null,
    });
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentUser) {
      // In a real app, we would upload the photo to a server here
      // and get back a URL to store
      
      setCurrentUser({
        ...currentUser,
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        phone: formData.phone,
        comments: formData.comments,
        feedback: formData.feedback,
        photoUrl: formData.photoUrl,
        notificationPreference: formData.notificationPreference,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      setIsEditing(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>You need to be logged in to view this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>
                {isEditing 
                  ? "Update your personal information and settings" 
                  : "View your personal information and settings"}
              </CardDescription>
            </div>
            {!isEditing && (
              <Button 
                onClick={handleEditClick} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Pencil size={16} />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.photoUrl} alt={formData.name} />
                  <AvatarFallback>{getInitials(formData.name)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <Label htmlFor="photo" className="cursor-pointer">
                    <div className="text-primary hover:underline">Change photo</div>
                    <Input 
                      id="photo" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePhotoChange}
                    />
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input 
                      id="role" 
                      value={currentUser.role} 
                      disabled 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notification Preferences</Label>
                  <div className="border border-input rounded-md p-4 bg-background">
                    <RadioGroup 
                      value={formData.notificationPreference === null ? "" : formData.notificationPreference} 
                      onValueChange={(value) => handleNotificationChange(value === "" ? null : value as NotificationPreference)}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="notification-email" />
                        <Label htmlFor="notification-email" className="cursor-pointer flex items-center">
                          <Mail size={16} className="mr-2 text-blue-600" />
                          Email notifications
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sms" id="notification-sms" />
                        <Label htmlFor="notification-sms" className="cursor-pointer flex items-center">
                          <Phone size={16} className="mr-2 text-green-600" />
                          SMS notifications
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="" id="notification-none" />
                        <Label htmlFor="notification-none" className="cursor-pointer flex items-center">
                          <Bell size={16} className="mr-2 text-gray-400" />
                          No notifications
                        </Label>
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground mt-2">
                      Choose how you'd like to receive updates about assignments and camp activities.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleInputChange} 
                    rows={3} 
                  />
                </div>
                
                {currentUser.role === "camper" && (
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback & Comments</Label>
                    <Textarea 
                      id="feedback" 
                      name="feedback" 
                      value={formData.feedback} 
                      onChange={handleInputChange} 
                      rows={4} 
                      maxLength={10000}
                      placeholder="Share your thoughts, feedback, or suggestions about the camp experience..."
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.feedback.length}/10,000 characters
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="comments">Comments (visible to admins only)</Label>
                  <Textarea 
                    id="comments" 
                    name="comments" 
                    value={formData.comments} 
                    onChange={handleInputChange} 
                    rows={4} 
                    placeholder="Share any comments or questions with the event administrators..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Note: These comments are only visible to administrators.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={handleCancelClick}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={currentUser.photoUrl} alt={currentUser.name} />
                <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="view-name">Name</Label>
                  <div className="border border-input bg-background px-3 py-2 rounded-md text-base">
                    {currentUser.name}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="view-email">Email</Label>
                  <div className="border border-input bg-background px-3 py-2 rounded-md text-base">
                    {currentUser.email}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="view-phone">Phone Number</Label>
                  <div className="border border-input bg-background px-3 py-2 rounded-md text-base">
                    {currentUser.phone || "Not provided"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="view-role">Role</Label>
                  <div className="border border-input bg-background px-3 py-2 rounded-md text-base">
                    {currentUser.role}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="view-notifications">Notification Preferences</Label>
                <div className="border border-input bg-background px-3 py-2 rounded-md text-base">
                  {currentUser.notificationPreference === "email" && (
                    <div className="flex items-center">
                      <Mail size={16} className="mr-2 text-blue-600" />
                      Email notifications
                    </div>
                  )}
                  {currentUser.notificationPreference === "sms" && (
                    <div className="flex items-center">
                      <Phone size={16} className="mr-2 text-green-600" />
                      SMS notifications
                    </div>
                  )}
                  {!currentUser.notificationPreference && (
                    <div className="flex items-center">
                      <Bell size={16} className="mr-2 text-gray-400" />
                      No notifications selected
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="view-bio">Bio</Label>
                <div className="border border-input bg-background px-3 py-2 rounded-md text-base min-h-[80px]">
                  {currentUser.bio || "No bio provided"}
                </div>
              </div>
              
              {currentUser.role === "camper" && currentUser.feedback && (
                <div className="space-y-2">
                  <Label htmlFor="view-feedback">Feedback & Comments</Label>
                  <div className="border border-input bg-background px-3 py-2 rounded-md text-base min-h-[100px]">
                    {currentUser.feedback}
                  </div>
                </div>
              )}
              
              {/* Show comments section only for admins */}
              {can("admin.manage") && currentUser.comments && (
                <div className="space-y-2">
                  <Label htmlFor="view-comments">Comments (visible to admins only)</Label>
                  <div className="border border-input bg-background px-3 py-2 rounded-md text-base min-h-[100px]">
                    {currentUser.comments}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Profile;
