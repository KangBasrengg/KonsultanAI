"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import AuthModal from "./AuthModal";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  isPremium: boolean;
  role: "user" | "admin" | "advokat" | "government" | "enterprise";
  tier: string;
  consultationCount: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isVerifying: boolean;
  isAdmin: boolean;
  openAuthModal: (view?: "login" | "register") => void;
  closeAuthModal: () => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  isVerifying: false,
  isAdmin: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "register">("login");

  const supabase = createClient();

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (e) {
      console.error("[AuthProvider] Failed to fetch profile:", e);
    }
  }, []);

  // Verify session on mount and on tab refocus
  useEffect(() => {
    let mounted = true;

    async function verifySession() {
      setIsVerifying(true);
      try {
        // getUser() performs a server-side verification (not just local token check)
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          // Session is invalid or expired
          if (mounted) {
            setUser(null);
            setProfile(null);
          }
        } else {
          if (mounted) {
            setUser(user);
            await fetchProfile(user.id);
          }
        }
      } catch (e) {
        console.error("[AuthProvider] Session verification failed:", e);
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setIsVerifying(false);
          setIsLoading(false);
        }
      }
    }

    verifySession();

    // Re-verify when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        verifySession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
        } else if (event === "TOKEN_REFRESHED" && session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => {
      mounted = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const openAuthModal = useCallback((view: "login" | "register" = "login") => {
    setAuthModalView(view);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    window.location.href = "/";
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isVerifying,
        isAdmin,
        openAuthModal,
        closeAuthModal,
        logout,
        refreshProfile,
      }}
    >
      {children}
      <AuthModal
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        defaultView={authModalView}
      />
    </AuthContext.Provider>
  );
}
