"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "./faq-data";

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {FAQ_ITEMS.map((item, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-white/5 bg-card transition-colors hover:border-white/10"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            aria-expanded={open === i}
          >
            <span className="text-sm font-medium text-foreground">{item.q}</span>
            <ChevronDown
              className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Animation accordéon via grid-rows */}
          <div
            className={`grid transition-[grid-template-rows] duration-200 ease-out ${
              open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="border-t border-white/5 px-5 py-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
