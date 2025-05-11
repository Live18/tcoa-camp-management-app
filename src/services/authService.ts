
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/userTypes";
import { toast } from "@/components/ui/use-toast";

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User | null;
}

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Signed in successfully",
      user: data.user,
    };
  } catch (error) {
    console.error("Error signing in:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
};

/**
 * Register a new user with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  userData: {
    name: string;
    role: string;
  }
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: userData.role,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Signed up successfully",
      user: data.user,
    };
  } catch (error) {
    console.error("Error signing up:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Error signing out:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    return false;
  }
};

/**
 * Get the current user's profile from the profiles table
 */
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (error || !data) {
      console.error("Error fetching user profile:", error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      isAdmin: data.is_admin,
      isSuperAdmin: data.is_super_admin,
      phone: data.phone,
      photoUrl: data.photo_url,
      bio: data.bio,
      notificationPreference: data.notification_preference,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

/**
 * Update a user's profile
 */
export const updateUserProfile = async (
  userId: string,
  profileData: Partial<User>
): Promise<boolean> => {
  try {
    // Convert from camelCase to snake_case for database
    const dbData = {
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      photo_url: profileData.photoUrl,
      bio: profileData.bio,
      notification_preference: profileData.notificationPreference,
    };

    const { error } = await supabase
      .from("profiles")
      .update(dbData)
      .eq("id", userId);
    
    if (error) {
      console.error("Error updating user profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile: " + error.message,
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
};
