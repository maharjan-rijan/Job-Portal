import { Link } from "react-router-dom";
import logo from "@/assets/images/logo/logo.svg";
import { useAuth } from "@/hooks/useAuth";
import { getFooterLinkGroups, LEGAL_LINKS } from "@/components/layout/js/footerLinks";

export function PublicFooter() {
  const { user } = useAuth();
  const groups = getFooterLinkGroups(user?.role);

  return (
    <footer className="border-t border-primary/10 bg-ink-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="JobSansar" className="h-8 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-accent">
              Find the right role or the right hire, without the noise.
            </p>
          </div>
          <div className="flex gap-12 text-sm text-accent">
            {groups.map((group) => (
              <div key={group.heading} className="flex flex-col gap-2">
                <span className="font-medium text-white">{group.heading}</span>
                {group.links.map((link) => (
                  <Link key={`${link.to}-${link.label}`} to={link.to}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-primary/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-accent">
            © {new Date().getFullYear()} JobSansar. All rights reserved.
          </p>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-accent">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}