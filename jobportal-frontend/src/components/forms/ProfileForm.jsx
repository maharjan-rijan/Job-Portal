import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Cropper from "react-easy-crop";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import toast from "react-hot-toast";
import { TextInput } from "@/components/ui/TextInput";
import { TextArea } from "@/components/ui/TextArea";
import { FileUpload } from "@/components/ui/FileUpload";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { employerProfileSchema } from "@/lib/validation/employerProfileSchema";
import { seekerProfileSchema } from "@/lib/validation/seekerProfileSchema";
import { profileService } from "@/services/profileService";
import { fileToDataUrl } from "@/utils/fileToDataUrl";
import { useAuth } from "@/hooks/useAuth";

/* -------------------------------------------------------------------------- */
/* Shared helpers                                                             */
/* -------------------------------------------------------------------------- */

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // size of the original picked file
const OUTPUT_SIZE = 512; // cropped images are capped at 512 px on the long side

/**
 * Crops `imageSrc` to `pixelCrop` and returns a (downscaled) File.
 * Use "image/png" to keep transparency (logos), "image/jpeg" for photos.
 */
function getCroppedImg(
  imageSrc,
  pixelCrop,
  {
    maxSize = OUTPUT_SIZE,
    mimeType = "image/jpeg",
    fileName = "image.jpg",
  } = {},
) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const scale = Math.min(
        1,
        maxSize / Math.max(pixelCrop.width, pixelCrop.height),
      );
      const width = Math.round(pixelCrop.width * scale);
      const height = Math.round(pixelCrop.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not create canvas context."));
        return;
      }

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        width,
        height,
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not create cropped image."));
            return;
          }
          resolve(
            new File([blob], fileName, {
              type: mimeType,
              lastModified: Date.now(),
            }),
          );
        },
        mimeType,
        0.92,
      );
    };

    image.onerror = () => reject(new Error("Could not load image."));
    image.src = imageSrc;
  });
}

/**
 * Maps the tri-state file value to an API value:
 * undefined = unchanged (omit key), null = removed, File = data URL.
 */
async function resolveImageValue(file) {
  if (file === null) return null;
  if (file instanceof File) return fileToDataUrl(file);
  return undefined;
}

/** Shared mutation error handler (field errors -> multi-line toast). */
function showProfileError(error) {
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
}

/* -------------------------------------------------------------------------- */
/* Image cropper: hook + panel (used for the avatar and the company logo)    */
/* -------------------------------------------------------------------------- */

const AVATAR_CROP = {
  noun: "photo",
  title: "Adjust your photo",
  aspect: 1,
  cropShape: "round",
  mimeType: "image/jpeg",
  fileName: "profile-avatar.jpg",
};

const LOGO_CROP = {
  noun: "logo",
  title: "Adjust your logo",
  aspect: 1,
  cropShape: "rect",
  mimeType: "image/png", // keeps transparent backgrounds
  fileName: "company-logo.png",
};

/**
 * Owns all state for one cropped image.
 * file: undefined = unchanged, null = removed, File = cropped result.
 */
