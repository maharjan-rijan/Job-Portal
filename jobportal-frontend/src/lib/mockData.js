export const MOCK_JOBS = [
  {
    id: "1",
    title: "Software Engineer",
    company: "Winbrans",
    companyWebsite: "winbrans.com",
    location: "New York, USA",
    type: "Full time",
    salaryMin: 20000,
    salaryMax: 25000,
    postedAt: "2026-09-10",
    description:
      "Build and ship features across our core product, working closely with design and product.",
    responsibilities: [
      "Own features end-to-end, from design review through deployment",
      "Write clean, tested, maintainable code across the stack",
      "Participate in code review and architecture discussions",
      "Collaborate closely with product and design on scope and tradeoffs",
    ],
    requirements: [
      "3+ years of professional software engineering experience",
      "Comfortable with React, Node.js, and relational databases",
      "Experience working in an Agile/Scrum process",
      "Strong written communication for async collaboration",
    ],
    benefits: [
      "Medical, dental, and vision insurance",
      "401(k) with company match",
      "Flexible / remote-friendly work policy",
      "Annual learning & development stipend",
    ],
    vacancies: 2,
    experienceLevel: "3–5 years",
    applicationDeadline: "2026-10-15",
  },
  {
    id: "2",
    title: "Graphic Designer",
    company: "DesignHub",
    companyWebsite: "designhub.com",
    location: "Washington, USA",
    type: "Internship",
    salaryMin: 18000,
    salaryMax: 22000,
    postedAt: "2026-09-08",
    description:
      "Support the brand and marketing team with visual assets across web and print.",
    responsibilities: [
      "Design assets for web, email, and social campaigns",
      "Maintain consistency with brand guidelines",
      "Iterate quickly on feedback from marketing stakeholders",
    ],
    requirements: [
      "Demonstrable design skills with a strong portfolio",
      "Proficiency in Figma and Adobe Creative Suite",
      "Familiarity with basic HTML/CSS a plus",
    ],
    benefits: [
      "Mentorship from senior designers",
      "Flexible hours",
      "Potential for full-time offer at end of internship",
    ],
    vacancies: 1,
    experienceLevel: "0–1 year",
    applicationDeadline: "2026-10-01",
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: "UD Design",
    companyWebsite: "uddesign.com",
    location: "Cupertino, USA",
    type: "Part time",
    salaryMin: 24000,
    salaryMax: 30000,
    postedAt: "2026-09-05",
    description:
      "Own end-to-end design for our seeker-facing product, from research to prototypes.",
    responsibilities: [
      "Run lightweight user research and synthesize findings",
      "Produce wireframes, prototypes, and high-fidelity UI",
      "Partner with engineering on feasible, polished implementation",
    ],
    requirements: [
      "2+ years of product design experience",
      "Strong portfolio showing end-to-end process",
      "Comfortable presenting and defending design decisions",
    ],
    benefits: [
      "Flexible part-time schedule",
      "Remote-first",
      "Design tools and hardware stipend",
    ],
    vacancies: 1,
    experienceLevel: "2–3 years",
    applicationDeadline: "2026-09-30",
  },
  {
    id: "4",
    title: "Web Developer",
    company: "Webinner",
    companyWebsite: "webinner.com",
    location: "Delaware, USA",
    type: "Internship",
    salaryMin: 15000,
    salaryMax: 19000,
    postedAt: "2026-09-01",
    description:
      "Help maintain and extend our marketing site and internal tooling.",
    responsibilities: [
      "Build and update pages on the marketing site",
      "Fix bugs and small enhancements in internal tools",
      "Write basic tests for new functionality",
    ],
    requirements: [
      "Familiarity with HTML, CSS, and JavaScript",
      "Currently pursuing or recently completed a CS-related degree",
      "Eagerness to learn a modern frontend stack",
    ],
    benefits: [
      "Hands-on mentorship",
      "Flexible remote schedule",
      "Letter of recommendation on successful completion",
    ],
    vacancies: 3,
    experienceLevel: "0–1 year",
    applicationDeadline: "2026-09-25",
  },
];

export const MOCK_JOB_ALERTS = [
  { id: "1", name: "Web Designer", keywords: "Web Designer", type: "Full time", frequency: "Daily" },
  { id: "2", name: "UI/UX Designer", keywords: "UI/UX Designer", type: "Full time", frequency: "Daily" },
  { id: "3", name: "Developer", keywords: "Developer", type: "Part time", frequency: "Weekly" },
];

export const MOCK_BLOG_POSTS = [
  {
    id: "internet-job-seekers-crucial-success",
    title: "The internet is a job seeker's most crucial success tool",
    category: "Career Advice",
    author: "Maya Chen",
    publishedAt: "2026-08-28",
    excerpt:
      "Online applications outnumber in-person ones ten to one. Here's how to make your digital footprint work in your favor instead of against you.",
    content: `Job hunting has moved almost entirely online, and that changes the rules of the game. Recruiters search for candidates before candidates ever apply, which means your public profile is doing work whether you're actively looking or not.

Start by auditing what a hiring manager sees in the first ten seconds: your headline, your most recent role, and a handful of keywords tied to the job you want. Vague titles like "professional" or "hard worker" waste that space; specific, searchable skills don't.

Consistency matters more than polish. A resume, a LinkedIn profile, and a portfolio that all tell the same story build more trust than any single, perfectly worded page.`,
  },
  {
    id: "connecting-with-potential-employers",
    title: "Today, from connecting with potential employers",
    category: "Networking",
    author: "Daniel Osei",
    publishedAt: "2026-08-20",
    excerpt:
      "Cold outreach has a bad reputation, but a short, specific message still outperforms a hundred anonymous applications.",
    content: `Most candidates apply and wait. The ones who get interviews follow up — briefly, specifically, and without apologizing for reaching out.

A good message names the role, references something real about the team or the product, and asks for one small thing: a fifteen-minute call, a referral, or simply confirmation the application was received. That's it. No essay, no attached resume in the first message.

If you only have time to improve one part of your job search, make it this: turn ten silent applications into three warm conversations.`,
  },
  {
    id: "weeded-through-hundreds-of-job-hunting-tips",
    title: "We've weeded through hundreds of job-hunting tips",
    category: "Career Advice",
    author: "Priya Nair",
    publishedAt: "2026-08-12",
    excerpt:
      "Most job-search advice is recycled or outdated. These are the handful of tactics that actually move the needle in 2026.",
    content: `There's no shortage of job-search advice, and most of it is generic enough to apply to any job, in any decade. We looked at what actually correlated with faster offers among people we've worked with, and it came down to three things.

First, applying within 48 hours of a posting going live roughly doubles response rates — most roles get the bulk of their applicants in the first week. Second, tailoring the top third of a resume to the specific listing matters far more than a full rewrite. Third, candidates who could speak to one concrete result (a number, a shipped feature, a resolved incident) consistently outperformed candidates with longer but vaguer experience sections.

None of this is exotic. It's just specific, and specific is rare.`,
  },
];
