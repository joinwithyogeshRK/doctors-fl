import type { Metadata } from "next";
import { BlogBrowser } from "@/components/blog/BlogBrowser";
import { Breadcrumbs, PageHeader } from "@/components/ui/Surfaces";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Health blog",
  description: "Practical guidance from Meridian Health consultants on heart health, nutrition, mental wellness and preventive care.",
};

export default function BlogPage() {
  return (
    <div className="pt-18">
      <section className="border-b hairline bg-[linear-gradient(180deg,var(--color-ice),var(--color-mist))]">
        <div className="shell py-10 lg:py-14">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Health blog" }]} />
          <div className="mt-6">
            <PageHeader
              eyebrow={`${blogPosts.length} articles`}
              title="Health notes from our consultants"
              lede="Plain-language guidance written by the doctors who see these questions every week."
            />
          </div>
        </div>
      </section>

      <section className="shell py-10 lg:py-14">
        <BlogBrowser />
      </section>
    </div>
  );
}
