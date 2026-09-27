export const USER_ROLES = {
  SEEKER: "seeker",
  EMPLOYER: "employer",
  ADMIN: "admin",
};

export const JOB_TYPES = [
  "Full time",
  "Part time",
  "Contract",
  "Internship",
  "Remote",
];

export const ALERT_FREQUENCIES = ["Daily", "Weekly", "Monthly"];

export const SOCIAL_PLATFORMS = [
  "LinkedIn",
  "GitHub",
  "Twitter / X",
  "Portfolio",
  "Behance",
  "Dribbble",
  "Other",
];

export const APPLICATION_STATUS = {
  APPLIED: "applied",
  SHORTLISTED: "shortlisted",
  INTERVIEW: "interview",
  REJECTED: "rejected",
  HIRED: "hired",
};

export const APPLICATION_STATUS_OPTIONS = [
  { value: APPLICATION_STATUS.APPLIED, label: "Applied" },
  { value: APPLICATION_STATUS.SHORTLISTED, label: "Shortlisted" },
  { value: APPLICATION_STATUS.INTERVIEW, label: "Interview" },
  { value: APPLICATION_STATUS.REJECTED, label: "Rejected" },
  { value: APPLICATION_STATUS.HIRED, label: "Hired" },
];

export const APPLICATION_STATUS_TONE = {
  [APPLICATION_STATUS.APPLIED]: "neutral",
  [APPLICATION_STATUS.SHORTLISTED]: "brand",
  [APPLICATION_STATUS.INTERVIEW]: "brand",
  [APPLICATION_STATUS.REJECTED]: "danger",
  [APPLICATION_STATUS.HIRED]: "success",
};

export const ROUTES = {
  HOME: "/",
  JOBS: "/jobs",
  JOB_DETAILS: (id = ":id") => `/jobs/${id}`,
  LOGIN: "/login",
  REGISTER: "/register",
  SEEKER_DASHBOARD: "/seeker/dashboard",
  EMPLOYER_DASHBOARD: "/employer/dashboard",
};

// "classic" matches the reference design (centered header, bold colored
// divider) and is the schema default — see the resumes migration.
export const RESUME_TEMPLATES = [
  {
    id: "classic",
    label: "Classic",
    description: "Centered header with a bold colored divider.",
  },
  {
    id: "modern",
    label: "Modern",
    description: "Card layout with an avatar and colored section pills.",
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Understated, with a colored accent bar per section.",
  },
];

export const RESUME_COLORS = [
  { id: "black", label: "Black", hex: "#0f172a" },
  { id: "blue", label: "Blue", hex: "#2042e3" },
  { id: "green", label: "Green", hex: "#059669" },
  { id: "purple", label: "Purple", hex: "#7c3aed" },
  { id: "red", label: "Red", hex: "#b91c1c" },
  { id: "teal", label: "Teal", hex: "#0d9488" },
];
