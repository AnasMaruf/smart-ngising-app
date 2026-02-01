import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";
import { useLoginMutation } from "@/features/auth/api/login";
import type { LoginRequest } from "@/features/auth/api/login/type";
import { useRegisterMutation } from "@/features/auth/api/register";
import type { User } from "@/features/auth/api/register/type";
import { subscribeAuthEvent } from "./authEvents";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  register: (data: {
    fullName: string;
    username: string;
    email: string;
    pin: string;
  }) => Promise<void>;
  login: (data: Pick<LoginRequest, "email" | "username" | "pin">) => Promise<void>;
  logout: () => Promise<void>;
  isRegistering: boolean;
  isLoggingIn: boolean;
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
  const loginMutation = useLoginMutation();

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync("user");
      if (stored) setUser(JSON.parse(stored));
      setIsLoading(false);
    })();
  }, []);

  const register = useCallback(
    async (data: { fullName: string; username: string; email: string; pin: string }) => {
      const res = await registerMutation.mutateAsync(data);
      await SecureStore.setItemAsync("accessToken", res.data.accessToken);
      await SecureStore.setItemAsync("refreshToken", res.data.refreshToken);
      await SecureStore.setItemAsync("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    },
    [registerMutation]
  );

  const login = useCallback(
    async (data: Pick<LoginRequest, "email" | "username" | "pin">) => {
      const res = await loginMutation.mutateAsync(data);
      await SecureStore.setItemAsync("accessToken", res.accessToken);
      await SecureStore.setItemAsync("refreshToken", res.refreshToken);
      await SecureStore.setItemAsync("user", JSON.stringify(res.data));
      setUser(res.data);
    },
    [loginMutation]
  );

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("user");
    setUser(null);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeAuthEvent(async (event) => {
      if (event === "FORCE_LOGOUT") {
        await logout();
      }
    });
    return unsubscribe;
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        register,
        login,
        logout,
        isRegistering: registerMutation.isPending,
        isLoggingIn: loginMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
