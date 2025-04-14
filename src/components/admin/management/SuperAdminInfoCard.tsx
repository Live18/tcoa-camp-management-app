
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, ShieldAlert } from "lucide-react";

const SuperAdminInfoCard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldCheck className="h-5 w-5 mr-2 text-amber-500" /> 
          Super Admin Status
        </CardTitle>
        <CardDescription>
          Super Admins have exclusive control over admin privileges and cannot be demoted by regular admins.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm">
          <div className="flex items-start">
            <ShieldAlert className="h-5 w-5 mr-2 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Important Security Information</p>
              <ul className="mt-2 space-y-1 list-disc list-inside text-amber-700">
                <li>Only Super Admins can grant or revoke admin privileges</li>
                <li>The system must always maintain at least one Super Admin</li>
                <li>Super Admin status changes are logged for security purposes</li>
                <li>If you transfer your Super Admin status, you cannot regain it without another Super Admin's help</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuperAdminInfoCard;
