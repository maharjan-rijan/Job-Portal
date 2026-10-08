import { useState } from "react";
import { Link } from "react-router-dom";
import { Newspaper, Pencil, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { QueryState } from "@/components/ui/QueryState";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useBlogPosts, useDeleteBlogPost } from "@/hooks/useBlog";
import { Pagination } from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { formatDate } from "@/utils/formatters";

export function Blog() {
  const [search, setSearch] = useState("");

  // BlogList.jsx (the public page) uses the same "q" param name — keep
  // this one in sync with it so a single backend filter covers both.
  const filters = { q: search || undefined };
  const { data: posts = [], isLoading, isError, error } = useBlogPosts(filters);
  const { mutate: deletePost, isPending: isDeleting } = useDeleteBlogPost();

  const {
    pageItems: pagedPosts,
    page,
    setPage,
    totalPages,
    from,
    to,
    totalItems,
  } = usePagination(posts, { pageSize: 10, resetKey: search });

  const handleDelete = (post) => {
    if (!window.confirm(`Delete "${post.title}"? This can't be undone.`))
      return;

    deletePost(post.id, {
      onSuccess: () => toast.success("Post deleted"),
      onError: (err) =>
        toast.error(err.message ?? "Could not delete this post"),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-text">Manage blog</h1>
          <p className="mt-1 text-sm text-accent">
            {isLoading
              ? "Loading…"
              : `${posts.length} post${posts.length === 1 ? "" : "s"} published`}
          </p>
        </div>
        <PrimaryButton as={Link} to="/admin/blog/new" className="w-fit gap-2">
          <Plus className="h-4 w-4" />
          Write a post
        </PrimaryButton>
      </div>

      <div className="mt-6">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by title, category or author"
        />
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        errorLabel="Could not load blog posts"
      >
        <Card className="mt-6 overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-primary/10 text-xs uppercase text-accent">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">
                  Title
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Category
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Author
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Published
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {pagedPosts.map((post) => (
                <tr
                  key={post.id}
                  className="transition-colors hover:bg-primary/5"
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <p className="font-medium text-text">{post.title}</p>
                    <p className="max-w-xs truncate text-xs text-accent">
                      {post.excerpt}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <Badge tone="neutral">{post.category}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-accent">
                    {post.author}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-accent">
                    {post.publishedAt ? formatDate(post.publishedAt) : "—"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        to={`/admin/blog/${post.id}/edit`}
                        className="text-accent hover:text-primary"
                        aria-label={`Edit ${post.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post)}
                        disabled={isDeleting}
                        className="text-accent hover:text-red-600 disabled:opacity-50"
                        aria-label={`Delete ${post.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {posts.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-5 py-14 text-center text-sm text-accent">
              <Newspaper className="h-6 w-6" />
              No posts match your search.
            </div>
          )}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            from={from}
            to={to}
            totalItems={totalItems}
          />
        </Card>
      </QueryState>
    </div>
  );
}
