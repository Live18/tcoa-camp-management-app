import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PublicProfile {
  id: string;
  name: string;
  photo_url: string | null;
  bio: string | null;
  comments: string | null;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, photo_url, bio, comments")
        .eq("id", userId)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setProfile(data as PublicProfile);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>User not found</CardTitle>
            <CardDescription>
              No profile exists for this user ID.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{profile.name}</CardTitle>
          <CardDescription>User Profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.photo_url ?? undefined} alt={profile.name} />
              <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-2">
            <Label>Name</Label>
            <div className="border border-input bg-background px-3 py-2 rounded-md text-base">
              {profile.name}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Bio</Label>
            <div className="border border-input bg-background px-3 py-2 rounded-md text-base min-h-[80px]">
              {profile.bio || "No bio provided"}
            </div>
          </div>

          {profile.comments && (
            <div className="space-y-2">
              <Label>Comments</Label>
              <div className="border border-input bg-background px-3 py-2 rounded-md text-base min-h-[80px]">
                {profile.comments}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
