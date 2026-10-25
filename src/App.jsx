
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  Image, Maximize, QrCode, Type, Braces, Calculator,
  ArrowRight, Download, Copy, Check, Menu, X,
  Upload, Sparkles, ShieldCheck
} from "lucide-react";
import "./App.css";

const tools = [
  { id: "compress", name: "Image Compressor", description: "Reduce image file size.", icon: Image, category: "Images" },
  { id: "resize", name: "Image Resizer", description: "Resize images in seconds.", icon: Maximize, category: "Images" },
  { id: "qr", name: "QR Code Generator", description: "Create downloadable QR codes.", icon: QrCode, category: "Utilities" },
  { id: "words", name: "Word Counter", description: "Count words and characters.", icon: Type, category: "Writing" },
  { id: "json", name: "JSON Formatter", description: "Format and validate JSON.", icon: Braces, category: "Developer" },
  { id: "percent", name: "Percentage Calculator", description: "Calculate percentages easily.", icon: Calculator, category: "Calculators" },
];

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function ImageTool({ resize = false }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [quality, setQuality] = useState(75);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [keepRatio, setKeepRatio] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [preview, result]);

  function loadFile(next) {
    if (!next) return;
    if (!next.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setError("");
    setFile(next);
    setPreview(URL.createObjectURL(next));
    setResult(null);

    const image = new window.Image();
    image.onload = () => {
      setWidth(image.naturalWidth);
      setHeight(image.naturalHeight);
    };
    image.src = URL.createObjectURL(next);
  }

  async function processImage() {
    if (!file) return;
    setError("");

    try {
      const image = new window.Image();
      image.src = preview;
      await image.decode();

      let w = image.naturalWidth;
      let h = image.naturalHeight;

      if (resize) {
        w = Math.max(1, Math.min(10000, Number(width) || 1));
        h = Math.max(1, Math.min(10000, Number(height) || 1));
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Your browser could not create a canvas.");

      // JPEG has no transparency, so fill its background white.
      const outputType = resize
        ? (file.type === "image/png" ? "image/png" : "image/jpeg")
        : (file.type === "image/png" ? "image/png" : "image/jpeg");

      if (outputType === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
      }

      ctx.drawImage(image, 0, 0, w, h);

      canvas.toBlob((blob) => {
        if (!blob) {
          setError("Image processing failed. Try another image.");
          return;
        }

        const url = URL.createObjectURL(blob);
        setResult({
          url,
          blob,
          size: blob.size,
          width: w,
          height: h,
        });
      }, outputType, quality / 100);
    } catch {
      setError("Could not process this image. Please try another file.");
    }
  }

  return (
    <div className="tool-form">
      <label className="upload-zone">
        <Upload size={28} />
        <strong>{file ? file.name : "Choose an image"}</strong>
        <span>JPG, PNG, WebP and other browser-supported image formats</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => loadFile(e.target.files?.[0])}
          hidden
        />
      </label>

      {file && (
        <>
          <div className="image-info">
            <img src={preview} alt="Original image preview" />
            <div>
              <strong>{file.name}</strong>
              <p>{formatBytes(file.size)}</p>
            </div>
          </div>

          {resize ? (
            <div className="field-row">
              <label>
                Width (px)
                <input type="number" min="1" max="10000"
                  value={width}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setWidth(next);
                    if (keepRatio && file && width > 0) {
                      setHeight(Math.round(next * height / width));
                    }
                  }} />
              </label>
              <label>
                Height (px)
                <input type="number" min="1" max="10000"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))} />
              </label>
            </div>
          ) : (
            <label className="range-field">
              <span>Image quality <strong>{quality}%</strong></span>
              <input type="range" min="10" max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))} />
            </label>
          )}

          {resize && (
            <label className="check-row">
              <input type="checkbox" checked={keepRatio}
                onChange={(e) => setKeepRatio(e.target.checked)} />
              Preserve aspect ratio
            </label>
          )}

          <button className="primary-button" onClick={processImage}>
            {resize ? "Resize image" : "Compress image"} <ArrowRight size={17} />
          </button>
        </>
      )}

      {error && <p className="error-text">{error}</p>}

      {result && (
        <div className="result-panel">
          <img src={result.url} alt="Processed image preview" />
          <strong>{formatBytes(result.size)}</strong>
          <p>{result.width} × {result.height} px</p>
          {!resize && (
            <p>
              {result.size <= file.size
                ? `${Math.round((1 - result.size / file.size) * 100)}% smaller`
                : "This format produced a larger file."}
            </p>
          )}
          <button className="primary-button"
            onClick={() => downloadBlob(
              result.blob,
              `${file.name.replace(/\.[^.]+$/, "")}-${resize ? "resized" : "compressed"}.${result.blob.type === "image/png" ? "png" : "jpg"}`
            )}>
            <Download size={17} /> Download image
          </button>
        </div>
      )}
    </div>
  );
}

