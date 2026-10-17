import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

const STAGE = 288; // on-screen crop viewport, px (square)
const MAX_ZOOM = 4;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image"));
    };
    img.src = url;
  });
}

/** Returns a canvas holding `img` rotated clockwise by `deg` (0/90/180/270). */
function rotateToCanvas(img, deg) {
  const swap = deg % 180 !== 0;
  const canvas = document.createElement("canvas");
  canvas.width = swap ? img.height : img.width;
  canvas.height = swap ? img.width : img.height;
  const ctx = canvas.getContext("2d");
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((deg * Math.PI) / 180);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  return canvas;
}

/**
 * Crop dialog: drag to reposition, slider / mouse wheel to zoom, button
 * to rotate. Dependency-free (plain canvas). Calls `onConfirm(File)` with a
 * square JPEG (`outputSize` px) so the saved avatar is small and uniform —
 * the parent keeps using its existing File -> fileToDataUrl() flow.
 */
export function ImageCropper({
  file,
  open,
  onCancel,
  onConfirm,
  shape = "round",
  outputSize = 512,
  // "jpeg" (small, white background) for photos; "png" keeps transparency (logos).
  outputType = "jpeg",
}) {
  const mime = outputType === "png" ? "image/png" : "image/jpeg";
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const drag = useRef(null);

  const [source, setSource] = useState(null); // original decoded image
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // image centre vs stage centre
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Decode the picked file whenever the dialog opens with a new one.
  useEffect(() => {
    if (!open || !file) return;
    let cancelled = false;
    setSource(null);
    setError(null);
    setRotation(0);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    loadImage(file)
      .then((img) => !cancelled && setSource(img))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [open, file]);

  const [rotated, setRotated] = useState(null);
  useEffect(() => {
    setRotated(source ? rotateToCanvas(source, rotation) : null);
  }, [source, rotation]);

  // Keep the crop window fully covered by the image.
  const clamp = useCallback(
    (pos, z) => {
      if (!rotated) return pos;
      const base = STAGE / Math.min(rotated.width, rotated.height);
      const maxX = Math.max(0, (rotated.width * base * z - STAGE) / 2);
      const maxY = Math.max(0, (rotated.height * base * z - STAGE) / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, pos.x)),
        y: Math.min(maxY, Math.max(-maxY, pos.y)),
      };
    },
    [rotated],
  );

  // Re-clamp after zoom/rotation changes.
  useEffect(() => {
    setOffset((o) => clamp(o, zoom));
  }, [zoom, clamp]);

  // Draw preview.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !rotated) return;
    const ctx = canvas.getContext("2d");
    const base = STAGE / Math.min(rotated.width, rotated.height);
    const scale = base * zoom;
    const dw = rotated.width * scale;
    const dh = rotated.height * scale;
    ctx.clearRect(0, 0, STAGE, STAGE);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, STAGE, STAGE); // preview only; PNG export stays transparent
    ctx.drawImage(
      rotated,
      STAGE / 2 + offset.x - dw / 2,
      STAGE / 2 + offset.y - dh / 2,
      dw,
      dh,
    );
  }, [rotated, zoom, offset]);

  // Wheel zoom — needs a non-passive listener to stop the page scrolling.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      setZoom((z) => Math.min(MAX_ZOOM, Math.max(1, z - e.deltaY * 0.0015)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open, rotated]);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, start: offset };
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    setOffset(
      clamp(
        { x: drag.current.start.x + dx, y: drag.current.start.y + dy },
        zoom,
      ),
    );
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const handleSave = () => {
    if (!rotated) return;
    setSaving(true);
    const out = document.createElement("canvas");
    out.width = outputSize;
    out.height = outputSize;
    const ctx = out.getContext("2d");
    const ratio = outputSize / STAGE;
    const base = STAGE / Math.min(rotated.width, rotated.height);
    const dw = rotated.width * base * zoom * ratio;
    const dh = rotated.height * base * zoom * ratio;
    if (mime === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outputSize, outputSize);
    }
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      rotated,
      outputSize / 2 + offset.x * ratio - dw / 2,
      outputSize / 2 + offset.y * ratio - dh / 2,
      dw,
      dh,
    );
    out.toBlob(
      (blob) => {
        setSaving(false);
        if (!blob) {
          setError("Could not crop this image. Try a different one.");
          return;
        }
        const name =
          (file?.name ?? "photo").replace(/\.[^.]+$/, "") +
          `-cropped.${mime === "image/png" ? "png" : "jpg"}`;
        onConfirm(new File([blob], name, { type: mime }));
      },
      mime,
      0.9,
    );
  };

  const round = shape === "round";

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={outputType === "png" ? "Crop your logo" : "Crop your photo"}
    >
      <div className="flex flex-col items-center gap-4">
        {error ? (
          <p className="py-8 text-sm text-red-600">{error}</p>
        ) : (
          <>
            <div
              ref={stageRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="relative cursor-grab touch-none select-none overflow-hidden rounded-lg bg-primary/10 active:cursor-grabbing"
              style={{ width: STAGE, height: STAGE }}
            >
              <canvas
                ref={canvasRef}
                width={STAGE}
                height={STAGE}
                className="block"
              />
              {/* Dims everything outside the crop shape. */}
              <div
                className={`pointer-events-none absolute inset-0 border-2 border-white ${round ? "rounded-full" : ""}`}
                style={{ boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)" }}
              />
            </div>

            <div className="flex w-full max-w-[288px] items-center gap-3">
              <ZoomOut className="h-4 w-4 shrink-0 text-accent" />
              <input
                type="range"
                min={1}
                max={MAX_ZOOM}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                aria-label="Zoom"
                className="w-full accent-secondary"
              />
              <ZoomIn className="h-4 w-4 shrink-0 text-accent" />
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                aria-label="Rotate 90 degrees"
                title="Rotate"
                className="shrink-0 rounded-md p-1.5 text-accent hover:bg-primary/5 hover:text-primary"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-accent">
              Drag to move · scroll or use the slider to zoom
            </p>
          </>
        )}

        <div className="flex w-full justify-end gap-2">
          <SecondaryButton type="button" onClick={onCancel}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="button"
            onClick={handleSave}
            isLoading={saving}
            disabled={!rotated || Boolean(error)}
          >
            Apply
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
