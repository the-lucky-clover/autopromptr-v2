
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle authentication tokens from URL hash (email verification)
    const handleAuthFromUrl = async () => {
      const hashFragment = window.location.hash;
      if (hashFragment && hashFragment.includes('access_token')) {
        try {
          const { data, error } = await supabase.auth.getSessionFromUrl();
          if (error) {
            console.error('Error getting session from URL:', error);
          } else if (data.session) {
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            // Session will be handled by onAuthStateChange
          }
        } catch (error) {
          console.error('Error processing auth URL:', error);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle successful sign in from email verification
        if (event === 'SIGNED_IN' && session?.user) {
          // Defer navigation to prevent issues
          setTimeout(() => {
            if (window.location.pathname === '/auth' || window.location.hash.includes('access_token')) {
              window.location.href = '/';
            }
          }, 100);
        }
      }
    );

    // Handle auth from URL first
    handleAuthFromUrl();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
