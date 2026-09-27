import { Mail, MapPin, Globe, DollarSign, Award } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { sanitizeHtml } from "@/utils/sanitizeHtml";

export function initials(name = "") {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Layout/typography that differs per template. The dynamic accent color
// itself is never in here — it's applied via inline style so any hex the
// user picks works, not just a fixed Tailwind palette.
const VARIANTS = {
  classic: {
    header: "text-center",
    name: "text-2xl font-bold tracking-tight text-gray-900",
    role: "mt-1 text-sm font-bold uppercase tracking-wide",
    contact: "mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-600",
    divider: "my-5 h-0.5 w-full",
    sectionHeader: "mt-6 mb-3 border-b pb-1.5 text-xs font-bold uppercase tracking-wide",
    card: false,
  },
  modern: {
    header: "flex items-center gap-4 border-b-2 pb-5",
    name: "text-xl font-semibold text-gray-900",
    role: "mt-0.5 text-sm font-semibold",
    contact: "mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600",
    divider: "hidden",
    sectionHeader:
      "mt-6 mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white",
    card: true,
  },
  minimal: {
    header: "",
    name: "text-xl font-normal text-gray-900",
    role: "mt-0.5 text-sm text-gray-600",
    contact: "mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500",
    divider: "hidden",
    sectionHeader: "mt-6 mb-3 border-l-4 pl-2.5 text-xs font-semibold uppercase tracking-widest",
    card: false,
  },
};

function Section({ variant, color, title, children }) {
  const styles = VARIANTS[variant];
  const header =
    variant === "modern" ? (
      <h2 className={styles.sectionHeader} style={{ backgroundColor: color }}>
        {title}
      </h2>
    ) : (
      <h2
        className={styles.sectionHeader}
        style={variant === "classic" ? { borderColor: color, color } : { borderColor: color, color: "#111827" }}
      >
        {title}
      </h2>
    );

  const body = <div className="flex flex-col gap-4">{children}</div>;

  return styles.card ? (
    <Card className="mt-2">
      {header}
      {body}
    </Card>
  ) : (
    <div>
      {header}
      {body}
    </div>
  );
}

function Entry({ title, meta, description, richText = false }) {
  return (
    <div className="border-t border-primary/10 pt-4 first:border-0 first:pt-0">
      <p className="font-medium text-gray-900">{title}</p>
      <p className="text-sm text-gray-500">{meta}</p>
      {description &&
        (richText ? (
          <div
            className="prose prose-sm mt-2 max-w-none text-gray-600"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
          />
        ) : (
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        ))}
    </div>
  );
}

/**
 * Renders a resume in one of three visual templates (classic/modern/
 * minimal), accented with the resume's chosen color. Used read-only by
 * both the seeker's own Resume Preview page and the employer's
 * candidate view — this is "what a resume looks like", nothing more;
 * template/color selection UI lives in TemplatePicker, and page-level
 * chrome (back links, print/download actions) stays in each page.
 */
export function ResumeTemplate({ resume }) {
  const variant = VARIANTS[resume.template] ? resume.template : "classic";
  const styles = VARIANTS[variant];
  const color = resume.color || "#0f172a";

  return (
    <div>
      <div className={styles.header}>
        {variant === "modern" && (
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white"
            style={{ backgroundColor: color }}
          >
            {initials(resume.name)}
          </span>
        )}
        <div>
          <h1 className={styles.name}>{resume.name}</h1>
          {resume.title && (
            <p className={styles.role} style={{ color }}>
              {resume.title}
            </p>
          )}
          <div className={styles.contact}>
            <a href={`mailto:${resume.email}`} className="flex items-center gap-1.5 hover:underline">
              <Mail className="h-3.5 w-3.5" />
              {resume.email}
            </a>
            {resume.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {resume.location}
              </span>
            )}
            {resume.website && (
              <a
                href={resume.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:underline"
              >
                <Globe className="h-3.5 w-3.5" />
                {resume.website}
              </a>
            )}
            {resume.expectedSalary && (
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5" />
                {resume.expectedSalary}
              </span>
            )}
          </div>
          {resume.socialLinks?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {resume.socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                  style={{ color }}
                >
                  {link.platform}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.divider} style={{ backgroundColor: color }} />

      {resume.education?.length > 0 && (
        <Section variant={variant} color={color} title="Education">
          {resume.education.map((entry, i) => (
            <Entry
              key={i}
              title={`${entry.degree}, ${entry.fieldOfStudy}`}
              meta={`${entry.school} · ${entry.from} – ${entry.to}`}
              description={entry.description}
              richText
            />
          ))}
        </Section>
      )}

      {resume.experience?.length > 0 && (
        <Section variant={variant} color={color} title="Work Experience">
          {resume.experience.map((entry, i) => (
            <Entry
              key={i}
              title={`${entry.jobTitle} at ${entry.companyName}`}
              meta={`${entry.from} – ${entry.to}`}
              description={entry.description}
            />
          ))}
        </Section>
      )}

      {resume.achievements?.length > 0 && (
        <Section variant={variant} color={color} title="Achievements & Certificates">
          {resume.achievements.map((entry, i) => (
            <div key={i} className="flex items-start gap-3 border-t border-primary/10 pt-4 first:border-0 first:pt-0">
              <Award className="mt-0.5 h-4 w-4 shrink-0" style={{ color }} />
              <div>
                <p className="font-medium text-gray-900">{entry.title}</p>
                {(entry.issuer || entry.date) && (
                  <p className="text-sm text-gray-500">
                    {[entry.issuer, entry.date].filter(Boolean).join(" · ")}
                  </p>
                )}
                {entry.description && <p className="mt-2 text-sm text-gray-600">{entry.description}</p>}
              </div>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}
