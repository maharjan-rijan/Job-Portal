import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Menu as MenuIcon,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "@/components/ui/Button";
import { CurrencyToggle } from "@/components/ui/CurrencyToggle";
import { useAuth } from "@/hooks/useAuth";
import { useCurrency } from "@/hooks/useCurrency";
import { getDashboardNav } from "@/config/dashboardNav";
import { cn } from "@/utils/cn";
import logo from "@/assets/images/logo/logo.svg";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Find Jobs", to: "/jobs" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

function initials(name = "") {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [currency, setCurrency] = useCurrency();
  const { dashboardPath } = getDashboardNav(user?.role);

  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-surface">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="JobSansar" className="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? "text-secondary" : "text-primary hover:text-text"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <CurrencyToggle value={currency} onChange={setCurrency} />
          {isAuthenticated ? (
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-primary/5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/10 text-sm font-semibold text-secondary">
                  {initials(user?.name || "Guest")}
                </span>
                <span className="flex flex-col items-start">
                  <span className="text-sm font-medium text-primary">
                    {user?.name ?? "Guest"}
                  </span>
                  <span className="text-xs capitalize text-accent">
                    {user?.role ?? "Guest"}
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 text-accent" />
              </MenuButton>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <MenuItems className="absolute right-0 z-30 mt-2 w-48 rounded-lg border border-primary/10 bg-surface py-1 shadow-lg focus:outline-none">
                  {dashboardPath && (
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to={dashboardPath}
                          className={cn(
                            "flex items-center gap-2 px-3.5 py-2.5 text-sm text-primary",
                            focus && "bg-secondary/10 text-secondary",
                          )}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                      )}
                    </MenuItem>
                  )}
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={logout}
                        className={cn(
                          "flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-primary",
                          focus && "bg-secondary/10 text-secondary",
                        )}
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Transition>
            </Menu>
          ) : (
            <>
              <Button
                as={Link}
                to="/login"
                variant="ghost"
                size="sm"
                className="text-primary hover:text-text"
              >
                Log in
              </Button>
              <Button as={Link} to="/register" size="sm">
                Sign up
              </Button>
            </>
          )}
        </div>

        <button
          className="text-primary lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-primary/10 px-4 py-3 lg:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-primary hover:bg-background"
            >
              {link.label}
            </NavLink>
          ))}

          <div className="mt-2 flex items-center justify-between border-t border-primary/10 px-2 pt-3">
            <span className="text-xs font-medium uppercase tracking-wide text-accent">
              Currency
            </span>
            <CurrencyToggle value={currency} onChange={setCurrency} />
          </div>

          {isAuthenticated ? (
            <>
              <div className="mt-2 flex items-center gap-2 border-t border-primary/10 px-2 pt-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/10 text-sm font-semibold text-secondary">
                  {initials(user?.name || "Guest")}
                </span>
                <span className="text-sm font-medium text-primary">
                  {user?.name ?? "Guest"}
                </span>
              </div>
              {dashboardPath && (
                <Link
                  to={dashboardPath}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-2 py-2 text-sm font-medium text-primary hover:bg-background"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="rounded-md px-2 py-2 text-left text-sm font-medium text-primary hover:bg-background"
              >
                Log out
              </button>
            </>
          ) : (
            <Button
              as={Link}
              to="/login"
              variant="ghost"
              size="sm"
              onClick={() => setMobileOpen(false)}
              className="justify-start text-primary hover:bg-background"
            >
              Log in
            </Button>
          )}
        </nav>
      )}
    </header>
  );
}
