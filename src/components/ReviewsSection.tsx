"use client";

import { useState } from "react";
import { Star, Check, Loader2 } from "lucide-react";
import type { Review } from "@/lib/types";
import { Rating } from "@/components/Rating";
import { cn } from "@/lib/utils";

const AVATAR = [
  "bg-gold-200 text-date-800",
  "bg-date-200 text-date-900",
  "bg-emerald-100 text-emerald-800",
  "bg-rose-100 text-rose-800",
  "bg-sky-100 text-sky-800",
];

function avatarClass(name: string) {
  return AVATAR[(name.charCodeAt(0) || 0) % AVATAR.length];
}

function reviewDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ReviewsSection({
  productId,
  initialReviews,
  initialRating,
  initialCount,
}: {
  productId: number;
  initialReviews: Review[];
  initialRating: number;
  initialCount: number;
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(initialRating);
  const [count, setCount] = useState(initialCount);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    author: "",
    location: "",
    title: "",
    comment: "",
    rating: 5,
  });

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const maxCount = Math.max(1, ...distribution.map((d) => d.count));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          author: form.author,
          location: form.location,
          title: form.title,
          comment: form.comment,
          rating: form.rating,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setReviews((prev) => [data.review, ...prev]);
      setRating(data.product.rating);
      setCount(data.product.reviewCount);
      setForm({ author: "", location: "", title: "", comment: "", rating: 5 });
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      {/* Summary + form */}
      <div className="lg:col-span-4">
        <div className="rounded-3xl border border-date-900/10 bg-white p-7">
          <div className="flex items-end gap-4">
            <span className="font-display text-6xl font-semibold leading-none text-date-900">
              {rating.toFixed(1)}
            </span>
            <div className="pb-1">
              <Rating value={rating} size={18} />
              <p className="mt-1 text-sm text-date-500">{count} verified reviews</p>
            </div>
          </div>

          <div className="mt-6 space-y-2.5">
            {distribution.map((d) => (
              <div key={d.star} className="flex items-center gap-3 text-sm">
                <span className="flex w-8 items-center gap-1 text-date-600">
                  {d.star} <Star size={12} className="fill-gold-500 text-gold-500" />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-date-900/8">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600"
                    style={{ width: `${(d.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-date-400">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 rounded-3xl border border-date-900/10 bg-white p-7">
          <h4 className="font-display text-lg font-semibold text-date-900">Write a review</h4>
          <p className="mt-1 text-xs text-date-500">Share your experience with this harvest.</p>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-date-500">Your rating</label>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setForm((f) => ({ ...f, rating: n }))}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  className="p-0.5"
                >
                  <Star
                    size={22}
                    className={cn(
                      "transition-colors",
                      (hover || form.rating) >= n
                        ? "fill-gold-500 text-gold-500"
                        : "text-date-900/20"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-date-500">Name *</label>
              <input
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                required
                placeholder="Rohit M."
                className="mt-1.5 w-full rounded-xl border border-date-900/12 bg-cream-50 px-3.5 py-2.5 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-date-500">City</label>
              <input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Mumbai"
                className="mt-1.5 w-full rounded-xl border border-date-900/12 bg-cream-50 px-3.5 py-2.5 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              />
            </div>
          </div>

          <div className="mt-3">
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Headline (optional)"
              className="w-full rounded-xl border border-date-900/12 bg-cream-50 px-3.5 py-2.5 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
            />
          </div>

          <div className="mt-3">
            <textarea
              value={form.comment}
              onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
              required
              rows={4}
              placeholder="What did you think of the quality, texture and taste? (min. 10 characters)"
              className="w-full resize-none rounded-xl border border-date-900/12 bg-cream-50 px-3.5 py-2.5 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
            />
          </div>

          {status === "error" && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}
          {status === "done" && (
            <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <Check size={16} /> Thank you! Your review is live.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-date-900 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-date-800 disabled:opacity-60"
          >
            {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
            Submit review
          </button>
        </form>
      </div>

      {/* Review list */}
      <div className="lg:col-span-8">
        <h3 className="font-display text-xl font-semibold text-date-900">
          What importers are saying
        </h3>
        <ul className="mt-5 space-y-5">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="rounded-3xl border border-date-900/10 bg-white p-6 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full font-display text-base font-semibold",
                    avatarClass(r.author)
                  )}
                >
                  {r.author.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="font-semibold text-date-900">{r.author}</p>
                  <p className="text-xs text-date-500">
                    {r.location ? `${r.location} · ` : ""}
                    {reviewDate(r.createdAt)}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Rating value={r.rating} />
                  <span className="text-sm font-medium text-date-600">{r.rating}.0</span>
                </div>
              </div>
              {r.title && (
                <p className="mt-4 font-display text-base font-semibold text-date-900">{r.title}</p>
              )}
              <p className="mt-1.5 text-sm leading-relaxed text-date-600">{r.comment}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
