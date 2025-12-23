import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  profile: any | null;
  profileLoading: boolean; // Profil yüklenme durumu eklendi
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  profile: null,
  profileLoading: true,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const refreshProfile = async () => {
    // Session user yoksa profili de sıfırla ama loading'i bitir
    const currentUser = (await supabase.auth.getUser()).data.user;
    
    if (!currentUser) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      
      if (error) {
        // Profil yoksa (henüz oluşturulmadıysa) null dönebilir
        console.log('Profil getirilemedi veya yok:', error.message);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (e) {
      console.error('Exception fetching profile:', e);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    // İlk yükleme
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        refreshProfile();
      } else {
        setProfileLoading(false);
      }
    });

    // Auth değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        await refreshProfile();
      } else {
        setProfile(null);
        setProfileLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, profile, profileLoading, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
