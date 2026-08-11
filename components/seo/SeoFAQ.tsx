import type { FAQItem } from "@/lib/seo/types";

export function SeoFAQ({ faqs }: { faqs: FAQItem[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <details
          key={i}
          className="group overflow-hidden rounded-lg border border-line-subtle bg-surface transition-colors duration-fast hover:border-line"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 [&::-webkit-details-marker]:hidden">
            <h3 className="font-heading text-h4 font-semibold text-foreground">
              {faq.question}
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </summary>
          <div className="border-t border-line-subtle px-6 pb-6 pt-4">
            <p className="text-ui leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
