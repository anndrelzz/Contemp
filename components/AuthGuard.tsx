"use client";

import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { getSession, onAuthStateChange } from "@/lib/supabase";
import { LoginForm } from "@/components/LoginForm";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((s) => {
      setSession(s);
      setLoading(false);
    });

    const { data: listener } = onAuthStateChange((s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <Loader2 size={28} className="animate-spin text-red-600" />
      </div>
    );
  }

  if (!session) return <LoginForm />;

  return <>{children}</>;
}
