import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

export interface CampSettings {
  campName: string | null;
  campStart: string | null; // ISO date string "YYYY-MM-DD"
  campEnd: string | null;   // ISO date string "YYYY-MM-DD"
}

interface CampSettingsContextType extends CampSettings {
  loading: boolean;
  updateCampSettings: (data: Partial<CampSettings>) => Promise<void>;
}

const CampSettingsContext = createContext<CampSettingsContextType | undefined>(undefined);

export const CampSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [campName, setCampName] = useState<string | null>(null);
  const [campStart, setCampStart] = useState<string | null>(null);
  const [campEnd, setCampEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("camp_settings")
          .select("camp_name, camp_start, camp_end")
          .eq("id", SETTINGS_ID)
          .single();

        if (error) {
          // Table may not be migrated yet in development — silently continue
          console.warn("Could not load camp_settings:", error.message);
        } else if (data) {
          setCampName(data.camp_name ?? null);
          setCampStart(data.camp_start ?? null);
          setCampEnd(data.camp_end ?? null);
        }
      } catch (err) {
        console.warn("CampSettingsContext fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateCampSettings = async (updates: Partial<CampSettings>) => {
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if ("campName" in updates) payload.camp_name = updates.campName;
    if ("campStart" in updates) payload.camp_start = updates.campStart;
    if ("campEnd" in updates) payload.camp_end = updates.campEnd;

    const { error } = await (supabase as any)
      .from("camp_settings")
      .update(payload)
      .eq("id", SETTINGS_ID);

    if (error) {
      toast({ title: "Error", description: "Could not save camp settings.", variant: "destructive" });
      throw error;
    }

    // Optimistically update local state
    if ("campName" in updates) setCampName(updates.campName ?? null);
    if ("campStart" in updates) setCampStart(updates.campStart ?? null);
    if ("campEnd" in updates) setCampEnd(updates.campEnd ?? null);

    toast({ title: "Camp settings saved" });
  };

  return (
    <CampSettingsContext.Provider value={{ campName, campStart, campEnd, loading, updateCampSettings }}>
      {children}
    </CampSettingsContext.Provider>
  );
};

export const useCampSettings = () => {
  const ctx = useContext(CampSettingsContext);
  if (!ctx) throw new Error("useCampSettings must be used within a CampSettingsProvider");
  return ctx;
};
