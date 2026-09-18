export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Find Jobs", to: "/jobs" },
  { label: "About", to: "/about" },
  {
    label: "Blog",
    to: "/blog",
    children: [
      { label: "Blog List", to: "/blog" },
      { label: "Blog Post", to: "/blog/internet-job-seekers-crucial-success" },
    ],
  },
  { label: "Contact", to: "/contact" },
];
