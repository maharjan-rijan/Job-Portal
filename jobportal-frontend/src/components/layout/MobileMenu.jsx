import { NavLink } from "react-router-dom";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { NAV_LINKS } from "@/components/layout/js/navLinks";

export function MobileMenu({ onNavigate, onLoginClick }) {
  return (
    <nav className="flex flex-col gap-1 border-t border-primary/10 px-4 py-3 lg:hidden">
      {NAV_LINKS.map((link) =>
        link.children ? (
          <Disclosure key={link.label}>
            {({ open }) => (
              <>
                <DisclosureButton className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-medium text-primary hover:bg-background">
                  {link.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </DisclosureButton>
                <DisclosurePanel className="flex flex-col gap-1 pl-4">
                  {link.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      onClick={onNavigate}
                      className="rounded-md px-2 py-2 text-sm text-accent hover:bg-background hover:text-text"
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        ) : (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              `rounded-md px-2 py-2 text-sm font-medium ${
                isActive ? "text-secondary" : "text-primary hover:bg-background"
              }`
            }
          >
            {link.label}
          </NavLink>
        ),
      )}
      <button
        onClick={onLoginClick}
        className="rounded-md px-2 py-2 text-left text-sm font-medium text-primary hover:bg-background"
      >
        Log in
      </button>
    </nav>
  );
}