function QRTool() {
  const [text, setText] = useState("");
  const [qr, setQr] = useState("");
  const [error, setError] = useState("");

  async function generate() {
    if (!text.trim()) {
      setError("Enter a URL or text first.");
      return;
    }
    try {
      setQr(await QRCode.toDataURL(text.trim(), {
        width: 320, margin: 2,
        color: { dark: "#10131A", light: "#FFFFFF" },
      }));
      setError("");
    } catch {
      setError("Could not generate the QR code.");
    }
  }

  return (
    <div className="tool-form">
      <label>
        Text or URL
        <textarea rows="3" value={text} onChange={(e) => setText(e.target.value)}
          placeholder="https://example.com" />
      </label>
      <button className="primary-button" onClick={generate}>
        Generate QR code <ArrowRight size={17} />
      </button>
      {error && <p className="error-text">{error}</p>}
      {qr && <div className="result-panel">
        <img className="qr-image" src={qr} alt="Generated QR code" />
        <button className="secondary-button"
          onClick={() => {
            const a = document.createElement("a");
            a.href = qr;
            a.download = "toolnest-qr.png";
            a.click();
          }}>
          <Download size={17} /> Download PNG
        </button>
      </div>}
    </div>
  );
}

function WordTool() {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/u).length : 0;
  const sentences = text.trim()
    ? text.split(/[.!?]+/u).filter((s) => s.trim()).length
    : 0;
  const paragraphs = text.trim()
    ? text.split(/\n\s*\n/u).filter((s) => s.trim()).length
    : 0;

  return (
    <div className="tool-form">
      <label>
        Your text
        <textarea rows="10" value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..." />
      </label>
      <div className="stats-grid">
        {[
          ["Words", words],
          ["Characters", text.length],
          ["No spaces", text.replace(/\s/g, "").length],
          ["Sentences", sentences],
          ["Paragraphs", paragraphs],
          ["Reading time", `${Math.ceil(words / 200)} min`],
        ].map(([label, value]) => (
          <div className="stat-card" key={label}>
            <span>{label}</span><strong>{value}</strong>
          </div>
        ))}
      </div>
      <button className="secondary-button" onClick={() => setText("")}>Clear text</button>
    </div>
  );
}

