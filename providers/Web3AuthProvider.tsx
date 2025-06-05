"use client";

import { createContext, useContext, ReactNode, FC, useState } from 'react';

interface Web3AuthContextType {
  state: {
    authInfo: string | null;
  };
  fetchAuthInfo: () => Promise<void>;
}

export const Web3AuthContext = createContext<Web3AuthContextType>({
  state: {
    authInfo: null
  },
  fetchAuthInfo: async () => {}
});

export const Web3AuthContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [authInfo, setAuthInfo] = useState<string | null>(null);

  const fetchAuthInfo = async () => {
    // Implement your auth info fetching logic here
    // For now, we'll just use a placeholder
    setAuthInfo("placeholder_auth_info");
  };
  
  return (
    <Web3AuthContext.Provider 
      value={{
        state: {
          authInfo
        },
        fetchAuthInfo
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error('[useWeb3Auth] Component not wrapped within a Provider');
  }
  return context;
}; 