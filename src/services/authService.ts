
import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/integrations/supabase/serviceClient";
import { User, NotificationPreference, UserRole } from "@/types/userTypes";
import { toast } from "@/components/ui/use-toast";

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User | null;
  userId?: string;
  emailNotVerified?: boolean;
}

/**
 * Sign in with email and password.
 * Blocks login if the user's email_verified flag is false.
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
      return { success: false, message: error.message };
    }

    // --- Email verification guard ---
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email_verified")
      .eq("id", data.user.id)
      .single();

    if (!profile?.email_verified) {
      // Sign them back out so they cannot access protected routes
      await supabase.auth.signOut();
      return {
        success: false,
        emailNotVerified: true,
        message: "Please verify your email address before logging in.",
      };
    }

    return {
      success: true,
      message: "Signed in successfully",
      user: data.user as unknown as User,
    };
  } catch (error) {
    console.error("Error signing in:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};

/**
 * Register a new user with email and password.
 * Returns userId so the caller can trigger the verification email.
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  userData: { name: string }
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: "camper",
        },
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Signed up successfully",
      user: data.user as unknown as User,
      userId: data.user?.id,
    };
  } catch (error) {
    console.error("Error signing up:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};

/**
 * Fetch the user's verification_token via service role and send a
 * verification email using the /functions/v1/send-email edge function.
 */
export const sendVerificationEmail = async (
  userId: string,
  email: string,
  name: string
): Promise<boolean> => {
  try {
    // Fetch the token using service role (bypasses RLS)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("verification_token")
      .eq("id", userId)
      .single();

    if (profileError || !profile?.verification_token) {
      console.error("Could not fetch verification token:", profileError);
      return false;
    }

    const verifyLink = `https://tcoa.app/verify?token=${profile.verification_token}`;

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Verify your email address</h2>
        <p>Hi ${name || "there"},</p>
        <p>Thank you for registering with TCO Academy Camp. Click the button below to verify your email address and activate your account.</p>
        <p style="margin: 32px 0;">
          <a href="${verifyLink}"
             style="background:#7c3aed;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">
            Verify My Email
          </a>
        </p>
        <p style="color:#666;font-size:14px;">Or paste this link into your browser:</p>
        <p style="color:#666;font-size:13px;word-break:break-all;">${verifyLink}</p>
        <p style="color:#999;font-size:12px;margin-top:32px;">If you did not create an account, you can safely ignore this email.</p>
      </div>
    `;

    // Call the existing send-email edge function with service role auth
    const { error: fnError } = await supabaseAdmin.functions.invoke("send-email", {
      body: {
        to: email,
        from: "noreply@tcoa.app",
        subject: "Verify your TCO Academy email address",
        body: emailHtml,
      },
    });

    if (fnError) {
      console.error("send-email function error:", fnError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("sendVerificationEmail error:", error);
    return false;
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
      role: data.role as UserRole,
      isAdmin: data.is_admin,
      isSuperAdmin: data.is_super_admin,
      phone: data.phone,
      photoUrl: data.photo_url,
      bio: data.bio,
      notificationPreference: data.notification_preference as NotificationPreference,
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

    toast({ title: "Success", description: "Profile updated successfully" });
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
};
