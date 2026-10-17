import { Link } from "react-router-dom";
import { UserPlus, FileText, Send, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

const STATS = [
  { label: "Live job listings", value: "12,400+" },
  { label: "Companies hiring", value: "3,200+" },
  { label: "Candidates placed", value: "58,000+" },
  { label: "Countries covered", value: "40+" },
];

const STEPS = [
  {
    icon: UserPlus,
    link: "/register",
    title: "Register your account",
    description:
      "Create a free profile as a candidate or an employer in under a minute.",
  },
  {
    icon: FileText,
    title: "Build your resume",
    description:
      "Add your experience once and reuse it across every application.",
  },
  {
    icon: Send,
    title: "Apply for your dream job",
    description:
      "Search thousands of roles and apply directly, no email required.",
  },
];

export function About() {
  return (
    <>
      <section className="border-b border-primary/10 bg-background">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-text sm:text-5xl">
            About JobSansar
          </h1>
          <p className="mt-4 text-lg text-accent">
            We connect job seekers with the companies that need them — without
            the noise of cold applications and unanswered inboxes.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-text sm:text-3xl">
              Helping you find the job that actually fits
            </h2>
            <p className="mt-4 text-accent">
              JobSansar started as a small hiring board for tech teams tired of
              sifting through hundreds of unqualified applications. Today it's
              grown into a marketplace that treats both sides of hiring — the
              candidate and the company — as customers who deserve a
              straightforward, honest process.
            </p>
            <p className="mt-4 text-accent">
              No pay-to-apply gimmicks, no recycled listings. Every job on the
              board is verified, and every candidate profile is built to get you
              noticed by the right people.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((stat) => (
              <Card key={stat.label} className="text-center">
                <p className="text-3xl font-semibold text-secondary">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-accent">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-text sm:text-3xl">
              Three steps to your next role
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step) => (
              <Card key={step.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                  <step.icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-text">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-accent">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-card bg-ink-900 px-8 py-12 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Ready to get started?
            </h2>
            <p className="mt-2 text-accent">
              Browse open roles or post your first job in minutes.
            </p>
          </div>
          <Link
            to="/jobs"
            className="flex shrink-0 items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-white hover:bg-brand-600"
          >
            Browse Jobs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
