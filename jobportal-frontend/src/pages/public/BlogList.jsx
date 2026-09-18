import { BlogCard } from "@/components/ui/BlogCard";
import { MOCK_BLOG_POSTS } from "@/lib/mockData";

export function BlogList() {
  return (
    <>
      <section className="border-b border-ink-100 bg-ink-50">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-ink-900 sm:text-5xl">
            From the blog
          </h1>
          <p className="mt-4 text-lg text-ink-500">
            Career advice, hiring tips, and notes from the JobGrids team.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_BLOG_POSTS.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
