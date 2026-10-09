import { format, formatDistanceToNowStrict, isValid, parseISO } from "date-fns";

function toDate(value) {
  const date = typeof value === "string" ? parseISO(value) : value;
  return isValid(date) ? date : null;
}

/** "Jan 12, 2026" */
export function formatDate(value, pattern = "MMM d, yyyy") {
  const date = toDate(value);
  return date ? format(date, pattern) : "—";
}

export function formatDateTime(value, pattern = "MMM d, yyyy 'at' h:mm a") {
  const date = toDate(value);
  return date ? format(date, pattern) : "—";
}

/** "3 days ago" — used on job cards and application timelines. */
export function formatRelative(value) {
  const date = toDate(value);
  return date ? formatDistanceToNowStrict(date, { addSuffix: true }) : "—";
}

/** "$60,000 – $80,000" style salary range formatting. */
export function formatSalaryRange(min, max, currency = "USD") {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  if (!min && !max) return "Salary not specified";
  if (min && max) return `${formatter.format(min)} – ${formatter.format(max)}`;
  return formatter.format(min ?? max);
}

const USD_TO_NPR_RATE = 133;

export function convertUsdToNPR(amount) {
  return amount == null ? amount : Math.round(amount * USD_TO_NPR_RATE);
}
