import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Modal } from "@/components/ui/Modal";
import { QueryState } from "@/components/ui/QueryState";
import { AlertForm } from "@/components/forms/AlertForm";
import { useJobAlerts, useCreateJobAlert, useDeleteJobAlert } from "@/hooks/useJobAlerts";

export function JobAlerts() {
  const [createOpen, setCreateOpen] = useState(false);
  const { data: alerts = [], isLoading, isError, error } = useJobAlerts();
  const { mutate: createAlert, isPending: isCreating } = useCreateJobAlert();
  const { mutate: deleteAlert } = useDeleteJobAlert();

  const handleCreate = (values) => {
    createAlert(values, {
      onSuccess: () => {
        toast.success("Alert created");
        setCreateOpen(false);
      },
      onError: (err) => toast.error(err.message ?? "Could not create alert"),
    });
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Remove the "${name}" alert?`)) return;

    deleteAlert(id, {
      onSuccess: () => toast.success("Alert removed"),
      onError: (err) => toast.error(err.message ?? "Could not remove this alert"),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Job alerts</h1>
          <p className="mt-1 text-sm text-accent">
            Get notified when new jobs match your saved searches.
          </p>
        </div>
        <PrimaryButton onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Create alert
        </PrimaryButton>
      </div>

      <Card className="mt-6 p-0">
        <QueryState isLoading={isLoading} isError={isError} error={error} errorLabel="Could not load your alerts">
          <div className="hidden grid-cols-[2fr_2fr_1.5fr_1fr_auto] gap-4 border-b border-primary/10 px-5 py-3 text-xs font-medium uppercase text-accent sm:grid">
            <span>Name</span>
            <span>Keywords</span>
            <span>Contract type</span>
            <span>Frequency</span>
            <span />
          </div>

          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="grid grid-cols-2 gap-3 border-b border-primary/10 px-5 py-4 text-sm last:border-0 sm:grid-cols-[2fr_2fr_1.5fr_1fr_auto] sm:items-center"
            >
              <span className="font-medium text-text">{alert.name}</span>
              <span className="text-accent">{alert.keywords}</span>
              <span>
                <Badge tone="brand">{alert.type}</Badge>
              </span>
              <span className="text-accent">{alert.frequency}</span>
              <button
                onClick={() => handleDelete(alert.id, alert.name)}
                className="justify-self-end text-accent hover:text-red-600"
                aria-label={`Remove ${alert.name} alert`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {alerts.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-accent">
              No alerts yet — create one to get notified about new roles.
            </p>
          )}
        </QueryState>
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create a job alert"
      >
        <AlertForm onSubmit={handleCreate} isSubmitting={isCreating} />
      </Modal>
    </div>
  );
}