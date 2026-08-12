"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, LayoutDashboard, CreditCard } from "lucide-react";
import Link from "next/link";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

/**
 * Design system : emerald dosé — il ne porte que le bouton de connexion et
 * l'avatar, tous deux cliquables. La déconnexion est en --destructive, un rôle
 * d'interface (action irréversible), découplé du verdict « contrefait ».
 */
export function UserMenu() {
  const { t } = useTranslation();
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
    return <div className="h-9 w-24 animate-pulse rounded-md bg-surface" />;
  }

  if (!user) {
    return (
      <Link
        href="/auth"
        className="inline-flex h-9 items-center rounded-md bg-accent px-4 text-ui font-medium text-accent-foreground transition-colors duration-fast hover:bg-accent-hover"
      >
        {t("userMenu.signIn")}
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
        className="flex size-9 items-center justify-center rounded-full bg-surface-raised text-ui font-semibold text-foreground transition-colors duration-fast hover:bg-surface-hover"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 rounded-md border border-line bg-popover p-1 shadow-xl shadow-black/40">
          <div className="border-b border-line px-3 py-2">
            <p className="truncate text-ui font-medium">
              {user.user_metadata?.full_name}
            </p>
            <p className="truncate text-caption text-muted-foreground">
              {user.email}
            </p>
          </div>

          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-sm px-3 py-2 text-ui text-muted-foreground transition-colors duration-fast hover:bg-surface-hover hover:text-foreground"
            >
              <LayoutDashboard className="size-4" />
              {t("userMenu.dashboard")}
            </Link>
            <Link
              href="/dashboard/subscription"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-sm px-3 py-2 text-ui text-muted-foreground transition-colors duration-fast hover:bg-surface-hover hover:text-foreground"
            >
              <CreditCard className="size-4" />
              {t("userMenu.manageSubscription")}
            </Link>
          </div>

          <div className="border-t border-line py-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-ui text-destructive transition-colors duration-fast hover:bg-destructive/10"
            >
              <LogOut className="size-4" />
              {t("userMenu.signOut")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
