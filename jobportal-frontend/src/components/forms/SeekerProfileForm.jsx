import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { TextInput } from "@/components/ui/TextInput";
import { FileUpload } from "@/components/ui/FileUpload";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { seekerProfileSchema } from "@/lib/validation/seekerProfileSchema";
import { profileService } from "@/services/profileService";
import { fileToDataUrl } from "@/utils/fileToDataUrl";
import { useAuth } from "@/hooks/useAuth";

export function SeekerProfileForm({ onSuccess }) {
  const { user, updateUser } = useAuth();

  // undefined = leave existing avatar untouched, null = removed, File = newly picked.
  const [avatarFile, setAvatarFile] = useState(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(seekerProfileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values) => {
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
      });
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
      <FileUpload
        label="Your photo"
        previewUrl={user?.avatar_url}
        onChange={setAvatarFile}
        helperText="PNG or JPG, up to 2MB — shown on your resume and to employers"
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
