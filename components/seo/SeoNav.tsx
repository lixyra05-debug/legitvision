import Link from "next/link";
import Image from "next/image";

export function SeoNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/legitvision-logo.png"
            alt="LegitVision"
            width={240}
            height={64}
            className="h-16 w-auto"
            priority
            unoptimized
          />
        </Link>
        <Link
          href="/auth"
          className="hidden rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-emerald-400 sm:block"
        >
          Analyser une photo — 3,99 €
        </Link>
      </div>
    </nav>
  );
}
