"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
  }

  return (
    <div className="mx-auto max-w-xl text-center">
      <h3 className="font-display text-2xl font-semibold text-cream-50 sm:text-3xl">
        Fresh harvests, before they land
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream-100/70">
        Join the importers' list for early access to new-season stock, bulk pricing and
        tasting notes — straight from the grove.
      </p>

      {done ? (
        <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-5 py-3.5 text-sm font-medium text-gold-300">
          <Check size={16} /> You're on the list — shukran!
        </div>
      ) : (
        <form
          onSubmit={submit}
          className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-full border border-cream-50/15 bg-cream-50/5 p-1.5 backdrop-blur"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full bg-transparent px-4 py-2.5 text-sm text-cream-50 placeholder:text-cream-100/40 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-date-950 transition-colors hover:bg-gold-400"
          >
            Subscribe <ArrowRight size={15} />
          </button>
        </form>
      )}
    </div>
  );
}
