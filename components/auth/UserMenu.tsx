"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, LayoutDashboard, CreditCard } from "lucide-react";
import Link from "next/link";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { SUBSCRIPTIONS_ON_SALE } from "@/lib/stripe/config";
import { BasculeLangue } from "@/components/BasculeLangue";

/**
 * Design system : emerald dosé — il ne porte que le bouton de connexion et
 * l'avatar, tous deux cliquables. La déconnexion est en --destructive, un rôle
 * d'interface (action irréversible), découplé du verdict « contrefait ».
 *
 * `connecte` : la page n'est servie qu'à un visiteur connecté (tableau de bord,
 * nouvelle analyse). Pendant la lecture de la session, l'emplacement prend la
 * taille de l'avatar (36 px) et non celle du bouton « Se connecter » : 96 px
 * faisaient déborder ces en-têtes sur téléphone.
 *
 * Sans `connecte` (accueil), le squelette porte le texte du bouton, en
 * transparent : il en a la largeur exacte dans la langue affichée (121 px pour
 * « Se connecter », 77 px pour « Sign in »). Avec 96 px fixes, l'en-tête de
 * l'accueil débordait en anglais pendant cette lecture (mesures du 05/10).
 * « Se connecter » tient sur une ligne (whitespace-nowrap) : faute de place,
 * il passait sur deux lignes et sortait du bouton (accueil, jusqu'à 346 px ;
 * « Sign in », jusqu'à 351 px).
 *
 * Le menu ouvert (MenuDuCompte) porte la commande de langue (BasculeLangue) :
 * sur téléphone, le bouton FR/EN des en-têtes est masqué.
 */
export function UserMenu({ connecte = false }: { connecte?: boolean }) {
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
    return connecte ? (
      <div className="size-9 animate-pulse rounded-full bg-surface" />
    ) : (
      <div
        aria-hidden="true"
        className="inline-flex h-9 animate-pulse select-none items-center whitespace-nowrap rounded-md bg-surface px-4 text-ui font-medium text-transparent"
      >
        {t("userMenu.signIn")}
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/auth"
        className="inline-flex h-9 items-center whitespace-nowrap rounded-md bg-accent px-4 text-ui font-medium text-accent-foreground transition-colors duration-fast hover:bg-accent-hover"
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
        <MenuDuCompte
          nom={user.user_metadata?.full_name}
          email={user.email}
          onFermer={() => setOpen(false)}
          onDeconnexion={handleLogout}
        />
      )}
    </div>
  );
}

/**
 * Le menu ouvert. Composant à part pour que tests/unit/langue-telephone.test.ts
 * le rende tel quel (UserMenu ne s'ouvre qu'après la lecture de la session).
 */
export function MenuDuCompte({
  nom,
  email,
  onFermer,
  onDeconnexion,
}: {
  nom?: string;
  email?: string;
  onFermer: () => void;
  onDeconnexion: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="absolute right-0 top-12 z-50 w-56 rounded-md border border-line bg-popover p-1 shadow-xl shadow-black/40">
      <div className="border-b border-line px-3 py-2">
        <p className="truncate text-ui font-medium">{nom}</p>
        <p className="truncate text-caption text-muted-foreground">{email}</p>
      </div>

      <div className="py-1">
        <Link
          href="/dashboard"
          onClick={onFermer}
          className="flex items-center gap-2 rounded-sm px-3 py-2 text-ui text-muted-foreground transition-colors duration-fast hover:bg-surface-hover hover:text-foreground"
        >
          <LayoutDashboard className="size-4" />
          {t("userMenu.dashboard")}
        </Link>
        {SUBSCRIPTIONS_ON_SALE && (
          <Link
            href="/dashboard/subscription"
            onClick={onFermer}
            className="flex items-center gap-2 rounded-sm px-3 py-2 text-ui text-muted-foreground transition-colors duration-fast hover:bg-surface-hover hover:text-foreground"
          >
            <CreditCard className="size-4" />
            {t("userMenu.manageSubscription")}
          </Link>
        )}
        <BasculeLangue variante="menu" />
      </div>

      <div className="border-t border-line py-1">
        <button
          onClick={onDeconnexion}
          className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-ui text-destructive transition-colors duration-fast hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          {t("userMenu.signOut")}
        </button>
      </div>
    </div>
  );
}
