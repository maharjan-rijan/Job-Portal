import { useRef, useState } from "react";
import { FileText, ImagePlus, X } from "lucide-react";
import { cn } from "@/utils/cn";

export function FileUpload({
  label,
  previewUrl,
  onChange,
  error,
  accept = "image/*",
  maxSizeMB = 2,
  helperText,
}) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);
  const [fileName, setFileName] = useState(null);

  const resolvedPreview = localPreview ?? previewUrl;
  const hasSelection = Boolean(resolvedPreview || fileName);

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > maxSizeMB * 1024 * 1024) return;

    setFileName(file.name);
    setLocalPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
    onChange?.(file);
  };

  const handleRemove = () => {
    setLocalPreview(null);
    setFileName(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-primary">{label}</span>}

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
          error && "border-red-400"
        )}
      >
        {resolvedPreview ? (
          <img
            src={resolvedPreview}
            alt=""
            className="h-16 w-16 shrink-0 rounded-lg border border-primary/10 object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-accent">
            {fileName ? <FileText className="h-6 w-6" /> : <ImagePlus className="h-6 w-6" />}
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
          {fileName && !resolvedPreview && (
            <p className="truncate text-xs text-text" title={fileName}>
              {fileName}
            </p>
          )}
          <p className="text-xs text-accent">{helperText ?? `Up to ${maxSizeMB}MB`}</p>
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
          onChange={(event) => handleFile(event.target.files?.[0])}
          className="hidden"
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}