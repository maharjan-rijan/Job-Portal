import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { Bell, ChevronDown, LogOut, Search, Settings, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";

function initials(name = "") {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function DashboardTopbar({ title, accountPath, changePasswordPath }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-20 items-center justify-between gap-4 border-b border-ink-100 bg-white px-6">
      <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-lg border border-ink-200 px-3.5 sm:flex sm:max-w-xs">
        <Search className="h-4 w-4 shrink-0 text-ink-300" />
        <input
          type="text"
          placeholder="Search or type command..."
          className="h-10 w-full border-0 bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
        />
        <kbd className="hidden shrink-0 rounded-md bg-ink-50 px-1.5 py-0.5 text-xs text-ink-400 md:inline">
          ⌘K
        </kbd>
      </div>

      <h1 className="text-lg font-semibold text-ink-900 sm:hidden">{title}</h1>

      <div className="flex items-center gap-3">
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-500 hover:bg-ink-50"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-amber-500" />
        </button>

        <Menu as="div" className="relative">
          <MenuButton className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink-50">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600">
              {initials(user?.name || "Guest")}
            </span>
            <span className="hidden text-sm font-medium text-ink-700 sm:inline">
              {user?.name ?? "Guest"}
            </span>
            <ChevronDown className="hidden h-4 w-4 text-ink-400 sm:inline" />
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
            <MenuItems className="absolute right-0 z-30 mt-2 w-48 rounded-lg border border-ink-100 bg-white py-1 shadow-lg focus:outline-none">
              {accountPath && (
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      to={accountPath}
                      className={cn(
                        "flex items-center gap-2 px-3.5 py-2.5 text-sm text-ink-700",
                        focus && "bg-brand-50 text-brand-600"
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
                        "flex items-center gap-2 px-3.5 py-2.5 text-sm text-ink-700",
                        focus && "bg-brand-50 text-brand-600"
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
                      "flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-ink-700",
                      focus && "bg-brand-50 text-brand-600"
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
