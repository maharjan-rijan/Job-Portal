import { useEffect, useState } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { ResumeCard } from "@/components/ui/ResumeCard";
import { QueryState } from "@/components/ui/QueryState";
import { useResumes } from "@/hooks/useResume";

export function BrowseResumes() {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedKeyword(keyword), 400);
    return () => clearTimeout(timeout);
  }, [keyword]);

  const {
    data: resumes = [],
    isLoading,
    isError,
    error,
  } = useResumes(debouncedKeyword ? { q: debouncedKeyword } : undefined);

  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold text-text">Browse resumes</h1>
        <p className="mt-1 text-sm text-accent">
          {isLoading
            ? "Loading…"
            : `${resumes.length} candidate${resumes.length === 1 ? "" : "s"}`}
        </p>
      </div>

      <SearchBar
        value={keyword}
        onChange={setKeyword}
        placeholder="Search by title, skill, or location"
        className="mt-4 max-w-md"
      />

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        errorLabel="Could not load resumes"
      >
        <div className="mt-6 flex flex-col gap-4">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
          {resumes.length === 0 && (
            <p className="py-12 text-center text-sm text-accent">
              No candidates match "{keyword}".
            </p>
          )}
        </div>
      </QueryState>
    </div>
  );
}
