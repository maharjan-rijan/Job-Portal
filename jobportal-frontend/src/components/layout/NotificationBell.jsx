import { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Bell, Briefcase, CheckCheck } from "lucide-react";
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/useNotifications";
import { formatRelative } from "@/utils/formatters";
import { cn } from "@/utils/cn";

// Only "job_application" exists for now (fired when a seeker applies —
// see JobApplicationController_store_snippet.php), but this is shaped
// so a new notification `type` just needs an entry here, not a rewrite.
const NOTIFICATION_META = {
  job_application: {
    icon: Briefcase,
    label: (data) =>
      `${data.applicant_name ?? "Someone"} applied to ${data.job_title ?? "your job"}`,
    to: () => "/employer/applications",
  },
};

function NotificationRow({ notification, onRead }) {
  const meta = NOTIFICATION_META[notification.type] ?? {
    icon: Bell,
    label: () => "New notification",
    to: () => "#",
  };
  const Icon = meta.icon;
  const isUnread = !notification.readAt;

  return (
    <MenuItem>
      {({ focus }) => (
        <Link
          to={meta.to(notification.data)}
          onClick={() => isUnread && onRead(notification.id)}
          className={cn(
            "flex items-start gap-3 px-3.5 py-3 text-sm",
            focus && "bg-secondary/10",
            isUnread && "bg-secondary/5",
          )}
        >
          <span
            className={cn(
              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              isUnread
                ? "bg-secondary/15 text-secondary"
                : "bg-background text-accent",
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span
              className={cn(
                "block",
                isUnread ? "font-medium text-text" : "text-primary",
              )}
            >
              {meta.label(notification.data)}
            </span>
            <span className="mt-0.5 block text-xs text-accent">
              {formatRelative(notification.createdAt)}
            </span>
          </span>
          {isUnread && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-secondary" />
          )}
        </Link>
      )}
    </MenuItem>
  );
}

export function NotificationBell() {
  const { data: notifications = [] } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();

  return (
    <Menu as="div" className="relative">
      <MenuButton
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-accent hover:bg-primary/5"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
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
        <MenuItems className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-lg border border-primary/10 bg-surface shadow-lg focus:outline-none">
          <div className="flex items-center justify-between border-b border-primary/10 px-3.5 py-2.5">
            <span className="text-sm font-semibold text-text">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                disabled={isMarkingAll}
                className="flex items-center gap-1 text-xs font-medium text-secondary hover:underline disabled:opacity-50"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-3.5 py-10 text-center text-sm text-accent">
                You're all caught up.
              </p>
            ) : (
              notifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onRead={markRead}
                />
              ))
            )}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
