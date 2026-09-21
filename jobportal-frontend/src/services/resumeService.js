import api from "@/lib/axios";

function normalizeEducationEntry(entry) {
  return {
    degree: entry.degree ?? "",
    fieldOfStudy: entry.field_of_study ?? entry.fieldOfStudy ?? "",
    school: entry.school ?? "",
    from: entry.from ?? "",
    to: entry.to ?? "",
    description: entry.description ?? "",
  };
}

function normalizeExperienceEntry(entry) {
  return {
    companyName: entry.company_name ?? entry.companyName ?? "",
    jobTitle: entry.job_title ?? entry.jobTitle ?? "",
    from: entry.from ?? "",
    to: entry.to ?? "",
    description: entry.description ?? "",
  };
}

function normalizeSocialLinkEntry(entry) {
  return { platform: entry.platform ?? "", url: entry.url ?? "" };
}

function normalizeAchievementEntry(entry) {
  return {
    title: entry.title ?? "",
    issuer: entry.issuer ?? "",
    date: entry.date ?? "",
    description: entry.description ?? "",
  };
}

function normalizeResume(resume) {
  if (!resume) return null;
  return {
    id: resume.id != null ? String(resume.id) : undefined,
    name: resume.name,
    email: resume.email,
    title: resume.title,
    location: resume.location,
    website: resume.website ?? "",
    expectedSalary: resume.expected_salary ?? resume.expectedSalary ?? "",
    education: (resume.education ?? []).map(normalizeEducationEntry),
    experience: (resume.experience ?? []).map(normalizeExperienceEntry),
    socialLinks: (resume.social_links ?? resume.socialLinks ?? []).map(normalizeSocialLinkEntry),
    achievements: (resume.achievements ?? []).map(normalizeAchievementEntry),
    updatedAt: resume.updated_at ?? resume.updatedAt ?? null,
  };
}

export const resumeService = {
  // A seeker who hasn't built a resume yet gets a 404 — that's an
  // expected, normal state here, not an error, so it resolves to null
  // rather than rejecting.
  getMine: () =>
    api
      .get("/resumes/me")
      .then((r) => normalizeResume(r.data))
      .catch((error) => {
        if (error.status === 404) return null;
        throw error;
      }),

  save: (payload) => api.put("/resumes/me", payload).then((r) => normalizeResume(r.data)),

  // Employer-only: browse candidate resumes.
  list: (params) =>
    api.get("/resumes", { params }).then((r) => {
      const raw = Array.isArray(r.data) ? r.data : r.data.data ?? [];
      return raw.map(normalizeResume);
    }),

  getById: (id) => api.get(`/resumes/${id}`).then((r) => normalizeResume(r.data)),
};
