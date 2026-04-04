
import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { UserSwitcher } from "@/components/user/UserSwitcher";
import { usePermission } from "@/contexts/PermissionContext";
import { useUser } from "@/contexts/UserContext";
import { signOut } from "@/services/authService";

export const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { can } = usePermission();
  const { currentUser } = useUser();

  // Only show admin button for admin users
  const showAdminButton = currentUser?.isAdmin;

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => navigate("/")}
                >
                  Home
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => navigate("/profile")}
                >
                  My Profile
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => navigate("/games")}
                >
                  Games
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => navigate("/classroom-sessions")}
                >
                  Classroom Sessions
                </Button>
                {showAdminButton && (
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => navigate("/admin")}
                  >
                    Admin Dashboard
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex items-center" onClick={() => navigate("/")}>
            <h1 className="text-xl font-bold tracking-tight cursor-pointer">
              TCOA Camp Management
            </h1>
          </div>
        </div>
        <div className="flex-1" />
        <div className="mr-4">
          <UserSwitcher />
        </div>
        <nav className="hidden md:flex gap-6 mr-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/profile")}
          >
            My Profile
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/games")}
          >
            Games
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/classroom-sessions")}
          >
            Classroom Sessions
          </Button>
          {showAdminButton && (
            <Button
              variant="ghost"
              onClick={() => navigate("/admin")}
            >
              Admin
            </Button>
          )}
          <Button
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </nav>
      </div>
    </header>
  );
};
