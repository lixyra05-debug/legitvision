"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Loader2, Mail } from "lucide-react";
import Link from "next/link";

const AUTH_ERRORS: Record<string, string> = {
  "Invalid login credentials": "Email ou mot de passe incorrect.",
  "User already registered": "Un compte existe déjà avec cet email.",
  "Password should be at least 6 characters":
    "Le mot de passe doit contenir au moins 6 caractères.",
  "Unable to validate email address: invalid format":
    "Format d'email invalide.",
  "Email rate limit exceeded":
    "Trop de tentatives. Réessayez dans quelques minutes.",
  "For security purposes, you can only request this once every 60 seconds":
    "Veuillez patienter 60 secondes avant de réessayer.",
  callback_error: "Erreur lors de la connexion. Veuillez réessayer.",
};

function translateError(message: string): string {
  return AUTH_ERRORS[message] ?? `Erreur : ${message}`;
}

type Mode = "login" | "register";

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") ?? "/dashboard";

  // Show callback error from URL
  const urlError = searchParams?.get("error");

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setError(translateError(error.message));
          return;
        }
        router.push(redirect);
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${redirect}`,
          },
        });
        if (error) {
          setError(translateError(error.message));
          return;
        }
        setConfirmationSent(true);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=${redirect}`,
      },
    });
    if (error) {
      setError(translateError(error.message));
    }
  }

  if (confirmationSent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10">
            <Mail className="size-8 text-emerald-500" />
          </div>
          <h2 className="font-heading text-2xl font-bold">
            Vérifiez votre email
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Un lien de confirmation a été envoyé à{" "}
            <span className="font-medium text-foreground">{email}</span>.
            Cliquez dessus pour activer votre compte.
          </p>
          <button
            onClick={() => {
              setConfirmationSent(false);
              setMode("login");
            }}
            className="mt-8 text-sm text-emerald-500 hover:text-emerald-400"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <ShieldCheck className="size-8 text-emerald-500" />
          <span className="font-heading text-2xl font-bold tracking-tight">
            LegitVision
          </span>
        </Link>

        {/* Tabs */}
        <div className="mb-8 flex rounded-lg border border-white/10 bg-card p-1">
          <button
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === "login"
                ? "bg-emerald-500 text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Se connecter
          </button>
          <button
            onClick={() => {
              setMode("register");
              setError(null);
            }}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === "register"
                ? "bg-emerald-500 text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Créer un compte
          </button>
        </div>

        {/* Error */}
        {(error || urlError) && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error ?? translateError(urlError!)}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm">
                Nom complet
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jean Dupont"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-11 border-white/10 bg-card placeholder:text-muted-foreground/50 focus-visible:ring-emerald-500"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 border-white/10 bg-card placeholder:text-muted-foreground/50 focus-visible:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={
                mode === "register" ? "6 caractères minimum" : "••••••••"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-11 border-white/10 bg-card placeholder:text-muted-foreground/50 focus-visible:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-emerald-500 font-semibold text-white transition-colors hover:bg-emerald-400 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : mode === "login" ? (
              "Se connecter"
            ) : (
              "Créer mon compte"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-muted-foreground">ou</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleLogin}
          className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-white/10 text-sm font-medium transition-colors hover:border-white/20 hover:bg-white/5"
        >
          <svg className="size-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continuer avec Google
        </button>

        {/* Back to home */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ← Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
