import Link from "next/link";
import Image from "next/image";

export function SeoNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-line-subtle bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:py-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-7">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/legitvision-logo.png"
              alt="LegitVision"
              width={240}
              height={64}
              className="h-12 w-auto sm:h-16"
              priority
            />
          </Link>
          {/* Maillage interne : liens horizontaux vers les 3 hubs SEO */}
          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-1 text-ui"
            style={{ color: "var(--text-secondary)" }}
          >
            <Link
              href="/legit-check"
              className="transition-colors duration-fast hover:text-foreground"
            >
              Vérifier l&apos;authenticité
            </Link>
            <Link
              href="/acheter-authentique"
              className="transition-colors duration-fast hover:text-foreground"
            >
              Où acheter
            </Link>
            <Link
              href="/guide"
              className="transition-colors duration-fast hover:text-foreground"
            >
              Guides par marque
            </Link>
          </div>
        </div>
        <Link
          href="/auth"
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md bg-accent px-5 text-ui font-semibold text-accent-foreground shadow-card transition-[color,background-color,border-color,transform] duration-fast hover:scale-[1.02] hover:bg-accent-hover active:scale-100 sm:w-auto"
        >
          Analyser une photo — 3,99 €
        </Link>
      </div>
    </nav>
  );
}
