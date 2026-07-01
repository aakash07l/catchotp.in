'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }) {
  // Replace with your actual Privy App ID in Vercel Environment Variables
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "clv1234560000000000000000";

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#10b981', // Emerald
          showWalletLoginFirst: false,
        },
        loginMethods: ['email', 'google'],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
