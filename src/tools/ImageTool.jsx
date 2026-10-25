
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Download,
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
} from "lucide-react";


import { downloadBlob, formatBytes } from "../utils/image.js";

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_DIMENSION = 10000;
const MAX_PIXELS = 40_000_000;

const inputClass =
  "w-full rounded-xl border border-slate-700 bg-[#0b1422] px-4 py-3.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10";

export default function ImageTool({ resize = false }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [quality, setQuality] = useState(75);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [originalSize, setOriginalSize] = useState({
    width: 800,
    height: 600,
  });
  const [keepRatio, setKeepRatio] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef(null);
  const currentFileRef = useRef(0);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  async function loadFile(next) {
    if (!next) return;

    if (!next.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (next.size > MAX_FILE_SIZE) {
      setError("Maximum image size is 25 MB.");
      return;
    }

    const requestId = ++currentFileRef.current;
    setError("");
    setProcessing(false);

    const url = URL.createObjectURL(next);

    try {
      const image = new window.Image();
      image.src = url;
      await image.decode();

      const w = image.naturalWidth;
      const h = image.naturalHeight;

      if (
        !w ||
        !h ||
        w > MAX_DIMENSION ||
        h > MAX_DIMENSION ||
        w * h > MAX_PIXELS
      ) {
        throw new Error(
          "Image dimensions are too large. Maximum processing area is 40 megapixels."
        );
      }

      if (requestId !== currentFileRef.current) {
        URL.revokeObjectURL(url);
        return;
      }

      setFile(next);
      setPreview(url);
      setWidth(w);
      setHeight(h);
      setOriginalSize({ width: w, height: h });
      setResult(null);
    } catch (err) {
      URL.revokeObjectURL(url);

      if (requestId === currentFileRef.current) {
        setError(
          err.message ||
            "Unable to load this image. Try another file."
        );
      }
    }
  }

  function updateWidth(value) {
    const next = Number(value);
    setWidth(value === "" ? "" : next);
    setResult(null);

    if (keepRatio && originalSize.width > 0 && next > 0) {
      setHeight(
        Math.max(
          1,
          Math.round(
            next * originalSize.height / originalSize.width
          )
        )
      );
    }
  }

  function updateHeight(value) {
    const next = Number(value);
    setHeight(value === "" ? "" : next);
    setResult(null);

    if (keepRatio && originalSize.height > 0 && next > 0) {
      setWidth(
        Math.max(
          1,
          Math.round(
            next * originalSize.width / originalSize.height
          )
        )
      );
    }
  }

  function resetDimensions() {
    setWidth(originalSize.width);
    setHeight(originalSize.height);
    setResult(null);
    setError("");
  }

  function resetAll() {
    currentFileRef.current += 1;
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");
    setProcessing(false);
    setWidth(800);
    setHeight(600);
    setOriginalSize({ width: 800, height: 600 });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function processImage() {
    if (!file || !preview || processing) return;

    const requestId = currentFileRef.current;
    setError("");
    setProcessing(true);
    setResult(null);

    try {
      const image = new window.Image();
      image.src = preview;
      await image.decode();

      const w = resize ? Number(width) : image.naturalWidth;
      const h = resize ? Number(height) : image.naturalHeight;

      if (
        !Number.isInteger(w) ||
        !Number.isInteger(h) ||
        w < 1 ||
        h < 1 ||
        w > MAX_DIMENSION ||
        h > MAX_DIMENSION ||
        w * h > MAX_PIXELS
      ) {
        throw new Error(
          "Enter valid dimensions up to 10,000 pixels per side and 40 megapixels total."
        );
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Unable to create image canvas.");
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const outputType =
        file.type === "image/png"
          ? "image/png"
          : "image/jpeg";

      if (outputType === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
      }

      ctx.drawImage(image, 0, 0, w, h);

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (nextBlob) => {
            if (nextBlob) resolve(nextBlob);
            else reject(new Error("Image conversion failed."));
          },
          outputType,
          quality / 100
        );
      });

      if (requestId !== currentFileRef.current) return;

      const url = URL.createObjectURL(blob);

      setResult({
        url,
        blob,
        size: blob.size,
        width: w,
        height: h,
      });
    } catch (err) {
      if (requestId === currentFileRef.current) {
        setError(
          err.message ||
            "Could not process the image. Please try again."
        );
      }
    } finally {
      if (requestId === currentFileRef.current) {
        setProcessing(false);
      }
    }
  }

  const saving =
    file && result
      ? Math.round((1 - result.size / file.size) * 100)
      : 0;

  return (
    <div className="space-y-7">
      {/* Introduction */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white sm:text-xl">
            {resize ? "Resize your image" : "Compress your image"}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {resize
              ? "Set your preferred dimensions and download the result."
              : "Optimize images directly in your browser."}
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
          <Lock size={13} />
          Browser processing
        </span>
      </div>

      {/* Upload area */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Choose an image to upload"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          loadFile(event.dataTransfer.files?.[0]);
        }}
        className={`group flex min-h-[230px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-9 text-center transition-all duration-300 focus-visible:outline-2 focus-visible:outline-cyan-400 ${
          dragging
            ? "border-cyan-400 bg-cyan-400/10"
            : "border-slate-700 bg-[#0b1422] hover:border-cyan-400/60 hover:bg-cyan-400/[0.04]"
        }`}
      >
        <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition group-hover:scale-105">
          <UploadCloud size={30} />
        </div>

        <h3 className="text-base font-semibold text-white">
          {file ? "Change your image" : "Drop your image here"}
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          or click to browse your files
        </p>

        <span className="mt-5 rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-slate-300">
          Choose image
        </span>

        <p className="mt-4 text-xs text-slate-500">
          JPG, PNG, WebP and browser-supported images · Max 25 MB
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => loadFile(event.target.files?.[0])}
        />
      </div>

      {/* Original preview */}
      {file && (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1422]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <ImageIcon size={17} className="text-cyan-300" />
              Original image
            </div>

            <button
              type="button"
              onClick={resetAll}
              className="text-xs text-slate-400 transition hover:text-red-300"
            >
              Remove
            </button>
          </div>

          <div className="flex flex-col items-center gap-5 p-5 sm:flex-row">
            <div className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#070d17] sm:w-48">
              <img
                src={preview}
                alt="Original preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="w-full min-w-0 space-y-3">
              <h4 className="break-all text-sm font-semibold text-white">
                {file.name}
              </h4>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg bg-white/[0.05] px-3 py-1.5 text-xs text-slate-400">
                  {formatBytes(file.size)}
                </span>
                <span className="rounded-lg bg-white/[0.05] px-3 py-1.5 text-xs text-slate-400">
                  {originalSize.width} × {originalSize.height} px
                </span>
                <span className="rounded-lg bg-white/[0.05] px-3 py-1.5 text-xs text-slate-400">
                  {file.type.split("/")[1]?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      {file && (
        <div className="space-y-5 rounded-2xl border border-white/10 bg-[#0d1726] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              {resize ? "Image dimensions" : "Compression settings"}
            </h3>

            {resize && (
              <button
                type="button"
                onClick={resetDimensions}
                className="inline-flex items-center gap-2 text-xs font-medium text-cyan-300 transition hover:text-cyan-200"
              >
                <RefreshCw size={14} />
                Reset
              </button>
            )}
          </div>

          {resize ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-medium text-slate-300">
                    Width (px)
                  </span>
                  <input
                    type="number"
                    min="1"
                    max={MAX_DIMENSION}
                    value={width}
                    onChange={(event) =>
                      updateWidth(event.target.value)
                    }
                    className={inputClass}
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-medium text-slate-300">
                    Height (px)
                  </span>
                  <input
                    type="number"
                    min="1"
                    max={MAX_DIMENSION}
                    value={height}
                    onChange={(event) =>
                      updateHeight(event.target.value)
                    }
                    className={inputClass}
                  />
                </label>
              </div>

              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={keepRatio}
                  onChange={(event) =>
                    setKeepRatio(event.target.checked)
                  }
                  className="h-4 w-4 accent-cyan-400"
                />
                Preserve aspect ratio
              </label>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="image-quality"
                  className="text-sm text-slate-300"
                >
                  Image quality
                </label>

                <span className="rounded-lg bg-cyan-400/10 px-3 py-1.5 text-sm font-bold text-cyan-300">
                  {quality}%
                </span>
              </div>

              <input
                id="image-quality"
                type="range"
                min="10"
                max="100"
                step="5"
                value={quality}
                disabled={file.type === "image/png"}
                onChange={(event) => {
                  setQuality(Number(event.target.value));
                  setResult(null);
                }}
                className="w-full accent-cyan-400 disabled:opacity-40"
              />

              <div className="flex justify-between text-xs text-slate-500">
                <span>Smaller file</span>
                <span>Higher quality</span>
              </div>

              {file.type === "image/png" && (
                <p className="text-xs leading-5 text-amber-300/90">
                  PNG uses lossless encoding. The quality slider
                  does not affect PNG output; for smaller files,
                  try a JPEG image.
                </p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={processImage}
            disabled={processing}
            className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-4 text-sm font-bold text-slate-950 shadow-[0_12px_35px_rgba(34,211,238,0.13)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {resize ? "Resize image" : "Compress image"}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      )}

      {/* Errors */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-4 text-sm leading-6 text-red-300"
        >
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result */}
      {result && file && (
        <div className="overflow-hidden rounded-2xl border border-emerald-400/20 bg-[#0b1824]">
          <div className="flex items-center gap-2 border-b border-emerald-400/10 bg-emerald-400/[0.04] px-5 py-4 text-sm font-semibold text-emerald-300">
            <CheckCircle2 size={19} />
            Image processed successfully
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <div className="flex justify-center rounded-xl bg-[#070d17] p-5">
              <img
                src={result.url}
                alt="Processed result"
                className="max-h-80 max-w-full object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <span className="text-xs text-slate-400">
                  Original size
                </span>
                <p className="mt-2 text-lg font-bold text-white">
                  {formatBytes(file.size)}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <span className="text-xs text-slate-400">
                  Output size
                </span>
                <p className="mt-2 text-lg font-bold text-cyan-300">
                  {formatBytes(result.size)}
                </p>
              </div>

              <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:col-span-1">
                <span className="text-xs text-slate-400">
                  {resize ? "Dimensions" : "Size reduction"}
                </span>
                <p className="mt-2 text-lg font-bold text-white">
                  {resize
                    ? `${result.width} × ${result.height}`
                    : saving >= 0
                      ? `${saving}%`
                      : "Larger output"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                downloadBlob(
                  result.blob,
                  `${file.name.replace(/\.[^.]+$/, "")}-${
                    resize ? "resized" : "compressed"
                  }.${
                    result.blob.type === "image/png"
                      ? "png"
                      : "jpg"
                  }`
                )
              }
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-4 text-sm font-bold text-slate-950 transition hover:brightness-110"
            >
              <Download size={19} />
              Download image
            </button>
          </div>
        </div>
      )}

      {/* Privacy note */}
      <p className="text-center text-xs leading-6 text-slate-500">
        Your image is processed locally in your browser.
        No server upload is required.
      </p>
    </div>
  );
}
