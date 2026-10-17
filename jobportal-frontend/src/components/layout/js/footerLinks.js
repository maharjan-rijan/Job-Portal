import { USER_ROLES } from "@/utils/constants";

const GUEST_GROUPS = [
  {
    heading: "For Candidates",
    links: [
      { label: "Browse Jobs", to: "/jobs" },
      { label: "Create an Account", to: "/register" },
      { label: "Job Alerts", to: "/login" },
    ],
  },
  {
    heading: "For Employers",
    links: [
      { label: "Post a Job", to: "/register" },
      { label: "Browse Resumes", to: "/login" },
      { label: "Manage Applications", to: "/login" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", to: "/about" },
      { label: "Blog", to: "/blog" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

export const LEGAL_LINKS = [
  { label: "Terms of use", to: "#" },
  { label: "Privacy policy", to: "#" },
  { label: "FAQ", to: "#" },
];

export const SOCIAL_LINKS = [
  { label: "Facebook", icon: "facebook", href: "#" },
  { label: "X (Twitter)", icon: "twitter", href: "#" },
  { label: "LinkedIn", icon: "linkedin", href: "#" },
  { label: "Instagram", icon: "instagram", href: "#" },
];

const FOOTER_LINK_GROUPS_BY_ROLE = {
  [USER_ROLES.SEEKER]: [
    {
      heading: "For Candidates",
      links: [
        { label: "Browse Jobs", to: "/seeker/browse-jobs" },
        { label: "My Dashboard", to: "/seeker/dashboard" },
        { label: "My Resume", to: "/seeker/resume" },
        { label: "Saved Jobs", to: "/seeker/saved-jobs" },
        { label: "Job Alerts", to: "/seeker/job-alerts" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About us", to: "/about" },
        { label: "Blog", to: "/blog" },
        { label: "Contact", to: "/contact" },
      ],
    },
  ],
  [USER_ROLES.EMPLOYER]: [
    {
      heading: "For Employers",
      links: [
        { label: "Post a Job", to: "/employer/jobs/new" },
        { label: "Manage Jobs", to: "/employer/jobs" },
        { label: "Applications", to: "/employer/applications" },
        { label: "Browse Resumes", to: "/employer/resumes" },
        { label: "My Dashboard", to: "/employer/dashboard" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About us", to: "/about" },
        { label: "Blog", to: "/blog" },
        { label: "Contact", to: "/contact" },
      ],
    },
  ],
  [USER_ROLES.ADMIN]: [
    {
      heading: "Admin",
      links: [
        { label: "Dashboard", to: "/admin/dashboard" },
        { label: "Users", to: "/admin/users" },
        { label: "Jobs", to: "/admin/jobs" },
        { label: "Blog", to: "/admin/blog" },
        { label: "Reports", to: "/admin/reports" },
      ],
    },
  ],
};

/**
 * Returns the footer link groups for the given role.
 * Falls back to the guest groups when role is undefined/null (logged-out
 * visitor) or doesn't match a known USER_ROLES value.
 */
export function getFooterLinkGroups(role) {
  return FOOTER_LINK_GROUPS_BY_ROLE[role] ?? GUEST_GROUPS;
}

// Kept for any other existing imports of the flat guest list.
export const FOOTER_LINK_GROUPS = GUEST_GROUPS;
