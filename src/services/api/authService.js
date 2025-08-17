// Mock user data
const mockUsers = [
  {
    Id: 1,
    email: 'admin@example.com',
    password: 'password',
    name: 'Recipe Admin',
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
  }
};