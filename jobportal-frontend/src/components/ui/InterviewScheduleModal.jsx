import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

export function InterviewScheduleModal({
  open,
  applicantName,
  onClose,
  onConfirm,
  isSubmitting,
}) {
  const [scheduledAt, setScheduledAt] = useState("");

  const handleClose = () => {
    setScheduledAt("");
    onClose();
  };

  const handleConfirm = () => {
    if (!scheduledAt) return;
    onConfirm(scheduledAt);
  };

  // Don't let an employer pick a time in the past.
  const minDateTime = new Date(
    Date.now() - new Date().getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 16);

  return (
    <Modal open={open} onClose={handleClose} title="Schedule interview">
      <div className="flex items-start gap-3 rounded-lg bg-secondary/5 p-3 text-sm text-primary">
        <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
        <p>
          Pick a date and time for {applicantName ?? "this applicant"}'s
          interview. They'll be notified with the schedule as soon as you
          confirm.
        </p>
      </div>

      <label className="mt-4 block text-sm font-medium text-text">
        Interview date &amp; time
        <input
          type="datetime-local"
          value={scheduledAt}
          min={minDateTime}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-primary/20 bg-surface px-3 py-2 text-sm text-text focus:border-secondary focus:outline-none"
        />
      </label>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="rounded-lg px-4 py-2 text-sm font-medium text-accent hover:bg-primary/5 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!scheduledAt || isSubmitting}
          className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/90 disabled:opacity-50"
        >
          {isSubmitting ? "Scheduling…" : "Confirm & notify"}
        </button>
      </div>
    </Modal>
  );
}
