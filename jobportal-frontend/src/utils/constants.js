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
