import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/images/logo/logo.svg";
import { useAuth } from "@/hooks/useAuth";
import {
  getFooterLinkGroups,
  LEGAL_LINKS,
  SOCIAL_LINKS,
} from "@/components/layout/js/footerLinks";

// lucide-react doesn't ship brand/social icons (Facebook, X, Instagram,
// LinkedIn) — it only has generic UI icons — so these are small inline
// SVGs instead of a missing import.
const SOCIAL_ICONS = {
  facebook: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.16 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.78 8.44-4.94 8.44-9.94Z" />
    </svg>
  ),
  twitter: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-7.4 8.5L23.3 22H16.7l-5.2-6.8L5.6 22H2.5l7.9-9.1L1.9 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.7L7.4 3.9H5.6L17.7 20Z" />
    </svg>
  ),
  linkedin: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  ),
  instagram: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
};

export function PublicFooter() {
  const { user } = useAuth();
  const groups = getFooterLinkGroups(user?.role);

  return (
    <footer className="border-t border-primary/10 bg-ink-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="JobSansar" className="h-8 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-accent">
              Find the right role or the right hire, without the noise. Built
              for job seekers and employers who want a faster, simpler hiring
              process.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 text-sm text-accent">
              <a
                href="mailto:hello@jobsansar.com"
                className="flex items-center gap-2 hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0" />
                hello@jobsansar.com
              </a>
              <a
                href="tel:+9771234567"
                className="flex items-center gap-2 hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0" />
                +977 1-234-567
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                Kathmandu, Nepal
              </span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICONS[social.icon];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-accent transition-colors hover:bg-secondary hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link groups */}
          {groups.map((group) => (
            <div key={group.heading} className="flex flex-col gap-3 text-sm">
              <span className="font-semibold text-white">{group.heading}</span>
              <div className="flex flex-col gap-2.5 text-accent">
                {group.links.map((link) => (
                  <Link
                    key={`${link.to}-${link.label}`}
                    to={link.to}
                    className="w-fit hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-primary/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-accent">
            © {new Date().getFullYear()} JobSansar. All rights reserved.
          </p>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-accent">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
