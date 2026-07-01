'use client';

import React, { createContext, useContext, useState } from 'react';
import { PrivyProvider, usePrivy } from '@privy-io/react-auth';

const MockPrivyContext = createContext(null);

export function MockPrivyProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = () => {
    // Simple custom mockup flow for demonstration if Privy App ID is not set
    const email = prompt("Enter email address to continue:", "guest@catchotp.in");
    if (email) {
      setAuthenticated(true);
      setUser({ email });
    }
  };

  const logout = () => {
    setAuthenticated(false);
    setUser(null);
  };

  return (
    <MockPrivyContext.Provider value={{
      login,
      logout,
      authenticated,
      ready: true,
      user
    }}>
      {children}
    </MockPrivyContext.Provider>
  );
}

// Safe unified useAuth hook
export function useAuth() {
  const mockContext = useContext(MockPrivyContext);
  
  // If mock context exists, we are running in fallback mode
  if (mockContext) {
    return mockContext;
  }
  
  // Otherwise, try to invoke the real Privy hook
  try {
    return usePrivy();
  } catch (error) {
    // Fallback if hook is called outside the provider context
    return {
      login: () => {},
      logout: () => {},
      authenticated: false,
      ready: true,
      user: null
    };
  }
}

export default function Providers({ children }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  
  // Verify if Privy App ID is configured and is not the default placeholder
  const isPrivyConfigured = appId && appId !== "clv1234560000000000000000" && appId.trim().length > 10;

  if (isPrivyConfigured) {
    return (
      <PrivyProvider
        appId={appId}
        config={{
          appearance: {
            theme: 'dark',
            accentColor: '#10b981',
            showWalletLoginFirst: false,
          },
          loginMethods: ['email', 'google'],
        }}
      >
        {children}
      </PrivyProvider>
    );
  }

  // Fallback to Mock Privy Provider for instant loading / testing
  return (
    <MockPrivyProvider>
      {children}
    </MockPrivyProvider>
  );
}
