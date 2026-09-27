export const queryKeys = {
  jobs: {
    all: ["jobs"],
    list: (filters) => ["jobs", "list", filters ?? {}],
    detail: (id) => ["jobs", "detail", id],
    mine: ["jobs", "mine"],
  },
  categories: {
    all: ["categories"],
  },
  applications: {
    all: ["applications"],
    list: (filters) => ["applications", "list", filters ?? {}],
    mine: ["applications", "mine"],
  },
  savedJobs: {
    all: ["savedJobs"],
  },
  resumes: {
    all: ["resumes"],
    list: (filters) => ["resumes", "list", filters ?? {}],
    detail: (id) => ["resumes", "detail", id],
    mine: ["resumes", "mine"],
  },
  blog: {
    all: ["blog"],
    list: (filters) => ["blog", "list", filters ?? {}],
    detail: (id) => ["blog", "detail", id],
  },

  admin: {
    dashboard: ["admin", "dashboard"],
  },
  auth: {
    me: ["auth", "me"],
  },
};
