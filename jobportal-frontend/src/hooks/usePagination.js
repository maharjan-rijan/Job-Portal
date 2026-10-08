import { useState, useEffect } from "react";

export function usePagination(items = [], { pageSize = 10, resetKey } = {}) {
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return {
    page: safePage,
    setPage,
    pageSize,
    totalItems,
    totalPages,
    pageItems,
    from: totalItems === 0 ? 0 : start + 1,
    to: Math.min(start + pageSize, totalItems),
  };
}
