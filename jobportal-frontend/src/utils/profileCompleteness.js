/** Employer: based on the fields EmployerProfileForm collects. */
export function getEmployerProfileCompleteness(user) {
  const company = user?.company ?? {};
  const fields = [
    user?.name,
    company.name,
    company.website,
    company.industry,
    company.location,
    company.description,
    company.logo_url,
  ];
  const filled = fields.filter((value) =>
    Boolean(value && String(value).trim()),
  ).length;
  return Math.round((filled / fields.length) * 100);
}

/** Seeker: based on the fields the resume builder collects. */
export function getSeekerProfileCompleteness(resume) {
  if (!resume) return 0;

  const scalarFields = [
    resume.title,
    resume.location,
    resume.website,
    resume.expectedSalary,
  ];
  const listFields = [
    resume.education,
    resume.experience,
    resume.socialLinks,
    resume.achievements,
  ];

  const filledScalars = scalarFields.filter((value) =>
    Boolean(value && String(value).trim()),
  ).length;
  const filledLists = listFields.filter(
    (list) => Array.isArray(list) && list.length > 0,
  ).length;

  const total = scalarFields.length + listFields.length;
  return Math.round(((filledScalars + filledLists) / total) * 100);
}
