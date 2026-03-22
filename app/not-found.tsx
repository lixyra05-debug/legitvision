import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
      <ShieldCheck className="size-12 text-emerald-500" />
      <div className="text-center">
        <h1 className="font-heading text-6xl font-bold text-emerald-500">404</h1>
        <p className="mt-2 text-muted-foreground">Cette page n&apos;existe pas.</p>
      </div>
      <Link
        href="/"
        className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-400"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
