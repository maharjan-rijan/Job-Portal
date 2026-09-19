import { NavLink, Link } from "react-router-dom";
import { ChevronLeft, Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";
import logo from "@/assets/images/logo/logo.svg";

/**
 * items: [{ label, to, icon: LucideIcon }]
 *
 * Desktop: a fixed-position column that toggles between w-64 (labels
 * visible) and w-20 (icon-only) via `collapsed`/`onToggleCollapse`.
 * Mobile (<lg): an off-canvas drawer controlled by `mobileOpen` /
 * `onCloseMobile`, shown over a dark backdrop; DashboardTopbar's
 * hamburger button is what sets `mobileOpen` true.
 */
export function DashboardSidebar({
  items,
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}) {
  const navList = (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {items.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          onClick={onCloseMobile}
          title={collapsed ? label : undefined}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
              collapsed && "justify-center",
              isActive
                ? "bg-secondary/10 text-secondary"
                : "text-primary hover:bg-primary/5"
            )
          }
        >
          <Icon className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span className="truncate">{label}</span>}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden shrink-0 flex-col border-r border-primary/10 bg-surface transition-all duration-200 lg:flex",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className={cn("flex h-20 items-center px-4", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2 overflow-hidden">
              <img src={logo} alt="JobGrids" className="h-8 w-auto shrink-0" />
            </Link>
          )}
          <button
            onClick={onToggleCollapse}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-accent hover:bg-primary/5"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
        {navList}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={onCloseMobile}
          className={cn(
            "absolute inset-0 bg-slate-900/50 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
        />
        <aside
          className={cn(
            "absolute left-0 top-0 flex h-full w-64 flex-col bg-surface shadow-xl transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-20 items-center justify-between px-4">
            <Link to="/" onClick={onCloseMobile} className="flex items-center gap-2">
              <img src={logo} alt="JobGrids" className="h-8 w-auto" />
            </Link>
            <button
              onClick={onCloseMobile}
              className="flex h-8 w-8 items-center justify-center rounded-full text-accent hover:bg-primary/5"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {navList}
        </aside>
      </div>
    </>
  );
}
