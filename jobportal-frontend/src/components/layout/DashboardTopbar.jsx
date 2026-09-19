import { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu as MenuIcon,
  Moon,
  Search,
  Settings,
  Sun,
  UserCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/utils/cn";

function initials(name = "") {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function DashboardTopbar({
  title,
  accountPath,
  changePasswordPath,
  onMenuClick,
}) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-20 items-center justify-between gap-4 border-b border-primary/10 bg-surface px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary hover:bg-primary/5 lg:hidden"
        aria-label="Open menu"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-lg border border-primary/20 px-3.5 sm:flex sm:max-w-xs">
        <Search className="h-4 w-4 shrink-0 text-accent" />
        <input
          type="text"
          placeholder="Search or type command..."
          className="h-10 w-full border-0 bg-transparent text-sm text-text placeholder:text-accent focus:outline-none"
        />
      </div>

      <h1 className="text-lg font-semibold text-text sm:hidden">{title}</h1>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full text-accent hover:bg-primary/5"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-accent hover:bg-primary/5"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-amber-500" />
        </button>

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
              {accountPath && (
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      to={accountPath}
                      className={cn(
                        "flex items-center gap-2 px-3.5 py-2.5 text-sm text-primary",
                        focus && "bg-secondary/10 text-secondary",
                      )}
                    >
                      <UserCircle className="h-4 w-4" />
                      Account
                    </Link>
                  )}
                </MenuItem>
              )}
              {changePasswordPath && (
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      to={changePasswordPath}
                      className={cn(
                        "flex items-center gap-2 px-3.5 py-2.5 text-sm text-primary",
                        focus && "bg-secondary/10 text-secondary",
                      )}
                    >
                      <Settings className="h-4 w-4" />
                      Change password
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
      </div>
    </header>
  );
}
