
import React from "react";
import { useUser, UserRole } from "@/contexts/UserContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export const UserSwitcher = () => {
  const { users, setCurrentUser, currentUser } = useUser();
  const { isAdmin } = useRoleCheck();

  const handleChangeUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      toast({
        title: "User Changed",
        description: `You are now viewing the app as ${user.name} (${user.role}).`,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">View As</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Switch User View</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {users.map((user) => (
          <DropdownMenuItem
            key={user.id}
            className={user.id === currentUser?.id ? "bg-secondary" : ""}
            onClick={() => handleChangeUser(user.id)}
          >
            <div className="flex flex-col">
              <span>{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.role} {user.isAdmin ? "(admin)" : ""}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
