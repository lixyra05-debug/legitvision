"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogIn, LogOut, LayoutDashboard, CreditCard } from "lucide-react";
import Link from "next/link";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { SUBSCRIPTIONS_ON_SALE } from "@/lib/stripe/config";
import { BasculeLangue } from "@/components/BasculeLangue";

/** id du menu ouvert, que son bouton désigne (aria-controls). Un seul menu par page. */
export const MENU_DU_COMPTE_ID = "menu-du-compte";

/**
 * Suite du nom du bouton du compte, après les initiales : ce qu'il ouvre. En
 * français dans les deux langues, avec lang="fr", comme le lien de la marque :
 * la version anglaise sera retirée, on n'y ajoute plus de texte.
 */
const NOM_DU_MENU_DU_COMPTE = "menu du compte et langue";

/**
 * Design system : emerald dosé — il ne porte que le bouton de connexion et
 * l'avatar, tous deux cliquables. La déconnexion est en --destructive, un rôle
 * d'interface (action irréversible), découplé du verdict « contrefait ».
 *
 * `connecte` : la page n'est servie qu'à un visiteur connecté (tableau de bord,
 * nouvelle analyse). Pendant la lecture de la session, l'emplacement prend la
 * taille de l'avatar (36 px) et non celle du bouton « Se connecter » : 96 px
 * faisaient déborder ces en-têtes sur téléphone. Si cette lecture ne rend
 * personne (session fermée ailleurs, échec réseau), le lien de connexion garde
 * cette taille sous 640 px : une icône, « Se connecter » en sr-only ; à partir
 * de 640 px, l'icône et le libellé, sur une ligne. Le libellé complet faisait
 * défiler l'en-tête du tableau de bord jusqu'à 399 px, et jusqu'à 416 px avec
 * un solde à trois chiffres (mesures du 05/10).
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
 * sur téléphone, le bouton FR/EN des en-têtes est masqué, et ce menu est le
 * seul chemin vers la langue sur le tableau de bord et la nouvelle analyse.
 */
export function UserMenu({ connecte = false }: { connecte?: boolean }) {
  const { t } = useTranslation();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
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

  async function handleLogout() {
    await supabase.auth.signOut();
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
    return connecte ? (
      <Link
        href="/auth"
        className="inline-flex h-9 min-w-9 items-center justify-center gap-2 rounded-full bg-accent text-ui font-medium text-accent-foreground transition-colors duration-fast hover:bg-accent-hover sm:rounded-md sm:px-4"
      >
        <LogIn aria-hidden="true" className="size-4 shrink-0" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t("userMenu.signIn")}</span>
      </Link>
    ) : (
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
    <CompteConnecte
      initiales={initials}
      nom={user.user_metadata?.full_name}
      email={user.email}
      onDeconnexion={handleLogout}
    />
  );
}

/**
 * Le bouton du compte (les initiales) et son menu. Composant à part pour que
 * tests/unit/langue-telephone.test.ts le rende tel quel, fermé ou ouvert
 * (`ouvertParDefaut`) : UserMenu ne le rend qu'après la lecture de la session.
 *
 * Accessibilité (motif « disclosure ») :
 * - nom (aria-label) : les initiales affichées d'abord (WCAG 2.5.3), puis ce
 *   qu'ouvre le bouton : « HV, menu du compte et langue » (WCAG 4.1.2, 2.4.6),
 *   en français, annoncé comme tel (lang). Un texte sr-only à la suite des
 *   initiales donnait « HV , menu… » dans Chromium, qui sépare par une espace
 *   un enfant hors flux ;
 * - aria-expanded dit si le menu est ouvert ; aria-controls le désigne quand
 *   il l'est ;
 * - Échap ferme le menu et rend le focus au bouton ;
 * - le menu se ferme quand le focus en sort (Tab après « Se déconnecter »,
 *   Maj+Tab avant le bouton) : resté ouvert, il recouvrait l'élément suivant
 *   (« Nouvelle analyse » sur téléphone). Un clic hors du menu le ferme aussi ;
 *   un focus qui ne va vers aucun élément (autre fenêtre, zone inerte) le
 *   laisse ouvert.
 * La commande de langue du menu le laisse ouvert et garde le focus.
 */
export function CompteConnecte({
  initiales,
  nom,
  email,
  onDeconnexion,
  ouvertParDefaut = false,
}: {
  initiales: string;
  nom?: string;
  email?: string;
  onDeconnexion: () => void | Promise<void>;
  ouvertParDefaut?: boolean;
}) {
  const [open, setOpen] = useState(ouvertParDefaut);
  const conteneurRef = useRef<HTMLDivElement>(null);
  const boutonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (conteneurRef.current && !conteneurRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpen(false);
      boutonRef.current?.focus();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div
      ref={conteneurRef}
      className="relative"
      onBlur={(e) => {
        const destination = e.relatedTarget;
        if (destination && !e.currentTarget.contains(destination)) setOpen(false);
      }}
    >
      <button
        ref={boutonRef}
        type="button"
        lang="fr"
        onClick={() => setOpen(!open)}
        aria-label={`${initiales}, ${NOM_DU_MENU_DU_COMPTE}`}
        aria-expanded={open}
        aria-controls={open ? MENU_DU_COMPTE_ID : undefined}
        className="flex size-9 items-center justify-center rounded-full bg-surface-raised text-ui font-semibold text-foreground transition-colors duration-fast hover:bg-surface-hover"
      >
        {initiales}
      </button>

      {open && (
        <MenuDuCompte
          nom={nom}
          email={email}
          onFermer={() => setOpen(false)}
          onDeconnexion={async () => {
            await onDeconnexion();
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

/**
 * Le menu ouvert. Composant à part pour que tests/unit/langue-telephone.test.ts
 * le rende tel quel.
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
    <div
      id={MENU_DU_COMPTE_ID}
      className="absolute right-0 top-12 z-50 w-56 rounded-md border border-line bg-popover p-1 shadow-xl shadow-black/40"
    >
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
