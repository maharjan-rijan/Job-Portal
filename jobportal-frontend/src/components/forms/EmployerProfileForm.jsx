import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { TextInput } from "@/components/ui/TextInput";
import { TextArea } from "@/components/ui/TextArea";
import { FileUpload } from "@/components/ui/FileUpload";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { employerProfileSchema } from "@/lib/validation/employerProfileSchema";
import { profileService } from "@/services/profileService";
import { fileToDataUrl } from "@/utils/fileToDataUrl";
import { useAuth } from "@/hooks/useAuth";

export function EmployerProfileForm({ onSuccess }) {
  const { user, updateUser } = useAuth();
  const [logoFile, setLogoFile] = useState(undefined);
  const [avatarFile, setAvatarFile] = useState(undefined);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(employerProfileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      companyName: user?.company?.name ?? "",
      website: user?.company?.website ?? "",
      industry: user?.company?.industry ?? "",
      location: user?.company?.location ?? "",
      description: user?.company?.description ?? "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values) => {
      let logoUrl;
      if (logoFile === null) {
        logoUrl = null;
      } else if (logoFile instanceof File) {
        logoUrl = await fileToDataUrl(logoFile);
      }
      // else: undefined — key omitted below, backend keeps the existing logo
      let avatarUrl;
      if (avatarFile === null) {
        avatarUrl = null;
      } else if (avatarFile instanceof File) {
        avatarUrl = await fileToDataUrl(avatarFile);
      }
      return profileService.update({
        name: values.name,
        email: values.email,
        ...(avatarUrl !== undefined ? { avatar_url: avatarUrl } : {}),
        company: {
          name: values.companyName,
          website: values.website || null,
          industry: values.industry || null,
          location: values.location || null,
          description: values.description || null,
          ...(logoUrl !== undefined ? { logo_url: logoUrl } : {}),
        },
      });
    },
    onSuccess: (updated) => {
      updateUser(updated);
      toast.success("Profile updated");
      onSuccess?.(updated);
    },
    onError: (error) => {
      const errors = error.response?.data?.errors;

      if (errors) {
        const message = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");

        toast.error(message, { duration: 6000 });
        return;
      }

      toast.error(
        error.response?.data?.message ??
          error.message ??
          "Could not update your profile",
      );
    },
  });

  return (
    <form onSubmit={handleSubmit(mutate)} className="flex flex-col gap-5">
      <section>
        <h2 className="text-base font-semibold text-text">Your details</h2>
        <p className="mt-1 text-sm text-accent">
          The contact person on this account.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          <FileUpload
            label="Your photo"
            previewUrl={user?.avatar_url}
            onChange={setAvatarFile}
            helperText="PNG or JPG, up to 2MB — shown in the topbar and to candidates"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Full name"
              placeholder="Jane Doe"
              error={errors.name?.message}
              {...register("name")}
            />
            <TextInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-primary/10 pt-6">
        <h2 className="text-base font-semibold text-text">Company</h2>
        <p className="mt-1 text-sm text-accent">
          Shown to candidates on every job you post.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Company name"
              placeholder="Acme Inc."
              error={errors.companyName?.message}
              {...register("companyName")}
            />
            <TextInput
              label="Website"
              placeholder="https://acme.com"
              error={errors.website?.message}
              {...register("website")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Industry"
              placeholder="e.g. Software"
              error={errors.industry?.message}
              {...register("industry")}
            />
            <TextInput
              label="Location"
              placeholder="e.g. New York, USA"
              error={errors.location?.message}
              {...register("location")}
            />
          </div>
          <FileUpload
            label="Company logo"
            previewUrl={user?.company?.logo_url}
            onChange={setLogoFile}
            helperText="PNG or JPG, up to 2MB"
          />
          <TextArea
            label="Company description"
            rows={5}
            placeholder="What does your company do? What's it like to work there?"
            error={errors.description?.message}
            {...register("description")}
          />
        </div>
      </section>

      <PrimaryButton
        type="submit"
        isLoading={isSubmitting || isPending}
        className="w-fit"
      >
        Save changes
      </PrimaryButton>
    </form>
  );
}
