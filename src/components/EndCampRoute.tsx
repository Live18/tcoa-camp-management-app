
import React from "react";
import { Route } from "react-router-dom";
import EndCamp from "@/pages/admin/EndCamp";

/**
 * This component is used to add the End Camp route to the main app.
 * It should be placed within the Routes component in App.tsx.
 */
export const EndCampRoute = () => {
  return <Route path="/admin/end-camp" element={<EndCamp />} />;
};
