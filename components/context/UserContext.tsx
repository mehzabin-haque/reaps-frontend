// context/UserContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  User, 
  AIPolicyDocument, 
  PolicyRecommendation, 
  PolicyUpdate, 
  Scorecard, 
  Country,
  CustomizationCriteria 
} from '../interface';
import axios from 'axios'; // Assuming you're using Axios for HTTP requests

// Define the context type
interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  customization: CustomizationCriteria | null;
  setCustomization: (criteria: CustomizationCriteria) => void;
  uploadedDocuments: AIPolicyDocument[];
  setUploadedDocuments: (documents: AIPolicyDocument[]) => void;
  // Methods to manage other entities can be added here
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customization, setCustomization] = useState<CustomizationCriteria | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<AIPolicyDocument[]>([]);
  
  // Example: Fetch user data from an API when user state changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const [customRes, documentsRes] = await Promise.all([
            axios.get(`/api/users/${user.id}/customization`),
            axios.get(`/api/users/${user.id}/documents`)
          ]);
          setCustomization(customRes.data);
          setUploadedDocuments(documentsRes.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setCustomization(null);
        setUploadedDocuments([]);
      }
    };

    fetchUserData();
  }, [user]);

  // Login method
  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      setUser(response.data.user);
      // Optionally, store token or handle authentication headers
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout method
  const logout = () => {
    setUser(null);
    // Optionally, clear tokens or handle logout on server
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        customization,
        setCustomization,
        uploadedDocuments,
        setUploadedDocuments,
        // Include other entities and methods here
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
