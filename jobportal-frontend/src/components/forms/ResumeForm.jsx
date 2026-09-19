import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { TextArea } from "@/components/ui/TextArea";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { resumeSchema } from "@/lib/validation/resumeSchema";
import { resumeService } from "@/services/resumeService";
import { useAuth } from "@/hooks/useAuth";

export function ResumeForm() {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      title: "",
      location: "",
      website: "",
      expectedSalary: "",
      degree: "",
      fieldOfStudy: "",
      school: "",
      educationFrom: "",
      educationTo: "",
      educationDescription: "",
      companyName: "",
      jobTitle: "",
      experienceFrom: "",
      experienceTo: "",
      experienceDescription: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: resumeService.save,
    onSuccess: () => toast.success("Resume saved"),
    onError: (error) => toast.error(error.message ?? "Could not save resume"),
  });

  return (
    <form onSubmit={handleSubmit(mutate)} className="flex flex-col gap-6">
      <Card>
        <h2 className="text-base font-semibold text-text">Basic information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Name"
            error={errors.name?.message}
            {...register("name")}
          />
          <TextInput
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <TextInput
            label="Professional title"
            placeholder="e.g. Front-end Developer"
            error={errors.title?.message}
            {...register("title")}
          />
          <TextInput
            label="Location"
            placeholder="City, Country"
            error={errors.location?.message}
            {...register("location")}
          />
          <TextInput
            label="Website"
            placeholder="https://your-portfolio.com"
            error={errors.website?.message}
            {...register("website")}
          />
          <TextInput
            label="Expected salary"
            placeholder="e.g. $60,000/yr"
            error={errors.expectedSalary?.message}
            {...register("expectedSalary")}
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-text">Education</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Degree"
            placeholder="e.g. Bachelor's"
            error={errors.degree?.message}
            {...register("degree")}
          />
          <TextInput
            label="Field of study"
            placeholder="e.g. Computer Science"
            error={errors.fieldOfStudy?.message}
            {...register("fieldOfStudy")}
          />
          <TextInput
            label="School"
            error={errors.school?.message}
            {...register("school")}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="From"
              placeholder="2018"
              error={errors.educationFrom?.message}
              {...register("educationFrom")}
            />
            <TextInput
              label="To"
              placeholder="2022"
              error={errors.educationTo?.message}
              {...register("educationTo")}
            />
          </div>
        </div>
        <div className="mt-4">
          <TextArea
            label="Description (optional)"
            error={errors.educationDescription?.message}
            {...register("educationDescription")}
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-text">Work experience</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Company name"
            error={errors.companyName?.message}
            {...register("companyName")}
          />
          <TextInput
            label="Job title"
            error={errors.jobTitle?.message}
            {...register("jobTitle")}
          />
          <div className="grid grid-cols-2 gap-4 sm:col-span-2">
            <TextInput
              label="From"
              placeholder="2022"
              error={errors.experienceFrom?.message}
              {...register("experienceFrom")}
            />
            <TextInput
              label="To"
              placeholder="Present"
              error={errors.experienceTo?.message}
              {...register("experienceTo")}
            />
          </div>
        </div>
        <div className="mt-4">
          <TextArea
            label="Description (optional)"
            error={errors.experienceDescription?.message}
            {...register("experienceDescription")}
          />
        </div>
      </Card>

      <PrimaryButton type="submit" isLoading={isPending} className="w-fit">
        Save resume
      </PrimaryButton>
    </form>
  );
}
