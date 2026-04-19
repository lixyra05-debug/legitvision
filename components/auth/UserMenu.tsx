"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, LayoutDashboard, CreditCard } from "lucide-react";
import Link from "next/link";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function UserMenu() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="h-9 w-24 animate-pulse rounded-lg bg-white/5" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/auth"
        className="inline-flex h-9 items-center rounded-lg bg-emerald-500 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-400"
      >
        Se connecter
      </Link>
    );
  }

  const initials = (
    user.user_metadata?.full_name ??
    user.email ??
    "U"
  )
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex size-9 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/30"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-white/10 bg-card p-1 shadow-xl shadow-black/40">
          <div className="border-b border-white/5 px-3 py-2">
            <p className="truncate text-sm font-medium">{user.user_metadata?.full_name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>

          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/subscription"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <CreditCard className="size-4" />
              Gérer l&apos;abonnement
            </Link>
          </div>

          <div className="border-t border-white/5 py-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
            >
              <LogOut className="size-4" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
