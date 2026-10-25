
import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import {
  FileImage,
  UploadCloud,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileCheck2,
  AlertCircle,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

const MAX_FILES = 20;
const MAX_SIZE = 15 * 1024 * 1024;
const MAX_SIDE = 1600;

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image could not be loaded."));
    image.src = url;
  });
}

async function imageToJPEG(url) {
  const image = await loadImage(url);

  const scale = Math.min(
    1,
    MAX_SIDE / Math.max(image.naturalWidth, image.naturalHeight)
  );

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to process the image.");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return {
    data: canvas.toDataURL("image/jpeg", 0.85),
    width: canvas.width,
    height: canvas.height,
  };
}

export default function ImageToPDF() {
  const [images, setImages] = useState([]);
  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState("portrait");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const inputRef = useRef(null);
  const imagesRef = useRef([]);

  // Keep the latest files available for unmount cleanup.
  imagesRef.current = images;

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((item) => {
        URL.revokeObjectURL(item.url);
      });
    };
  }, []);

  function addFiles(files) {
    if (processing) return;

    const selected = Array.from(files || []);
    if (!selected.length) return;

    setError("");

    const available = MAX_FILES - images.length;

    if (available <= 0) {
      setError(`Maximum ${MAX_FILES} images allowed.`);
      return;
    }

    if (selected.length > available) {
      setError(
        `Only ${available} additional image(s) can be added.`
      );
      return;
    }

    const invalid = selected.find(
      (file) =>
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > MAX_SIZE
    );

    if (invalid) {
      setError(
        "Use JPG, PNG, or WebP images, each no larger than 15 MB."
      );
      return;
    }

    const additions = selected.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));

    setImages((previous) => [...previous, ...additions]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function removeImage(id) {
    if (processing) return;

    const item = images.find((image) => image.id === id);

    if (!item) return;

    setImages((previous) =>
      previous.filter((image) => image.id !== id)
    );

    URL.revokeObjectURL(item.url);
  }

  function moveImage(index, direction) {
    if (processing) return;

    const target = index + direction;

    if (target < 0 || target >= images.length) return;

    setImages((previous) => {
      const next = [...previous];
      [next[index], next[target]] = [
        next[target],
        next[index],
      ];
      return next;
    });
  }

  function clearImages() {
    if (processing) return;

    images.forEach((item) => URL.revokeObjectURL(item.url));
    setImages([]);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function generatePDF() {
    if (!images.length || processing) return;

    setProcessing(true);
    setError("");

    try {
      const pdf = new jsPDF({
        orientation,
        unit: "mm",
        format: pageSize,
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;

      for (let index = 0; index < images.length; index++) {
        const image = await imageToJPEG(images[index].url);

        if (index > 0) {
          pdf.addPage(pageSize, orientation);
        }

        const scale = Math.min(
          availableWidth / image.width,
          availableHeight / image.height
        );

        const width = image.width * scale;
        const height = image.height * scale;

        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;

        pdf.addImage(
          image.data,
          "JPEG",
          x,
          y,
          width,
          height,
          undefined,
          "FAST"
        );
      }

      pdf.save("toolverse-images.pdf");
    } catch (err) {
      setError(
        err.message ||
          "PDF generation failed. Try smaller images."
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <FileImage size={22} className="text-cyan-300" />
          Image to PDF Converter
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Combine your images into a PDF, with one image per page.
        </p>
      </div>

      {/* Upload */}
      <div
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
          addFiles(event.dataTransfer.files);
        }}
        className={`rounded-2xl border-2 border-dashed p-7 text-center transition sm:p-10 ${
          dragging
            ? "border-cyan-400 bg-cyan-400/10"
            : "border-white/15 bg-[#0b1422] hover:border-cyan-400/40"
        }`}
      >
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300">
          <UploadCloud size={28} />
        </div>

        <h3 className="text-sm font-semibold text-white">
          Upload your images
        </h3>

        <p className="mt-2 text-xs leading-6 text-slate-400">
          Drag and drop or select multiple JPG, PNG, or WebP files.
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Up to 20 images · 15 MB per image
        </p>

        <button
          type="button"
          disabled={processing || images.length >= MAX_FILES}
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-200 hover:bg-cyan-400/20 disabled:opacity-40"
        >
          Choose images
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          disabled={processing}
          onChange={(event) => addFiles(event.target.files)}
          className="hidden"
        />
      </div>

      {/* Selected images */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">
              Selected images ({images.length})
            </h3>

            <button
              type="button"
              onClick={clearImages}
              disabled={processing}
              className="flex items-center gap-2 text-xs text-red-300 disabled:opacity-40"
            >
              <Trash2 size={15} />
              Clear all
            </button>
          </div>

          <div className="space-y-3">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b1422] p-3 sm:gap-4"
              >
                <span className="w-5 shrink-0 text-center text-xs text-slate-500">
                  {index + 1}
                </span>

                <img
                  src={image.url}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-lg bg-white/5 object-contain"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white sm:text-sm">
                    {image.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {(image.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Move ${image.name} up`}
                    disabled={index === 0 || processing}
                    onClick={() => moveImage(index, -1)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                  >
                    <ArrowUp size={16} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Move ${image.name} down`}
                    disabled={index === images.length - 1 || processing}
                    onClick={() => moveImage(index, 1)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                  >
                    <ArrowDown size={16} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Remove ${image.name}`}
                    disabled={processing}
                    onClick={() => removeImage(image.id)}
                    className="rounded-lg p-2 text-red-300 hover:bg-red-400/10 disabled:opacity-30"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF settings */}
      {images.length > 0 && (
        <div className="space-y-5 rounded-2xl border border-white/10 bg-[#0c1625] p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-white">
            PDF settings
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="block text-xs text-slate-300">
                Page size
              </span>

              <select
                value={pageSize}
                onChange={(event) => setPageSize(event.target.value)}
                disabled={processing}
                className="w-full rounded-xl border border-white/10 bg-[#0b1422] px-4 py-3 text-sm text-white"
              >
                <option value="a4">A4</option>
                <option value="letter">US Letter</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="block text-xs text-slate-300">
                Orientation
              </span>

              <select
                value={orientation}
                onChange={(event) => setOrientation(event.target.value)}
                disabled={processing}
                className="w-full rounded-xl border border-white/10 bg-[#0b1422] px-4 py-3 text-sm text-white"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </label>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] p-3 text-xs text-slate-400">
            <FileCheck2 size={17} className="text-cyan-300" />
            The PDF will contain {images.length} pages.
          </div>

          <button
            type="button"
            onClick={generatePDF}
            disabled={processing}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-4 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:opacity-40"
          >
            {processing ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Creating PDF...
              </>
            ) : (
              <>
                <Download size={18} />
                Convert to PDF
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-300"
        >
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      <p className="flex items-start gap-2 text-xs leading-6 text-slate-500">
        <ShieldCheck size={17} className="mt-0.5 shrink-0 text-cyan-300" />
        Images are processed locally in your browser. Files are
        converted to JPEG internally to create a smaller PDF;
        transparent areas become white.
      </p>
    </div>
  );
}
