import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { Bell, Briefcase, CheckCheck, UserCheck, UserX, CalendarClock, Sparkles } from "lucide-react";
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/useNotifications";
import { formatRelative, formatDateTime } from "@/utils/formatters";
import { cn } from "@/utils/cn";

// Three notification types exist: "job_application" (employer side —
// fired when a seeker applies, see JobApplicationController_store_snippet.php),
// "application_status_changed" (seeker side — fired when an employer
// moves an application to interview/hired/rejected, see
// JobApplicationController_updateStatus_snippet.php), and "job_match"
// (seeker side — fired by the ML job-matching feature, either instantly
// when a matching job goes live, see NotifyMatchingSeekers.php, or in a
// scheduled digest per the seeker's alert frequency, see
// SendJobAlertDigests.php). Shaped so a new type just needs an entry
// here, not a rewrite.
const STATUS_META = {
  interview: { icon: CalendarClock, verb: "invited you to interview for" },
  hired: { icon: UserCheck, verb: "hired you for" },
  rejected: { icon: UserX, verb: "didn't move forward with your application for" },
};

const NOTIFICATION_META = {
  job_application: {
    // icon is ALWAYS a function of `data`, even when it doesn't need
    // data, so NotificationRow never has to guess whether to call it
    // or use it directly — that guessing is what caused the
    // "Objects are not valid as a React child" crash before.
    icon: () => Briefcase,
    label: (data) => `${data.applicant_name ?? "Someone"} applied to ${data.job_title ?? "your job"}`,
    to: () => "/employer/applications",
  },
  application_status_changed: {
    icon: (data) => STATUS_META[data.status]?.icon ?? Briefcase,
    label: (data) => {
      const base = `${data.company ?? "The employer"} ${STATUS_META[data.status]?.verb ?? "updated your application for"} ${data.job_title ?? "a job"}`;
      // Interview notifications carry a scheduled_at — append it so
      // the seeker sees the date/time right in the dropdown, not just
      // after clicking through to My Applications.
      return data.status === "interview" && data.scheduled_at
        ? `${base} — ${formatDateTime(data.scheduled_at)}`
        : base;
    },
    to: () => "/seeker/applied-jobs",
  },
  job_match: {
    icon: () => Sparkles,
    label: (data) => {
      const pct = data.score != null ? Math.round(data.score * 100) : null;
      const matchPart = pct != null ? ` (${pct}% match)` : "";
      return `New job match: ${data.job_title ?? "a job"}${matchPart}`;
    },
    // Straight to the job itself, not the browse list — this is a
    // specific recommendation, not a generic "go look around" nudge.
    to: (data) => (data.job_id ? `/jobs/${data.job_id}` : "/seeker/browse-jobs"),
  },
};

function NotificationRow({ notification, onRead }) {
  const meta = NOTIFICATION_META[notification.type] ?? {
    icon: () => Bell,
    label: () => "New notification",
    to: () => "#",
  };
  // meta.icon is always a function of `data` — call it to get the
  // actual component, then render THAT. Never render meta.icon itself.
  const Icon = meta.icon(notification.data);
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
              isUnread ? "bg-secondary/15 text-secondary" : "bg-background text-accent",
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className={cn("block", isUnread ? "font-medium text-text" : "text-primary")}>
              {meta.label(notification.data)}
            </span>
            <span className="mt-0.5 block text-xs text-accent">
              {formatRelative(notification.createdAt)}
            </span>
          </span>
          {isUnread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-secondary" />}
        </Link>
      )}
    </MenuItem>
  );
}

export function NotificationBell() {
  const { data: notifications = [] } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();

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
            <span className="text-sm font-semibold text-text">Notifications</span>
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
                <NotificationRow key={notification.id} notification={notification} onRead={markRead} />
              ))
            )}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
