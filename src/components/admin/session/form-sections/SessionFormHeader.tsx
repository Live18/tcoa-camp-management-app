
import React from "react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface SessionFormHeaderProps {
  title: string;
  description: string;
}

const SessionFormHeader: React.FC<SessionFormHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
};

export default SessionFormHeader;
