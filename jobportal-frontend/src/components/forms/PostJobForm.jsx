import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { TextInput } from "@/components/ui/TextInput";
import { TextArea } from "@/components/ui/TextArea";
import { Dropdown } from "@/components/ui/Dropdown";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useSaveJob } from "@/hooks/useJobs";
import { jobSchema } from "@/lib/validation/jobSchema";
import { JOB_TYPES } from "@/utils/constants";

const listToText = (list) => (Array.isArray(list) ? list.join("\n") : "");
const textToList = (text) =>
  (text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

/**
 * `job`: pass an existing job object to pre-fill and PUT on submit
 * (Edit Job); omit it to POST a new job (Post a Job).
 */
export function PostJobForm({ job, onSuccess }) {
  const isEditing = Boolean(job?.id);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: job?.title ?? "",
      type: job?.type ?? "",
      location: job?.location ?? "",
      salaryMin: job?.salaryMin ?? "",
      salaryMax: job?.salaryMax ?? "",
      vacancies: job?.vacancies ?? 1,
      experienceLevel: job?.experienceLevel ?? "",
      applicationDeadline: job?.applicationDeadline ?? "",
      description: job?.description ?? "",
      responsibilities: listToText(job?.responsibilities),
      requirements: listToText(job?.requirements),
      benefits: listToText(job?.benefits),
    },
  });

  const { mutate, isPending } = useSaveJob();

  const onSubmit = (values) => {
    const payload = {
      ...values,
      responsibilities: textToList(values.responsibilities),
      requirements: textToList(values.requirements),
      benefits: textToList(values.benefits),
    };

    mutate(
      { id: job?.id, payload },
      {
        onSuccess: (savedJob) => {
          toast.success(isEditing ? "Job updated" : "Job posted");
          onSuccess?.(savedJob);
        },
        onError: (error) => {
          toast.error(error.message ?? "Could not save this job");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Job title"
          placeholder="e.g. Software Engineer"
          error={errors.title?.message}
          {...register("title")}
        />
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Dropdown
              label="Job type"
              placeholder="Select a type"
              options={JOB_TYPES.map((type) => ({ label: type, value: type }))}
              value={field.value}
              onChange={field.onChange}
              error={errors.type?.message}
            />
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Location"
          placeholder="e.g. New York, USA"
          error={errors.location?.message}
          {...register("location")}
        />
        <TextInput
          label="Experience level"
          placeholder="e.g. 2–3 years"
          error={errors.experienceLevel?.message}
          {...register("experienceLevel")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <TextInput
          label="Min salary"
          type="number"
          placeholder="20000"
          error={errors.salaryMin?.message}
          {...register("salaryMin")}
        />
        <TextInput
          label="Max salary"
          type="number"
          placeholder="25000"
          error={errors.salaryMax?.message}
          {...register("salaryMax")}
        />
        <TextInput
          label="Vacancies"
          type="number"
          min={1}
          error={errors.vacancies?.message}
          {...register("vacancies")}
        />
      </div>

      <TextInput
        label="Application deadline"
        type="date"
        error={errors.applicationDeadline?.message}
        {...register("applicationDeadline")}
      />

      <TextArea
        label="Job description"
        rows={5}
        placeholder="What will this person do day to day?"
        error={errors.description?.message}
        {...register("description")}
      />
      <TextArea
        label="Responsibilities"
        rows={4}
        placeholder={"One per line, e.g.\nOwn features end-to-end\nParticipate in code review"}
        error={errors.responsibilities?.message}
        {...register("responsibilities")}
      />
      <TextArea
        label="Requirements"
        rows={4}
        placeholder={"One per line, e.g.\n3+ years experience\nComfortable with React"}
        error={errors.requirements?.message}
        {...register("requirements")}
      />
      <TextArea
        label="Benefits"
        rows={4}
        placeholder={"One per line, e.g.\nHealth insurance\nFlexible schedule"}
        error={errors.benefits?.message}
        {...register("benefits")}
      />

      <PrimaryButton
        type="submit"
        isLoading={isSubmitting || isPending}
        className="mt-2 w-fit"
      >
        {isEditing ? "Save changes" : "Post job"}
      </PrimaryButton>
    </form>
  );
}
