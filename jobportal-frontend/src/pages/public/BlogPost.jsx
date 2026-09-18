import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { BlogCard } from "@/components/ui/BlogCard";
import { MOCK_BLOG_POSTS } from "@/lib/mockData";
import { formatDate } from "@/utils/formatters";
import { NotFound } from "@/pages/public/NotFound";

export function BlogPost() {
  const { postId } = useParams();
  const post = MOCK_BLOG_POSTS.find((item) => item.id === postId);

  if (!post) return <NotFound />;

  const related = MOCK_BLOG_POSTS.filter((item) => item.id !== post.id).slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        to="/blog-list"
        className="flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blog
      </Link>

      <Badge tone="brand" className="mt-6 w-fit">
        {post.category}
      </Badge>
      <h1 className="mt-3 text-3xl font-bold text-ink-900 sm:text-4xl">
        {post.title}
      </h1>
      <div className="mt-4 flex items-center gap-4 text-sm text-ink-400">
        <span className="flex items-center gap-1.5">
          <User className="h-4 w-4" />
          {post.author}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4" />
          {formatDate(post.publishedAt)}
        </span>
      </div>

      <div className="mt-8 flex flex-col gap-4 text-[15px] text-ink-700">
        {post.content.split("\n\n").map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {related.length > 0 && (
        <div className="mt-16 border-t border-ink-100 pt-10">
          <h2 className="text-lg font-semibold text-ink-900">
            More from the blog
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {related.map((item) => (
              <BlogCard key={item.id} post={item} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
