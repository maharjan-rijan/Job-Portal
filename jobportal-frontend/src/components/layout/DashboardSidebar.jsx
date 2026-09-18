import { NavLink, Link } from "react-router-dom";
import logo from "@/assets/images/logo/logo.svg";

/**
 * items: [{ label, to, icon: LucideIcon }]
 * Kept generic so both SeekerLayout and EmployerLayout can reuse it
 * with their own link sets instead of duplicating the shell markup.
 */
export function DashboardSidebar({ items }) {
  return (
    <aside className="hidden w-64 flex-col border-r border-ink-100 bg-white lg:flex">
      <Link to="/" className="flex h-20 items-center px-6">
        <img src={logo} alt="JobGrids" className="h-8 w-auto" />
      </Link>
      <nav className="flex flex-col gap-1 px-3 py-4">
        {items.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                isActive
                  ? "bg-brand-50 text-brand-600"
                  : "text-ink-600 hover:bg-ink-50"
              }`
            }
          >
            <Icon className="h-4.5 w-4.5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