function JSONTool() {
  const [input, setInput] = useState('{"name":"ToolNest","free":true}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("pretty");

  function run() {
    try {
      const parsed = JSON.parse(input);
      setOutput(mode === "minify"
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e) {
      setOutput("");
      setError(e.message);
    }
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      setError("Clipboard access failed. Select and copy the output manually.");
    }
  }

  return (
    <div className="tool-form">
      <label>
        Input JSON
        <textarea className="code-input" rows="8" value={input}
          onChange={(e) => setInput(e.target.value)} spellCheck="false" />
      </label>
      <div className="field-row">
        <label>
          Output format
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="pretty">Pretty print</option>
            <option value="minify">Minify</option>
          </select>
        </label>
        <button className="primary-button" onClick={run}>Format JSON</button>
      </div>
      {error && <p className="error-text">{error}</p>}
      {output && <div className="output-wrap">
        <pre>{output}</pre>
        <button className="secondary-button" onClick={copyOutput}>
          <Copy size={16} /> Copy output
        </button>
      </div>}
    </div>
  );
}

function PercentageTool() {
  const [mode, setMode] = useState("of");
  const [a, setA] = useState("20");
  const [b, setB] = useState("150");
  const [c, setC] = useState("200");

  const x = Number(a);
  const y = Number(b);
  const z = Number(c);
  let result = null;

  if ([x, y].every(Number.isFinite)) {
    if (mode === "of") result = y * x / 100;
    if (mode === "what") result = y === 0 ? null : x / y * 100;
    if (mode === "change" && Number.isFinite(z) && x !== 0) {
      result = (y - x) / Math.abs(x) * 100;
    }
    if (mode === "discount" && Number.isFinite(z)) {
      result = z * (1 - x / 100);
    }
  }

  return (
    <div className="tool-form">
      <label>
        Calculation
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="of">What is X% of Y?</option>
          <option value="what">X is what percent of Y?</option>
          <option value="change">Percentage change from X to Y</option>
          <option value="discount">Price after X% discount on Y</option>
        </select>
      </label>
      <div className="field-row">
        <label>{mode === "change" ? "Original value" : mode === "discount" ? "Discount (%)" : "X"}
          <input type="number" value={a} onChange={(e) => setA(e.target.value)} />
        </label>
        <label>{mode === "change" ? "New value" : mode === "discount" ? "Original price" : "Y"}
          <input type="number" value={b} onChange={(e) => setB(e.target.value)} />
        </label>
      </div>
      {mode === "change" && (
        <p className="muted">Enter the original value in X and the new value in Y.</p>
      )}
      <div className="result-panel">
        <span className="muted">Result</span>
        <strong className="big-result">
          {result === null || !Number.isFinite(result)
            ? "Enter valid values"
            : `${Number(result.toFixed(6)).toLocaleString()}${mode === "what" || mode === "change" ? "%" : ""}`}
        </strong>
        {mode === "discount" && Number.isFinite(x) && Number.isFinite(y) && (
          <p>You save {(y * x / 100).toLocaleString()}.</p>
        )}
      </div>
    </div>
  );
}

const descriptions = {
  compress: {
    eyebrow: "IMAGE TOOLS",
    title: "Image Compressor",
    description: "Reduce image file size directly in your browser.",
  },
  resize: {
    eyebrow: "IMAGE TOOLS",
    title: "Image Resizer",
    description: "Resize images to the dimensions you need.",
  },
  qr: {
    eyebrow: "QUICK UTILITIES",
    title: "QR Code Generator",
    description: "Turn text or links into downloadable QR codes.",
  },
  words: {
    eyebrow: "WRITING TOOLS",
    title: "Word Counter",
    description: "Analyze word count, characters, and reading time.",
  },
  json: {
    eyebrow: "DEVELOPER TOOLS",
    title: "JSON Formatter",
    description: "Validate, format, and minify JSON instantly.",
  },
  percent: {
    eyebrow: "CALCULATORS",
    title: "Percentage Calculator",
    description: "Solve percentage, discount, and change calculations.",
  },
};

function ToolView({ id }) {
  const info = descriptions[id];
  if (!info) return null;

  return (
    <section className="tool-view">
      <button className="back-link" onClick={() => window.location.hash = ""}>
        ← All tools
      </button>
      <p className="eyebrow">{info.eyebrow}</p>
      <h1>{info.title}</h1>
      <p className="page-description">{info.description}</p>
      <div className="tool-panel">
        {id === "compress" && <ImageTool />}
        {id === "resize" && <ImageTool resize />}
        {id === "qr" && <QRTool />}
        {id === "words" && <WordTool />}
        {id === "json" && <JSONTool />}
        {id === "percent" && <PercentageTool />}
      </div>
      <div className="privacy-note">
        <ShieldCheck size={18} />
        <span>Designed for local processing where supported. Your files are not intentionally uploaded by these tools.</span>
      </div>
    </section>
  );
}

export default function App() {
  const [active, setActive] = useState(window.location.hash.replace("#", ""));
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const sync = () => setActive(window.location.hash.replace("#", ""));
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    document.title = active && descriptions[active]
      ? `${descriptions[active].title} — ToolNest`
      : "ToolNest — Free Online Tools";

    const description = active && descriptions[active]
      ? descriptions[active].description
      : "Free online image tools, QR generator, word counter, JSON formatter, and calculators.";

    let meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
  }, [active]);

  function openTool(id) {
    window.location.hash = id;
    setActive(id);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const filtered = tools.filter((tool) =>
    `${tool.name} ${tool.description} ${tool.category}`
      .toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <header className="site-header">
        <a href="#" className="brand" onClick={() => setActive("")}>
          <img className="brand-logo" src="/log2.png" alt="" />
          <span>toolverse<span className="brand-dot">.</span></span>
        </a>
        <nav className={mobileMenu ? "nav-links open" : "nav-links"}>
          <a href="#tools" onClick={() => setActive("")}>Explore tools</a>
          <a href="#about" onClick={() => setActive("")}>About</a>
        </nav>
        <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Toggle menu">
          {mobileMenu ? <X /> : <Menu />}
        </button>
        <a className="header-cta" href="#tools" onClick={() => setActive("")}>
          Explore tools <ArrowRight size={16} />
        </a>
      </header>

      {active && descriptions[active] ? (
        <ToolView id={active} />
      ) : (
        <main>
          <section className="hero">
            <div className="hero-glow" />
            <div className="hero-content">
              <div className="announcement"><Sparkles size={14} /> Simple tools. Better workflow.</div>
              <h1>Small tasks.<br /><span>Big time savings.</span></h1>
              <p>Free online tools to resize images, generate QR codes, format JSON, and get everyday work done.</p>
              <a href="#tools" className="primary-button hero-button">
                Explore free tools <ArrowRight size={17} />
              </a>
              <div className="hero-benefits">
                <span><Check size={15} /> Free to use</span>
                <span><Check size={15} /> No account required</span>
                <span><Check size={15} /> Privacy-minded</span>
              </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="visual-core" aria-hidden="true">
                <div className="black-hole">
                  <span className="black-hole-ring black-hole-ring-back" />
                  <span className="black-hole-center" />
                  <span className="black-hole-ring black-hole-ring-front" />
                </div>
              </div>
              <div className="float-card float-one"><Image /> Image tools</div>
              <div className="float-card float-two"><Braces /> Developer tools</div>
              <div className="float-card float-three"><Calculator /> Calculators</div>
            </div>
          </section>

          <section id="tools" className="tools-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">THE TOOLKIT</p>
                <h2>Everything you need.<br /><span>Nothing you don't.</span></h2>
              </div>
              <p>Useful, straightforward tools for everyday tasks.</p>
            </div>
            <label className="search-box">
              <span>⌕</span>
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Find a tool..." aria-label="Search tools" />
              <kbd>Search</kbd>
            </label>
            <div className="tools-grid">
              {filtered.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button className="tool-card" key={tool.id} onClick={() => openTool(tool.id)}>
                    <span className="tool-icon"><Icon size={23} /></span>
                    <span className="tool-category">{tool.category}</span>
                    <strong>{tool.name}</strong>
                    <span className="tool-description">{tool.description}</span>
                    <span className="card-arrow"><ArrowRight size={17} /></span>
                  </button>
                );
              })}
            </div>
            {filtered.length === 0 && <p className="muted">No tools match that search.</p>}
          </section>

          <section id="about" className="about-section">
            <div className="about-icon"><ShieldCheck size={28} /></div>
            <div>
              <p className="eyebrow">BUILT FOR EVERYDAY WORK</p>
              <h2>Useful by design.</h2>
              <p>ToolNest aims to make everyday digital tasks faster with simple tools and a clear interface. Image processing happens in your browser; other tools process the input you provide to generate results.</p>
            </div>
          </section>
        </main>
      )}

      <footer className="site-footer">
        <a href="#" className="brand">
          <img className="brand-logo" src="/log2.png" alt="" />
          <span>toolverse<span className="brand-dot">.</span></span>
        </a>
        <span>Useful tools. Less friction.</span>
        <div className="footer-links">
          <a href="mailto:hello@example.com">Contact</a>
          <a href="/privacy.html">Privacy</a>
          <a href="/terms.html">Terms</a>
        </div>
        <small>© {new Date().getFullYear()} ToolNest. All rights reserved.</small>
      </footer>
    </div>
  );
}
