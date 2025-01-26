// interfaces.ts

// User Interface
export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
    createdAt: string;
   
  }
  
  // AI Policy Document Interface
  export interface AIPolicyDocument {
    id: number;
    userId: number;
    country: string;
    title: string;
    content: string;
    uploadedAt: string;
    validated: boolean;
  }
  
  // Policy Recommendation Interface
  export interface PolicyRecommendation {
    id: number;
    documentId: number;
    recommendations: string[];
    generatedAt: string;
  }
  
  // Policy Update Interface
  export interface PolicyUpdate {
    id: number;
    recommendationId: number;
    updateContent: string;
    updatedAt: string;
  }
  
  // Scorecard Interface
  export interface Scorecard {
    id: number;
    userId: number;
    country: string;
    governance: number;
    ethics: number;
    economicImplications: number;
    createdAt: string;
  }
  
  // Country Interface
  export interface Country {
    id: number;
    name: string;
    income: string;
    population: number;
    gdp: number;

  }
  
  // User Customization Criteria Interface
  export interface CustomizationCriteria {
    id: number;
    userId: number;
    preferences: Record<string, any>; // Define according to preferences structure
    createdAt: string;
  }
  