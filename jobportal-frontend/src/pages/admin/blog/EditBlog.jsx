import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { BlogPostForm } from "@/components/forms/BlogPostForm";
import { NotFound } from "@/pages/public/NotFound";
import { useBlogPost } from "@/hooks/useBlog";

export function EditBlog() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, isError } = useBlogPost(postId);

  if (isLoading) return <Spinner fullSection />;
  if (isError || !post) return <NotFound />;

  return (
    <div className="max-w-8xl">
      <h1 className="text-xl font-semibold text-text">Edit post</h1>
      <p className="mt-1 text-sm text-accent">
        Changes are visible on the public blog as soon as you save.
      </p>
      <Card className="mt-6">
        <BlogPostForm post={post} onSuccess={() => navigate("/admin/blog")} />
      </Card>
    </div>
  );
}
