/**
 * Central query-key factory. Keeping keys in one place avoids typos and
 * makes cache invalidation predictable (e.g. queryClient.invalidateQueries
 * ({ queryKey: queryKeys.jobs.all })).
 */
export const queryKeys = {
  jobs: {
    all: ["jobs"],
    list: (filters) => ["jobs", "list", filters ?? {}],
    detail: (id) => ["jobs", "detail", id],
  },
  categories: {
    all: ["categories"],
  },
  applications: {
    all: ["applications"],
    list: (filters) => ["applications", "list", filters ?? {}],
  },
  resumes: {
    all: ["resumes"],
    detail: (id) => ["resumes", "detail", id],
  },
  auth: {
    me: ["auth", "me"],
  },
};
