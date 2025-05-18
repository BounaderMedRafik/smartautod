import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User, AuthState } from '@/types';
import { Platform } from 'react-native';
import { router } from 'expo-router';

// For web, use localStorage instead of SecureStore
const tokenStorage = {
  async getItem(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  }
};

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    name: 'Demo User',
  },
];

type AuthAction =
  | { type: 'RESTORE_TOKEN'; token: string | null; user: User | null }
  | { type: 'SIGN_IN'; token: string; user: User }
  | { type: 'SIGN_OUT' }
  | { type: 'UPDATE_USER'; user: User };

type AuthContextType = {
  state: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        token: action.token,
        user: action.user,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...state,
        isSignout: false,
        token: action.token,
        user: action.user,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isSignout: true,
        token: null,
        user: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isLoading: true,
    isSignout: false,
    token: null,
    user: null,
  });

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken = null;
      let userData = null;

      try {
        userToken = await tokenStorage.getItem('userToken');
        const userStr = await tokenStorage.getItem('userData');
        if (userStr) {
          userData = JSON.parse(userStr);
        }
      } catch (e) {
        // Restoring token failed
        console.error('Failed to restore authentication state:', e);
      }

      // After restoring token, we may need to validate it
      dispatch({ type: 'RESTORE_TOKEN', token: userToken, user: userData });
      
      // Redirect based on authentication status
      if (userToken) {
        router.replace('/(app)');
      } else {
        router.replace('/(auth)');
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    state,
    signIn: async (email: string, password: string) => {
      // In a real app, we would send a request to a server API
      // For demo, we're just using mock data
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        const token = 'dummy-auth-token';
        const userData: User = {
          id: user.id,
          email: user.email,
          name: user.name,
        };
        
        // Store authentication data
        await tokenStorage.setItem('userToken', token);
        await tokenStorage.setItem('userData', JSON.stringify(userData));
        
        dispatch({ type: 'SIGN_IN', token, user: userData });
        router.replace('/(app)');
      } else {
        throw new Error('Invalid email or password');
      }
    },
    signOut: async () => {
      // Remove authentication data
      await tokenStorage.removeItem('userToken');
      await tokenStorage.removeItem('userData');
      
      dispatch({ type: 'SIGN_OUT' });
      router.replace('/(auth)');
    },
    signUp: async (name: string, email: string, password: string) => {
      // In a real app, we would send a request to a server API
      // For demo, we're just simulating a successful registration
      const newUser: User = {
        id: String(Date.now()),
        email,
        name,
      };
      
      const token = 'dummy-auth-token';
      
      // Store authentication data
      await tokenStorage.setItem('userToken', token);
      await tokenStorage.setItem('userData', JSON.stringify(newUser));
      
      dispatch({ type: 'SIGN_IN', token, user: newUser });
      router.replace('/(app)');
    },
    updateUser: (user: User) => {
      dispatch({ type: 'UPDATE_USER', user });
      tokenStorage.setItem('userData', JSON.stringify(user));
    },
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};