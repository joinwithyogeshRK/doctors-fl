"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BookMarked, Clock, Search } from "lucide-react";
import { blogCategories, blogPosts, featuredPost } from "@/data/blog";
import { cx } from "@/lib/format";
import { Card, EmptyState } from "@/components/ui/Surfaces";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";

/** Category-tinted cover art, generated rather than stock photography. */
const covers: Record<string, [string, string]> = {
  "Heart health": ["#ff8a8d", "#e5484d"],
  Nutrition: ["#ffc06b", "#d97a12"],
  "Mental wellness": ["#a98bff", "#7a4dff"],
  Fitness: ["#6dc3f5", "#0b7fd4"],
  "Preventive care": ["#7fa8ff", "#1b63ff"],
  "Women's health": ["#f291cf", "#b23d8c"],
  "Children's health": ["#7fd0b2", "#0a8f66"],
  "Healthy lifestyle": ["#a79cf0", "#4a33cf"],
};

export function BlogBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogPosts.filter((post) => {
      if (category !== "All" && post.category !== category) return false;
      if (!q) return true;
      return [post.title, post.excerpt, post.author, post.category].join(" ").toLowerCase().includes(q);
    });
  }, [query, category]);

  const toggleSave = (slug: string, title: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
        toast("info", "Removed from saved", title);
      } else {
        next.add(slug);
        toast("success", "Saved to read later", title);
      }
      return next;
    });
  };

  return (
    <div>
      {/* Featured */}
      {category === "All" && !query && (
        <Link
          href={`/blog/${featuredPost.slug}`}
          className="group relative mb-10 grid overflow-hidden rounded-panel bg-[linear-gradient(135deg,#132252,#23215f_55%,#3b2064)] text-white lg:grid-cols-[1.2fr_1fr]"
        >
          <span className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full bg-electric/30 blur-3xl" />
          <div className="relative p-7 sm:p-10">
            <span className="inline-flex items-center gap-1.5 rounded-chip bg-white/12 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
              Featured · {featuredPost.category}
            </span>
            <h2 className="mt-5 font-display text-[clamp(1.5rem,3.2vw,2.25rem)] leading-tight font-bold">
              {featuredPost.title}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70">{featuredPost.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-white/55">
              <span className="font-medium text-white/80">{featuredPost.author}</span>
              <span>{featuredPost.date}</span>
              <span className="inline-flex items-center gap-1">
                <Clock size={12} />
                {featuredPost.readingMinutes} min read
              </span>
            </div>
            <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold transition-transform group-hover:translate-x-1">
              Read the article
              <ArrowRight size={16} />
            </span>
          </div>
          <div
            className="relative hidden min-h-56 lg:block"
            style={{
              background: `linear-gradient(150deg, ${covers[featuredPost.category]?.[0] ?? "#7fa8ff"}33, ${covers[featuredPost.category]?.[1] ?? "#1b63ff"}55)`,
            }}
          >
            <span className="absolute inset-0 grid place-items-center">
              <span className="font-display text-[7rem] leading-none font-bold text-white/10">
                {featuredPost.category[0]}
              </span>
            </span>
          </div>
        </Link>
      )}

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles"
            aria-label="Search articles"
            className="h-13 w-full rounded-full border hairline bg-white pr-4 pl-11 text-sm text-ink shadow-soft placeholder:text-ink-faint focus:border-electric focus:outline-none"
          />
        </div>
      </div>

      <div className="no-scrollbar mt-5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {["All", ...blogCategories].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setCategory(option)}
            aria-pressed={category === option}
            className={cx(
              "shrink-0 rounded-chip px-4 py-2.5 text-sm font-semibold transition-colors",
              category === option ? "bg-electric text-white" : "bg-white text-ink-soft shadow-soft hover:bg-ice",
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<Search size={22} />}
            title="No articles match"
            body="Try a different topic, or clear the category filter."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
              >
                Show all articles
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((post) => {
            const [from, to] = covers[post.category] ?? ["#7fa8ff", "#1b63ff"];
            return (
              <Card key={post.id} padded={false} className="group flex h-full flex-col overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift">
                <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden" aria-label={post.title}>
                  <span
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(150deg, ${from}2e, ${to}4d)` }}
                  />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="font-display text-6xl leading-none font-bold" style={{ color: `${to}33` }}>
                      {post.category[0]}
                    </span>
                  </span>
                  <span
                    className="absolute top-3 left-3 rounded-chip px-2.5 py-1 text-[0.6875rem] font-bold text-white"
                    style={{ background: to }}
                  >
                    {post.category}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="line-clamp-2 font-display text-lg leading-snug font-semibold text-ink group-hover:text-electric">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">
                    {post.excerpt}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t hairline pt-4">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-ink">{post.author}</p>
                      <p className="truncate text-[0.6875rem] text-ink-faint">
                        {post.date} · {post.readingMinutes} min
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSave(post.slug, post.title)}
                      aria-label={saved.has(post.slug) ? `Remove ${post.title} from saved` : `Save ${post.title}`}
                      aria-pressed={saved.has(post.slug)}
                      className={cx(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors",
                        saved.has(post.slug) ? "bg-ice text-electric" : "text-ink-faint hover:bg-ice hover:text-electric",
                      )}
                    >
                      <BookMarked size={15} className={saved.has(post.slug) ? "fill-electric/20" : ""} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
