import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Clock } from "lucide-react";
import { blogPosts, postBySlug } from "@/data/blog";
import { Breadcrumbs, Card, Skeleton } from "@/components/ui/Surfaces";
import { ButtonLink } from "@/components/ui/Button";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug[slug];
  if (!post) return { title: "Article" };
  return { title: post.title, description: post.excerpt };
}

async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postBySlug[slug];
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2);
  const more = blogPosts.filter((p) => p.slug !== post.slug && p.category !== post.category).slice(0, 3 - related.length);

  return (
    <>
      <Breadcrumbs
        trail={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.category },
        ]}
      />

      <article className="mx-auto mt-8 max-w-2xl">
        <p className="text-sm font-semibold text-electric">{post.category}</p>
        <h1 className="mt-3 font-display text-[clamp(1.875rem,4.5vw,2.75rem)] leading-[1.1] font-bold text-ink">
          {post.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">{post.excerpt}</p>

        <div className="mt-7 flex flex-wrap items-center gap-4 border-y hairline py-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[linear-gradient(140deg,var(--color-electric),var(--color-violet))] text-xs font-bold text-white">
            {post.author.replace("Dr. ", "").split(" ").map((p) => p[0]).join("")}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">{post.author}</p>
            <p className="text-xs text-ink-faint">{post.authorRole}</p>
          </div>
          <span className="ml-auto flex items-center gap-4 text-xs text-ink-faint">
            <span>{post.date}</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} />
              {post.readingMinutes} min read
            </span>
          </span>
        </div>

        <div className="mt-8 space-y-5">
          {post.body.map((paragraph, i) => (
            <p key={i} className="text-[1.0625rem] leading-[1.75] text-ink-soft">
              {paragraph}
            </p>
          ))}
        </div>

        <p className="mt-10 rounded-card bg-mist px-5 py-4 text-xs leading-relaxed text-ink-soft">
          This article is general information written for a product demonstration. It is not
          medical advice and is not a substitute for a consultation with a qualified healthcare
          professional who knows your history.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/appointments/book">Book a consultation</ButtonLink>
          <ButtonLink href="/blog" variant="secondary">
            <ArrowLeft size={16} />
            All articles
          </ButtonLink>
        </div>
      </article>

      <section className="mx-auto mt-14 max-w-4xl">
        <h2 className="font-display text-xl font-bold text-ink">Related reading</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[...related, ...more].map((item) => (
            <Card key={item.id} className="h-full">
              <p className="text-xs font-semibold text-electric">{item.category}</p>
              <Link href={`/blog/${item.slug}`} className="mt-2 block">
                <h3 className="line-clamp-3 font-semibold text-ink hover:text-electric">{item.title}</h3>
              </Link>
              <p className="mt-3 text-xs text-ink-faint">
                {item.author} · {item.readingMinutes} min
              </p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <div className="pt-18">
      <div className="shell py-8 lg:py-12">
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-panel" />}>
          <Article params={params} />
        </Suspense>
      </div>
    </div>
  );
}
