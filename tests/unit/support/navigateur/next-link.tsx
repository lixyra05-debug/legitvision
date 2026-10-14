// Tient lieu de next/link dans le navigateur des tests (support/navigateur.ts) :
// un lien ordinaire, qui ne quitte pas la page rendue.
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children?: ReactNode; prefetch?: boolean };

export default function Link({ href, children, prefetch, ...reste }: Props) {
  void prefetch;
  return (
    <a href={href} {...reste} onClick={(evenement) => evenement.preventDefault()}>
      {children}
    </a>
  );
}
