import { Link } from "react-router-dom";
import { CalendarDays, User } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/utils/formatters";

export function BlogCard({ post }) {
  return (
    <Card className="flex h-full flex-col">
      <Badge tone="brand" className="w-fit">
        {post.category}
      </Badge>
      <h3 className="mt-3 text-lg font-semibold text-text">
        <Link to={`/blog/${post.id}`} className="hover:text-secondary">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-accent">{post.excerpt}</p>
      <div className="mt-4 flex items-center gap-4 border-t border-primary/10 pt-4 text-xs text-accent">
        <span className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          {post.author}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(post.publishedAt)}
        </span>
      </div>
    </Card>
  );
}
