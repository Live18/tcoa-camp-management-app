
import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "camper" | "observer" | "presenter" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  bio?: string;
  phone?: string;
  role: UserRole;
  isAdmin: boolean;
  comments?: string;
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Sample users
const sampleUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    photoUrl: "https://i.pravatar.cc/150?img=1",
    bio: "Camp administrator",
    phone: "555-123-4567",
    role: "admin",
    isAdmin: true,
  },
  {
    id: "2",
    name: "John Smith",
    email: "john@example.com",
    photoUrl: "https://i.pravatar.cc/150?img=2",
    bio: "Basketball enthusiast",
    phone: "555-987-6543",
    role: "presenter",
    isAdmin: false,
    comments: "Excited to teach basketball fundamentals!"
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    photoUrl: "https://i.pravatar.cc/150?img=3",
    bio: "First-time camper",
    phone: "555-234-5678",
    role: "camper",
    isAdmin: false,
  },
];

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(sampleUsers[0]);
  const [users, setUsers] = useState<User[]>(sampleUsers);

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, users, setUsers, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
