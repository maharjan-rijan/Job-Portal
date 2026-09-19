import { Fragment } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { NAV_LINKS } from "@/components/layout/navLinks";
import { cn } from "@/utils/cn";

export function NavLinks({ className = "" }) {
  return (
    <nav className={`hidden items-center gap-8 lg:flex ${className}`}>
      {NAV_LINKS.map((link) =>
        link.children ? (
          <Menu as="div" key={link.label} className="relative">
            <MenuButton className="flex items-center gap-1 text-sm font-medium text-primary hover:text-text">
              {link.label}
              <ChevronDown className="h-3.5 w-3.5" />
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
              <MenuItems className="absolute left-0 z-30 mt-2 w-44 rounded-lg border border-primary/20 bg-surface py-1 shadow-lg focus:outline-none">
                {link.children.map((child) => (
                  <MenuItem key={child.to}>
                    {({ focus }) => (
                      <Link
                        to={child.to}
                        className={cn(
                          "block px-3.5 py-2.5 text-sm text-primary",
                          focus && "bg-secondary/10 text-secondary"
                        )}
                      >
                        {child.label}
                      </Link>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </Menu>
        ) : (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive ? "text-secondary" : "text-primary hover:text-text"
              }`
            }
          >
            {link.label}
          </NavLink>
        )
      )}
    </nav>
  );
}
