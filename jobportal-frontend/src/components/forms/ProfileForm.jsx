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

// Seekers only edit name/email/photo, so their schema is just those
// two fields of the employer one — no second schema file to keep in sync.
const seekerProfileSchema = employerProfileSchema.pick({
  name: true,
  email: true,
});

const AVATAR_HELP = {
  seeker:
    "PNG or JPG — you can crop and zoom after choosing. Shown on your resume and to employers",
  employer:
    "PNG or JPG — you can crop and zoom after choosing. Shown in the topbar and to candidates",
};

/**
 * Account profile form for both roles.
 *
 *  - variant="seeker":   name, email, photo
 *  - variant="employer": the same, plus a Company section (name, website,
 *    industry, location, logo, description)
 *
 * Both talk to PUT /profile; `company` is only sent for employers.
 * Photo/logo state convention: `undefined` = leave untouched, `null` =
 * removed, `File` = newly picked (converted to a data URL on submit).
 */
export function ProfileForm({ variant = "seeker", onSuccess }) {
  const isEmployer = variant === "employer";
  const { user, updateUser } = useAuth();

  const [avatarFile, setAvatarFile] = useState(undefined);
  const [logoFile, setLogoFile] = useState(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(
      isEmployer ? employerProfileSchema : seekerProfileSchema,
    ),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      ...(isEmployer && {
        companyName: user?.company?.name ?? "",
        website: user?.company?.website ?? "",
        industry: user?.company?.industry ?? "",
        location: user?.company?.location ?? "",
        description: user?.company?.description ?? "",
      }),
    },
  });

  // undefined → omit key (backend keeps existing), null → clear, File → data URL
  const resolveImage = async (file) => {
    if (file === null) return null;
    if (file instanceof File) return fileToDataUrl(file);
    return undefined;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (values) => {
      const avatarUrl = await resolveImage(avatarFile);
      const payload = {
        name: values.name,
        email: values.email,
        ...(avatarUrl !== undefined ? { avatar_url: avatarUrl } : {}),
      };

      if (isEmployer) {
        const logoUrl = await resolveImage(logoFile);
        payload.company = {
          name: values.companyName,
          website: values.website || null,
          industry: values.industry || null,
          location: values.location || null,
          description: values.description || null,
          ...(logoUrl !== undefined ? { logo_url: logoUrl } : {}),
        };
      }

      return profileService.update(payload);
    },
    onSuccess: (updated) => {
      updateUser(updated);
      toast.success("Profile updated");
      onSuccess?.(updated);
    },
    onError: (error) => {
      toast.error(error.message ?? "Could not update your profile");
    },
  });

  return (
    <form onSubmit={handleSubmit(mutate)} className="flex flex-col gap-5">
      <section>
        {isEmployer && (
          <>
            <h2 className="text-base font-semibold text-text">Your details</h2>
            <p className="mt-1 text-sm text-accent">
              The contact person on this account.
            </p>
          </>
        )}
        <div
          className={
            isEmployer ? "mt-4 flex flex-col gap-4" : "flex flex-col gap-4"
          }
        >
          <FileUpload
            label="Your photo"
            previewUrl={user?.avatar_url}
            onChange={setAvatarFile}
            crop
            helperText={AVATAR_HELP[variant]}
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

      {isEmployer && (
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
              crop
              cropShape="rect"
              cropOutput="png"
              helperText="PNG or JPG — you can crop and zoom after choosing. Transparent backgrounds are kept"
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
      )}

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
