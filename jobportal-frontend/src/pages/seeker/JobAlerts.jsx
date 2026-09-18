import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Modal } from "@/components/ui/Modal";
import { AlertForm } from "@/components/forms/AlertForm";
import { MOCK_JOB_ALERTS } from "@/lib/mockData";

// TODO: no alertService/backend yet — this list lives in local state only
// and resets on reload. Swap for a TanStack Query + service pair (same
// pattern as jobService) once the endpoint exists.
export function JobAlerts() {
  const [alerts, setAlerts] = useState(MOCK_JOB_ALERTS);
  const [createOpen, setCreateOpen] = useState(false);

  const handleCreate = (values) => {
    setAlerts((prev) => [...prev, { id: crypto.randomUUID(), ...values }]);
    toast.success("Alert created");
    setCreateOpen(false);
  };

  const handleDelete = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    toast.success("Alert removed");
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">Job alerts</h1>
          <p className="mt-1 text-sm text-ink-500">
            Get notified when new jobs match your saved searches.
          </p>
        </div>
        <PrimaryButton onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Create alert
        </PrimaryButton>
      </div>

      <Card className="mt-6 p-0">
        <div className="hidden grid-cols-[2fr_2fr_1.5fr_1fr_auto] gap-4 border-b border-ink-100 px-5 py-3 text-xs font-medium uppercase text-ink-400 sm:grid">
          <span>Name</span>
          <span>Keywords</span>
          <span>Contract type</span>
          <span>Frequency</span>
          <span />
        </div>

        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="grid grid-cols-2 gap-3 border-b border-ink-100 px-5 py-4 text-sm last:border-0 sm:grid-cols-[2fr_2fr_1.5fr_1fr_auto] sm:items-center"
          >
            <span className="font-medium text-ink-900">{alert.name}</span>
            <span className="text-ink-500">{alert.keywords}</span>
            <span>
              <Badge tone="brand">{alert.type}</Badge>
            </span>
            <span className="text-ink-500">{alert.frequency}</span>
            <button
              onClick={() => handleDelete(alert.id)}
              className="justify-self-end text-ink-400 hover:text-red-600"
              aria-label={`Remove ${alert.name} alert`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {alerts.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-ink-400">
            No alerts yet — create one to get notified about new roles.
          </p>
        )}
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create a job alert"
      >
        <AlertForm onSubmit={handleCreate} />
      </Modal>
    </div>
  );
}
