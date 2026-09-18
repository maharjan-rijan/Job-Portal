import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import logo from "@/assets/images/logo/logo.svg";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Find Jobs", to: "/jobs" },
  { label: "Blog", to: "/blog-list" },
  { label: "Contact", to: "/contact" },
];

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="JobGrids" className="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? "text-brand-500" : "text-ink-600 hover:text-ink-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            as={Link}
            to="/login"
            variant="ghost"
            size="sm"
            className="text-ink-700 hover:text-ink-900"
          >
            Log in
          </Button>
          <Button as={Link} to="/register" size="sm">
            Sign up
          </Button>
        </div>

        <button
          className="text-ink-700 lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-ink-100 px-4 py-3 lg:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
            >
              {link.label}
            </NavLink>
          ))}
          <Button
            as={Link}
            to="/login"
            variant="ghost"
            size="sm"
            onClick={() => setMobileOpen(false)}
            className="justify-start text-ink-700 hover:bg-ink-50"
          >
            Log in
          </Button>
        </nav>
      )}
    </header>
  );
}