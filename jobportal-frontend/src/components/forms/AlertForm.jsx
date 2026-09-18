import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "@/components/ui/TextInput";
import { Dropdown } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { alertSchema } from "@/lib/validation/alertSchema";
import { JOB_TYPES, ALERT_FREQUENCIES } from "@/utils/constants";

export function AlertForm({ onSubmit }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(alertSchema),
    defaultValues: { name: "", keywords: "", type: "", frequency: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <TextInput
        label="Alert name"
        placeholder="e.g. Frontend roles"
        error={errors.name?.message}
        {...register("name")}
      />
      <TextInput
        label="Keywords"
        placeholder="e.g. React, TypeScript"
        error={errors.keywords?.message}
        {...register("keywords")}
      />
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <Dropdown
            label="Contract type"
            placeholder="Select a type"
            options={JOB_TYPES.map((type) => ({ label: type, value: type }))}
            value={field.value}
            onChange={field.onChange}
            error={errors.type?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="frequency"
        render={({ field }) => (
          <Dropdown
            label="Frequency"
            placeholder="Select a frequency"
            options={ALERT_FREQUENCIES.map((freq) => ({ label: freq, value: freq }))}
            value={field.value}
            onChange={field.onChange}
            error={errors.frequency?.message}
          />
        )}
      />
      <Button type="submit" className="mt-2 w-full">
        Create alert
      </Button>
    </form>
  );
}
