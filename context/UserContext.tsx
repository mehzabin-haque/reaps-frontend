'use client';
import React, { createContext, useState, ReactNode, useMemo, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role?: string; // Add role to User interface
}

interface UserContextType {
  user: User | null;
  updateUser: (newUser: User | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const updateUser = (newUser: User | null) => {
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
    setUser(newUser);
  };

  const value = useMemo(() => ({ user, updateUser }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