function useImageCropper(config = AVATAR_CROP) {
  const { noun, title, aspect, cropShape, mimeType, fileName } = config;
  const [avatarFile, setAvatarFile] = useState(undefined);
  const [cropSource, setCropSource] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  const isCropping = Boolean(cropSource);

  // Keep latest URLs for unmount cleanup
  const urlsRef = useRef({ cropSource: null, croppedPreview: null });
  urlsRef.current = { cropSource, croppedPreview };
  useEffect(() => {
    return () => {
      const { cropSource: a, croppedPreview: b } = urlsRef.current;
      if (a) URL.revokeObjectURL(a);
      if (b) URL.revokeObjectURL(b);
    };
  }, []);

  const resetView = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const clearSource = useCallback(() => {
    setCropSource((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setCroppedAreaPixels(null);
    resetView();
  }, [resetView]);

  const clearPreview = useCallback(() => {
    setCroppedPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  // FileUpload onChange: File = new pick, null = removed, undefined = reset
  const handleSelect = useCallback(
    (file) => {
      clearSource();
      clearPreview();

      if (!(file instanceof File)) {
        setAvatarFile(file);
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        setAvatarFile(undefined);
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        toast.error(`The ${noun} must be smaller than 10MB.`);
        setAvatarFile(undefined);
        return;
      }

      // Don't set the file until the crop is applied, so the
      // uncropped original can never be submitted by accident.
      setAvatarFile(undefined);
      setCropSource(URL.createObjectURL(file));
    },
    [clearSource, clearPreview, noun],
  );

  const apply = useCallback(async () => {
    if (!cropSource || !croppedAreaPixels) return;
    try {
      setIsApplying(true);
      const file = await getCroppedImg(cropSource, croppedAreaPixels, {
        mimeType,
        fileName,
      });
      clearPreview();
      setCroppedPreview(URL.createObjectURL(file));
      setAvatarFile(file);
      clearSource();
      toast.success(`Adjustment applied to ${noun}`);
    } catch (error) {
      console.error("Crop error:", error);
      toast.error(`Could not process the ${noun}.`);
    } finally {
      setIsApplying(false);
    }
  }, [
    cropSource,
    croppedAreaPixels,
    clearPreview,
    clearSource,
    mimeType,
    fileName,
    noun,
  ]);

  const cancel = useCallback(() => {
    clearSource();
    clearPreview();
    setAvatarFile(undefined);
  }, [clearSource, clearPreview]);

  /** Call after a successful save: the server now owns the avatar. */
  const reset = useCallback(() => {
    clearSource();
    clearPreview();
    setAvatarFile(undefined);
  }, [clearSource, clearPreview]);

  return {
    avatarFile,
    croppedPreview,
    isCropping,
    handleSelect,
    reset,
    panelProps: {
      source: cropSource,
      title,
      aspect,
      cropShape,
      crop,
      zoom,
      isApplying,
      canApply: Boolean(croppedAreaPixels),
      onCropChange: setCrop,
      onZoomChange: setZoom,
      onCropComplete: (_area, pixels) => setCroppedAreaPixels(pixels),
      onReset: resetView,
      onApply: apply,
      onCancel: cancel,
    },
  };
}

function ImageCropPanel({
  source,
  title,
  aspect,
  cropShape,
  crop,
  zoom,
  isApplying,
  canApply,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onReset,
  onApply,
  onCancel,
}) {
  if (!source) return null;

  return (
    <div className="rounded-2xl border border-primary/10 bg-surface/50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-text">{title}</h3>
          <p className="mt-1 text-xs text-accent">
            Drag and zoom the image to fit the frame.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 rounded-lg border border-primary/10 px-3 py-2 text-xs transition hover:bg-background"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div
        className="relative mx-auto w-full max-w-sm overflow-hidden rounded-xl bg-black"
        style={{ aspectRatio: aspect }}
      >
        <Cropper
          image={source}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          cropShape={cropShape}
          showGrid={false}
          restrictPosition={true}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="mx-auto mt-5 flex max-w-sm items-center gap-3">
        <ZoomOut className="h-4 w-4 text-accent" />
        <input
          type="range"
          min="1"
          max="3"
          step="0.01"
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="flex-1 accent-primary"
          aria-label="Zoom"
        />
        <ZoomIn className="h-4 w-4 text-accent" />
        <span className="w-10 text-right text-xs text-accent">
          {zoom.toFixed(1)}x
        </span>
      </div>

      <div className="mt-5 flex gap-3">
        <PrimaryButton
          type="button"
          onClick={onApply}
          isLoading={isApplying}
          disabled={!canApply}
          className="w-fit"
        >
          Apply adjustment
        </PrimaryButton>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-primary/10 px-4 py-2 text-sm transition hover:bg-background"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/** Image picker + crop panel, shared by the avatar and logo fields. */
function ImageField({ label, cropper, currentUrl, helperText }) {
  return (
    <>
      <FileUpload
        label={label}
        previewUrl={cropper.croppedPreview ?? currentUrl}
        onChange={cropper.handleSelect}
        helperText={helperText}
      />
      <ImageCropPanel {...cropper.panelProps} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Employer form                                                              */
/* -------------------------------------------------------------------------- */

export function EmployerProfileForm({ onSuccess }) {
  const { user, updateUser } = useAuth();
  const avatar = useImageCropper(AVATAR_CROP);
  const logo = useImageCropper(LOGO_CROP);

  const {
    register,
    handleSubmit,
    reset,
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

  // defaultValues only apply on the first render. If `user` (or its company)
  // arrives or changes later, sync the form without wiping what's being typed.
  useEffect(() => {
    if (!user) return;
    reset(
      {
        name: user.name ?? "",
        email: user.email ?? "",
        companyName: user.company?.name ?? "",
        website: user.company?.website ?? "",
        industry: user.company?.industry ?? "",
        location: user.company?.location ?? "",
        description: user.company?.description ?? "",
      },
      { keepDirtyValues: true },
    );
  }, [user, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values) => {
      // undefined => key omitted below, backend keeps the existing image
      const avatarUrl = await resolveImageValue(avatar.avatarFile);
      const logoUrl = await resolveImageValue(logo.avatarFile);

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
      avatar.reset();
      logo.reset();
      toast.success("Profile updated");
      onSuccess?.(updated);
    },
    onError: showProfileError,
  });

  return (
    <form onSubmit={handleSubmit(mutate)} className="flex flex-col gap-5">
      <section>
        <h2 className="text-base font-semibold text-text">Your details</h2>
        <p className="mt-1 text-sm text-accent">
          The contact person on this account.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          <ImageField
            label="Your photo"
            cropper={avatar}
            currentUrl={user?.avatar_url}
            helperText="PNG or JPG — you can drag and zoom to adjust it after choosing. Shown in the topbar and to candidates"
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
          <ImageField
            label="Company logo"
            cropper={logo}
            currentUrl={user?.company?.logo_url}
            helperText="PNG or JPG — you can drag and zoom to adjust it after choosing. Shown to candidates on every job you post"
          />
          <TextArea
            label="Company description"
            rows={5}
            maxLength={1000}
            placeholder="What does your company do? What's it like to work there?"
            error={errors.description?.message}
            {...register("description")}
          />
        </div>
      </section>

      <PrimaryButton
        type="submit"
        isLoading={isSubmitting || isPending}
        disabled={avatar.isCropping || logo.isCropping}
        className="w-fit"
      >
        Save changes
      </PrimaryButton>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* Seeker form                                                                */
/* -------------------------------------------------------------------------- */

export function SeekerProfileForm({ onSuccess }) {
  const { user, updateUser } = useAuth();
  const avatar = useImageCropper(AVATAR_CROP);

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
      const avatarUrl = await resolveImageValue(avatar.avatarFile);

      return profileService.update({
        name: values.name,
        email: values.email,
        ...(avatarUrl !== undefined ? { avatar_url: avatarUrl } : {}),
      });
    },
    onSuccess: (updated) => {
      updateUser(updated);
      avatar.reset();
      toast.success("Profile updated");
      onSuccess?.(updated);
    },
    onError: showProfileError,
  });

  return (
    <form onSubmit={handleSubmit(mutate)} className="flex flex-col gap-5">
      <ImageField
        label="Your photo"
        cropper={avatar}
        currentUrl={user?.avatar_url}
        helperText="PNG or JPG — you can drag and zoom to adjust it after choosing. Shown on your resume and to employers"
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
        disabled={avatar.isCropping}
        className="w-fit"
      >
        Save changes
      </PrimaryButton>
    </form>
  );
}
