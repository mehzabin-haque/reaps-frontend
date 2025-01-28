'use client';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';

export default function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return {
    user: context.user,
    updateUser: context.updateUser,
    logout: () => {
      context.updateUser(null); // Clear user context
      localStorage.removeItem('jwtToken'); // Clear token
      localStorage.removeItem('user'); // Clear user data
    },
  };
}
