import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { TextInput } from "@/components/ui/TextInput";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { applySchema } from "@/lib/validation/applySchema";
import { useApplyToJob } from "@/hooks/useApplications";
import { useAuth } from "@/hooks/useAuth";

export function ApplyForm({ jobId, onSuccess }) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applySchema),
    defaultValues: {
      fullName: user?.name ?? "",
      email: user?.email ?? "",
      resumeUrl: "",
      coverNote: "",
    },
  });

 const { mutate, isPending } = useApplyToJob();

  const onSubmit = (payload) => {
    mutate(
      { jobId, payload },
      {
        onSuccess: () => {
          toast.success("Application submitted!");
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(error.message ?? "Could not submit your application");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <TextInput
        label="Full name"
        placeholder="Jane Doe"
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <TextInput
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextInput
        label="Resume link"
        placeholder="https://drive.google.com/..."
        error={errors.resumeUrl?.message}
        {...register("resumeUrl")}
      />
      <TextArea
        label="Cover note (optional)"
        rows={4}
        placeholder="Tell the employer why you're a good fit"
        error={errors.coverNote?.message}
        {...register("coverNote")}
      />
      <Button type="submit" isLoading={isPending} className="mt-2 w-full">
        Submit application
      </Button>
    </form>
  );
}
