
import React from "react";
import { Route } from "react-router-dom";
import EndCamp from "@/pages/admin/EndCamp";

/**
 * This component is used to add the End Camp route to the main app.
 * It returns a Route component to be used inside a Routes component.
 */
export const EndCampRoute = () => {
  return <Route path="/admin/end-camp" element={<EndCamp />} />;
};
