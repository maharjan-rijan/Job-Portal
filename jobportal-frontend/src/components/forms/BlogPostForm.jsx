import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { TextInput } from "@/components/ui/TextInput";
import { TextArea } from "@/components/ui/TextArea";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useSaveBlogPost } from "@/hooks/useBlog";
import { blogSchema } from "@/lib/validation/blogSchema";
import { useAuth } from "@/hooks/useAuth";

export function BlogPostForm({ post, onSuccess }) {
  const { user } = useAuth();
  const isEditing = Boolean(post?.id);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: post?.title ?? "",
      category: post?.category ?? "",
      author: post?.author ?? user?.name ?? "",
      excerpt: post?.excerpt ?? "",
      content: post?.content ?? "",
    },
  });

  const { mutate, isPending } = useSaveBlogPost();

  const onSubmit = (values) => {
    mutate(
      { id: post?.id, payload: values },
      {
        onSuccess: (saved) => {
          toast.success(isEditing ? "Post updated" : "Post published");
          onSuccess?.(saved);
        },
        onError: (error) => {
          toast.error(error.message ?? "Could not save this post");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Title"
          placeholder="e.g. Five tips for your next interview"
          error={errors.title?.message}
          {...register("title")}
        />
        <TextInput
          label="Category"
          placeholder="e.g. Career Advice"
          error={errors.category?.message}
          {...register("category")}
        />
      </div>

      <TextInput
        label="Author"
        placeholder="e.g. Maya Chen"
        error={errors.author?.message}
        {...register("author")}
      />

      <TextArea
        label="Excerpt"
        rows={3}
        placeholder="A short summary shown on the blog list page"
        error={errors.excerpt?.message}
        {...register("excerpt")}
      />

      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <RichTextEditor
            label="Content"
            placeholder="Write the post…"
            error={errors.content?.message}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <PrimaryButton
        type="submit"
        isLoading={isSubmitting || isPending}
        className="mt-2 w-fit"
      >
        {isEditing ? "Save Changes" : "Publish Post"}
      </PrimaryButton>
    </form>
  );
}
