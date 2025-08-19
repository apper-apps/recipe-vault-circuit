import React from "react";
import Error from "@/components/ui/Error";
// Mock user data
const mockUsers = [
  {
    Id: 1,
    email: 'admin@example.com',
    password: 'password',
    name: 'Recipe Admin',
    avatar: null
  },
  {
    Id: 2,
    email: 'chef.maria@example.com',
    password: 'password',
    name: 'Chef Maria Rodriguez',
    avatar: null
  },
  {
    Id: 3,
    email: 'john.baker@example.com',
    password: 'password',
    name: 'John Baker',
    avatar: null
  },
  {
    Id: 4,
    email: 'sarah.cook@example.com',
    password: 'password',
    name: 'Sarah Cook',
    avatar: null
  },
  {
    Id: 5,
    email: 'mike.chef@example.com',
    password: 'password',
    name: 'Mike Thompson',
    avatar: null
  },
  {
    Id: 6,
    email: 'emily.kitchen@example.com',
    password: 'password',
    name: 'Emily Johnson',
    avatar: null
  },
  {
    Id: 7,
    email: 'david.recipes@example.com',
    password: 'password',
    name: 'David Wilson',
    avatar: null
  },
  {
    Id: 8,
    email: 'lisa.food@example.com',
    password: 'password',
    name: 'Lisa Chen',
    avatar: null
  },
  {
    Id: 9,
    email: 'alex.cuisine@example.com',
    password: 'password',
    name: 'Alex Martinez',
    avatar: null
  },
  {
    Id: 10,
    email: 'jessica.meals@example.com',
    password: 'password',
    name: 'Jessica Brown',
    avatar: null
  }
];

let currentUser = null;

// Initialize from localStorage
const initializeAuth = () => {
  const stored = localStorage.getItem('recipeVault_user');
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
    } catch (error) {
      localStorage.removeItem('recipeVault_user');
    }
  }
};

// Call initialization
initializeAuth();

export const authService = {
  // Login user
  async login(email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Don't store password in session
    const { password: _, ...userSession } = user;
    currentUser = userSession;
    
    // Store in localStorage
    localStorage.setItem('recipeVault_user', JSON.stringify(userSession));
    
    return userSession;
  },

  // Register new user
  async signup(email, password, name) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }
    
    // Generate new ID
    const newId = mockUsers.length > 0 ? Math.max(...mockUsers.map(u => u.Id)) + 1 : 1;
    
    // Create new user
    const newUser = {
      Id: newId,
      email: email.toLowerCase(),
      password,
      name,
      avatar: null
    };
    
    // Add to mock data
    mockUsers.push(newUser);
    
    // Auto-login after signup
    const { password: _, ...userSession } = newUser;
    currentUser = userSession;
    
    // Store in localStorage
    localStorage.setItem('recipeVault_user', JSON.stringify(userSession));
    
    return userSession;
  },

  // Logout user
  logout() {
    currentUser = null;
    localStorage.removeItem('recipeVault_user');
  },

  // Get current user
  getCurrentUser() {
    return currentUser;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return currentUser !== null;
  },

  // Get user by ID
  getById(id) {
    if (!Number.isInteger(id) || id < 1) {
      throw new Error('Invalid user ID');
    }
    
const user = mockUsers.find(u => u.Id === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Don't return password
    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  // Create new user (admin function)
  async createUser(email, password, name) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }
    
    // Generate new ID
    const newId = mockUsers.length > 0 ? Math.max(...mockUsers.map(u => u.Id)) + 1 : 1;
    
    // Create new user
    const newUser = {
      Id: newId,
      email: email.toLowerCase(),
      password,
      name,
      avatar: null
    };
    
    // Add to mock data
    mockUsers.push(newUser);
    
    // Return user without password
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  },

// Get all users (admin function)
  getAllUsers() {
    // Return all users without passwords
    return mockUsers.map(user => {
      const { password: _, ...safeUser } = user;
      return safeUser;
    });
  },

  // Switch to a different user
  switchUser(userId) {
    const user = mockUsers.find(u => u.Id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { password: _, ...safeUser } = user;
    currentUser = safeUser;
    localStorage.setItem('recipeVault_user', JSON.stringify(safeUser));
    return safeUser;
  }
};