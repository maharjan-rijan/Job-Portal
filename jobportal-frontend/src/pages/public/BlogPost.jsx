import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { BlogCard } from "@/components/ui/BlogCard";
import { Spinner } from "@/components/ui/Spinner";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlog";
import { formatDate } from "@/utils/formatters";
import { NotFound } from "@/pages/public/NotFound";

export function BlogPost() {
  const { postId } = useParams();
  const { data: post, isLoading, isError } = useBlogPost(postId);

  // Only needed once the post itself has loaded, so this stays disabled
  // until then rather than firing an extra request up front.
  const { data: allPosts = [] } = useBlogPosts(undefined, { enabled: Boolean(post) });
  const related = allPosts.filter((item) => item.id !== postId).slice(0, 2);

  if (isLoading) return <Spinner fullSection />;

  if (isError || !post) return <NotFound />;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        to="/blog"
        className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blog
      </Link>

      <Badge tone="brand" className="mt-6 w-fit">
        {post.category}
      </Badge>
      <h1 className="mt-3 text-3xl font-bold text-text sm:text-4xl">
        {post.title}
      </h1>
      <div className="mt-4 flex items-center gap-4 text-sm text-accent">
        <span className="flex items-center gap-1.5">
          <User className="h-4 w-4" />
          {post.author}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4" />
          {formatDate(post.publishedAt)}
        </span>
      </div>

      <div className="mt-8 flex flex-col gap-4 text-[15px] text-primary">
        {post.content.split("\n\n").map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {related.length > 0 && (
        <div className="mt-16 border-t border-primary/10 pt-10">
          <h2 className="text-lg font-semibold text-text">
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