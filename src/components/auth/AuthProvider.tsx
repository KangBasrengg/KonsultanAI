"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, SupabaseClient } from "@supabase/supabase-js";
import AuthModal from "./AuthModal";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  isPremium: boolean;
  role: "user" | "admin" | "advokat" | "government" | "enterprise";
  tier: string;
  consultationCount: number;
  createdAt: string;
  subscriptionStartedAt: string | null;
  subscriptionExpiresAt: string | null;
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
  openAuthModal: () => { },
  closeAuthModal: () => { },
  logout: async () => { },
  refreshProfile: async () => { },
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

  const supabase = useMemo(() => createClient(), []);

  // Use a ref to track current user ID to avoid unnecessary state updates
  const currentUserIdRef = useRef<string | null>(null);

  // fetchProfile uses a ref-based approach to avoid dependency on `user` object.
  const fetchProfile = useCallback(async (
    userId: string,
    fallbackEmail?: string,
    fallbackCreatedAt?: string,
    fallbackMetadata?: any
  ) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("email, full_name, is_premium, role, tier, created_at, subscription_started_at, subscription_expires_at")
        .eq("id", userId)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching user profile from Supabase:", profileError);
      }

      const { count, error: countError } = await supabase
        .from("consultations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (countError) {
        console.error("Error fetching consultation count:", countError);
      }

      setProfile({
        id: userId,
        email: profileData?.email || fallbackEmail || "",
        fullName: profileData?.full_name || fallbackMetadata?.full_name || fallbackMetadata?.name || null,
        avatarUrl: fallbackMetadata?.avatar_url || fallbackMetadata?.picture || null,
        isPremium: profileData?.role === "admin" ? true : (profileData?.is_premium || false),
        role: profileData?.role || "user",
        tier: profileData?.role === "admin" ? "admin" : (profileData?.tier || "free"),
        subscriptionStartedAt: profileData?.subscription_started_at || null,
        subscriptionExpiresAt: profileData?.subscription_expires_at || null,
        consultationCount: count || 0,
        createdAt: profileData?.created_at || fallbackCreatedAt || new Date().toISOString()
      });
    } catch (e) {
      console.error("[AuthProvider] Failed to fetch profile data:", e);
    }
  }, [supabase]);

  // Verify session on mount and on tab refocus
  useEffect(() => {
    let mounted = true;

    async function verifySession() {
      setIsVerifying(true);
      
      // Fallback timeout to prevent infinite loading screen if Supabase hangs
      const fallbackTimeout = setTimeout(() => {
        if (mounted) {
          console.warn("[AuthProvider] Session verification timeout reached");
          setIsVerifying(false);
          setIsLoading(false);
        }
      }, 5000);

      try {
        // getUser() performs a server-side verification (not just local token check)
        const { data: { user: authUser }, error } = await supabase.auth.getUser();

        if (error || !authUser) {
          // Session is invalid or expired
          if (mounted) {
            currentUserIdRef.current = null;
            setUser(null);
            setProfile(null);

            // If there's an error (e.g. Invalid Refresh Token), clear the bad tokens
            if (error) {
              await supabase.auth.signOut().catch(() => { });
            }
          }
        } else {
          if (mounted) {
            // Only update state if user actually changed (prevents re-render loops)
            if (currentUserIdRef.current !== authUser.id) {
              currentUserIdRef.current = authUser.id;
              setUser(authUser);
              await fetchProfile(authUser.id, authUser.email, authUser.created_at, authUser.user_metadata);
            }
          }
        }
      } catch (e) {
        console.error("[AuthProvider] Session verification failed:", e);
        if (mounted) {
          currentUserIdRef.current = null;
          setUser(null);
          setProfile(null);
        }
      } finally {
        clearTimeout(fallbackTimeout);
        if (mounted) {
          setIsVerifying(false);
          setIsLoading(false);
        }
      }
    }

    verifySession();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        if (event === "SIGNED_IN" && session?.user) {
          currentUserIdRef.current = session.user.id;
          setUser(session.user);
          await fetchProfile(session.user.id, session.user.email, session.user.created_at, session.user.user_metadata);
          setIsLoading(false);
          setIsVerifying(false);
        } else if (event === "SIGNED_OUT") {
          currentUserIdRef.current = null;
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          setIsVerifying(false);
        } else if (event === "TOKEN_REFRESHED" && session?.user) {
          setUser(session.user);
          setIsLoading(false);
          setIsVerifying(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]); // Both are now stable references — effect runs only once

  const openAuthModal = useCallback((view: "login" | "register" = "login") => {
    setAuthModalView(view);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    currentUserIdRef.current = null;
    setUser(null);
    setProfile(null);
    window.location.href = "/";
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (currentUserIdRef.current && user) {
      await fetchProfile(currentUserIdRef.current, user.email, user.created_at, user.user_metadata);
    }
  }, [fetchProfile, user]);

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
