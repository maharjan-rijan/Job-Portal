import { useEffect, useState } from "react";
import { BlogCard } from "@/components/ui/BlogCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { QueryState } from "@/components/ui/QueryState";
import { useBlogPosts, useBlogCategories } from "@/hooks/useBlog";

export function BlogList() {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedKeyword(keyword), 400);
    return () => clearTimeout(timeout);
  }, [keyword]);

  const { data: categories = [] } = useBlogCategories();
  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useBlogPosts({ q: debouncedKeyword || undefined, category: category || undefined });

  return (
    <>
      <section className="border-b border-primary/10 bg-background">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-text sm:text-5xl">
            From the blog
          </h1>
          <p className="mt-4 text-lg text-accent">
            Career advice, hiring tips, and notes from the JobSansar team.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            value={keyword}
            onChange={setKeyword}
            placeholder="Search articles"
            className="max-w-sm flex-1"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("")}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                category === "" ? "bg-secondary text-white" : "bg-background text-accent hover:text-text"
              }`}
            >
              All
            </button>
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  category === item ? "bg-secondary text-white" : "bg-background text-accent hover:text-text"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <QueryState isLoading={isLoading} isError={isError} error={error} errorLabel="Could not load articles">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
              {posts.length === 0 && (
                <p className="col-span-full py-12 text-center text-sm text-accent">
                  No articles match your search.
                </p>
              )}
            </div>
          </QueryState>
        </div>
      </section>
    </>
  );
}