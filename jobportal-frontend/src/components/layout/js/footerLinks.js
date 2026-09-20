import { USER_ROLES } from "@/utils/constants";

const GUEST_GROUPS = [
  {
    heading: "Candidates",
    links: [
      { label: "Browse jobs", to: "/jobs" },
      { label: "Create profile", to: "/register" },
    ],
  },
  {
    heading: "Employers",
    links: [
      { label: "Post a job", to: "/employer/dashboard" },
      { label: "Manage applications", to: "/employer/dashboard" },
    ],
  },
];

export const LEGAL_LINKS = [
  { label: "Terms of use", to: "#" },
  { label: "Privacy Policy", to: "#" },
  { label: "Faq", to: "#" },
  { label: "Contact", to: "/contact" },
];

const FOOTER_LINK_GROUPS_BY_ROLE = {
  [USER_ROLES.SEEKER]: [
    {
      heading: "Candidates",
      links: [
        { label: "Browse jobs", to: "/seeker/browse-jobs" },
        { label: "My dashboard", to: "/seeker/dashboard" },
        { label: "My resume", to: "/seeker/resume" },
      ],
    },
  ],
  [USER_ROLES.EMPLOYER]: [
    {
      heading: "Employers",
      links: [
        { label: "Post a job", to: "/employer/jobs/new" },
        { label: "Manage jobs", to: "/employer/jobs" },
        { label: "My dashboard", to: "/employer/dashboard" },
      ],
    },
  ],
  [USER_ROLES.ADMIN]: [
    {
      heading: "Admin",
      links: [{ label: "Dashboard", to: "/admin/dashboard" }],
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