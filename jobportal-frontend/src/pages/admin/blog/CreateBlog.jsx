import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { BlogPostForm } from "@/components/forms/BlogPostForm";

export function CreateBlog() {
  const navigate = useNavigate();
  return (
    <div className="max-w-8xl">
      <h1 className="text-xl font-semibold text-text">Write a post</h1>
      <p className="mt-1 text-sm text-accent">
        Published posts appear on the public blog immediately.
      </p>
      <Card className="mt-6">
        <BlogPostForm onSuccess={() => navigate("/admin/blog")} />
      </Card>
    </div>
  );
}
