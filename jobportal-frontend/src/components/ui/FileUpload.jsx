import { useRef, useState } from "react";
import { FileText, ImagePlus, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { ImageCropper } from "@/components/ui/ImageCropper";

export function FileUpload({
  label,
  previewUrl,
  onChange,
  error,
  accept = "image/*",
  maxSizeMB = 2,
  helperText,
  // Opt-in: open a crop/zoom/rotate dialog for images before accepting
  // them. The parent still just receives a File (a cropped JPEG).
  crop = false,
  cropShape = "round",
  cropOutput = "jpeg",
}) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [sizeError, setSizeError] = useState(null);
  const [cropSource, setCropSource] = useState(null); // original file being cropped
  const [cropOpen, setCropOpen] = useState(false);

  const resolvedPreview = localPreview ?? previewUrl;
  const hasSelection = Boolean(resolvedPreview || fileName);

  // Cropping shrinks the result, so allow a bigger source photo.
  const limitMB = crop ? Math.max(maxSizeMB, 10) : maxSizeMB;

  const accept_ = (file) => {
    setFileName(file.name);
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(
      file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    );
    onChange?.(file);
  };

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > limitMB * 1024 * 1024) {
      setSizeError(
        `That file is too large — please choose one under ${limitMB}MB.`,
      );
      return;
    }
    setSizeError(null);

    if (crop && file.type.startsWith("image/")) {
      setCropSource(file);
      setCropOpen(true);
      return;
    }
    accept_(file);
  };

  const handleRemove = () => {
    setSizeError(null);
    setCropSource(null);
    setLocalPreview(null);
    setFileName(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-sm font-medium text-primary">{label}</span>
      )}

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          handleFile(event.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex items-center gap-4 rounded-lg border-2 border-dashed p-4 transition-colors",
          dragActive ? "border-secondary bg-secondary/5" : "border-primary/20",
          error && "border-red-400",
        )}
      >
        {resolvedPreview ? (
          <img
            src={resolvedPreview}
            alt=""
            className={cn(
              "h-16 w-16 shrink-0 border border-primary/10 object-cover",
              crop && cropShape === "round" ? "rounded-full" : "rounded-lg",
            )}
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-accent">
            {fileName ? (
              <FileText className="h-6 w-6" />
            ) : (
              <ImagePlus className="h-6 w-6" />
            )}
          </div>
        )}

        <div className="flex flex-1 flex-col gap-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-fit text-sm font-medium text-secondary hover:underline"
          >
            {hasSelection ? "Change file" : "Click to upload"}
            <span className="font-normal text-accent"> or drag and drop</span>
          </button>
          {crop && cropSource && (
            <button
              type="button"
              onClick={() => setCropOpen(true)}
              className="w-fit text-xs font-medium text-secondary hover:underline"
            >
              Adjust crop
            </button>
          )}
          {fileName && !resolvedPreview && (
            <p className="truncate text-xs text-text" title={fileName}>
              {fileName}
            </p>
          )}
          <p className="text-xs text-accent">
            {helperText ?? `Up to ${maxSizeMB}MB`}
          </p>
        </div>

        {hasSelection && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove file"
            className="shrink-0 text-accent hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            // Allow picking the same file again after cancelling/cropping.
            event.target.value = "";
          }}
          className="hidden"
        />
      </div>

      {(error || sizeError) && (
        <p className="text-xs text-red-600">{error ?? sizeError}</p>
      )}

      {crop && (
        <ImageCropper
          open={cropOpen}
          file={cropSource}
          shape={cropShape}
          outputType={cropOutput}
          onCancel={() => setCropOpen(false)}
          onConfirm={(cropped) => {
            setCropOpen(false);
            accept_(cropped);
          }}
        />
      )}
    </div>
  );
}
