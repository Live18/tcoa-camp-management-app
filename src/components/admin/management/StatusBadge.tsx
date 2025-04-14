
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Crown, Shield } from "lucide-react";

interface StatusBadgeProps {
  isSuperAdmin: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ isSuperAdmin }) => {
  if (isSuperAdmin) {
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
        <Crown className="h-3 w-3 mr-1" /> Super Admin
      </Badge>
    );
  }
  
  return (
    <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200">
      <Shield className="h-3 w-3 mr-1" /> Regular Admin
    </Badge>
  );
};

export default StatusBadge;
