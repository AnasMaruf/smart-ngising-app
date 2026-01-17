import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useRegisterMutation } from "@/features/auth/api/register";
import type { User } from "@/features/auth/api/register/type";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  register: (data: {
    fullName: string;
    username: string;
    email: string;
    pin: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isRegistering: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const registerMutation = useRegisterMutation();

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync("user");
      if (stored) setUser(JSON.parse(stored));
      setIsLoading(false);
    })();
  }, []);

  const register = async (data: {
    fullName: string;
    username: string;
    email: string;
    pin: string;
  }) => {
    const res = await registerMutation.mutateAsync(data);
    await SecureStore.setItemAsync("accessToken", res.data.accessToken);
    await SecureStore.setItemAsync("refreshToken", res.data.refreshToken);
    await SecureStore.setItemAsync("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, register, logout, isRegistering: registerMutation.isPending }}
    >
      {children}
    </AuthContext.Provider>
  );
};
