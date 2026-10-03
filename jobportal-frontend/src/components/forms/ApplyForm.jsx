import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { TextInput } from "@/components/ui/TextInput";
import { TextArea } from "@/components/ui/TextArea";
import { FileUpload } from "@/components/ui/FileUpload";
import { Button } from "@/components/ui/Button";
import { applySchema } from "@/lib/validation/applySchema";
import { useApplyToJob } from "@/hooks/useApplications";
import { useAuth } from "@/hooks/useAuth";

export function ApplyForm({ jobId, onSuccess }) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applySchema),
    defaultValues: {
      fullName: user?.name ?? "",
      email: user?.email ?? "",
      resumeUrl: "",
      resumeFile: undefined,
      coverNote: "",
    },
  });

  const { mutate, isPending } = useApplyToJob();

  // Not register()'d — FileUpload hands back a raw File, not an input
  // change event, so it's pushed into the form manually (same pattern as
  // the logo file in EmployerProfileForm). shouldValidate re-runs the
  // "file or link" refine as soon as a file is picked/removed.
  const handleResumeFileChange = (file) => {
    setValue("resumeFile", file ?? undefined, { shouldValidate: true });
  };

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

      <FileUpload
        label="Resume"
        accept=".pdf,.doc,.docx"
        maxSizeMB={5}
        helperText="PDF or Word document, up to 5MB"
        onChange={handleResumeFileChange}
        error={errors.resumeFile?.message}
      />

      <div className="flex items-center gap-3 text-xs text-accent">
        <div className="h-px flex-1 bg-primary/10" />
        or paste a link instead
        <div className="h-px flex-1 bg-primary/10" />
      </div>

      <TextInput
        label="Resume link (optional if you uploaded a file above)"
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