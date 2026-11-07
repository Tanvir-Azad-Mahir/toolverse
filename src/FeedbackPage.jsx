import { useState } from "react";
import { ArrowLeft, Check, Copy, Mail, Send, ShieldCheck } from "lucide-react";

const FEEDBACK_ADDRESS = "galvoid.tech@gmail.com";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function FeedbackPage({ onBack }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [emailDraft, setEmailDraft] = useState(null);
  const [copied, setCopied] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setStatus("idle");
    setEmailDraft(null);
    setCopied(false);
    if (error) setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const subject = `ToolVerse feedback: ${form.subject.trim()}`;
    const message = [
      `Name: ${form.name.trim() || "Not provided"}`,
      `Reply email: ${form.email.trim() || "Not provided"}`,
      "",
      form.message.trim(),
    ].join("\n");
    const encodedSubject = encodeURIComponent(subject);
    const encodedMessage = encodeURIComponent(message);
    const mailto = `mailto:${FEEDBACK_ADDRESS}?subject=${encodedSubject}&body=${encodedMessage}`;
    const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(FEEDBACK_ADDRESS)}&su=${encodedSubject}&body=${encodedMessage}`;

    if (gmailCompose.length > 8000) {
      setError("This message is too long to prepare as an email link. Please shorten it and try again.");
      setStatus("error");
      return;
    }

    setEmailDraft({ mailto, gmailCompose, subject, message });
    setStatus("draft");
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(
        `To: ${FEEDBACK_ADDRESS}\nSubject: ${emailDraft.subject}\n\n${emailDraft.message}`
      );
      setCopied(true);
      setError("");
    } catch {
      setError("Could not copy the email draft. Please select and copy it manually.");
    }
  }

  return (
    <main className="landing-page min-h-[calc(100vh-68px)] px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-emerald-300"
        >
          <ArrowLeft size={16} /> Back to ToolVerse
        </button>

        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 shadow-2xl shadow-emerald-500/[0.06] backdrop-blur-xl sm:p-10">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              <Mail size={14} /> Contact ToolVerse
            </span>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Send us your feedback
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              Share a suggestion, report a problem, or tell us what tool you’d like to see next.
              We’ll prepare an email for you to review and send from your mail app.
            </p>
          </div>

          {status === "draft" ? (
            <div
              role="status"
              className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] p-6"
            >
              <Mail className="mb-3 text-emerald-400" size={28} />
              <h2 className="text-lg font-bold text-white">Your email draft is ready</h2>
              <p className="mt-2 text-sm text-slate-300">
                Review the message in your email app and press Send. ToolVerse does not send it
                automatically.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={emailDraft.gmailCompose}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-[#022c22] transition hover:bg-emerald-400"
                >
                  <Send size={16} /> Open Gmail compose
                </a>
                <a
                  href={emailDraft.mailto}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                >
                  <Mail size={16} /> Open default email app
                </a>
                <button
                  type="button"
                  onClick={copyDraft}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied" : "Copy email"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setEmailDraft(null);
                    setError("");
                  }}
                  className="px-3 py-3 text-sm font-semibold text-slate-400 transition hover:text-white"
                >
                  Edit message
                </button>
              </div>
              <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs font-semibold text-slate-400">
                  To: {FEEDBACK_ADDRESS}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  Subject: {emailDraft.subject}
                </p>
                <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-slate-300">
                  {emailDraft.message}
                </pre>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-300">
                  Your name <span className="font-normal text-slate-500">(optional)</span>
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    value={form.name}
                    onChange={updateField}
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10"
                    placeholder="Name"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-300">
                  Email address <span className="font-normal text-slate-500">(optional)</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    value={form.email}
                    onChange={updateField}
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-300">
                Subject
                <input
                  name="subject"
                  type="text"
                  required
                  minLength={3}
                  maxLength={120}
                  value={form.subject}
                  onChange={updateField}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10"
                  placeholder="What would you like to tell us?"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-300">
                Message
                <textarea
                  name="message"
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={7}
                  value={form.message}
                  onChange={updateField}
                  className="resize-y rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10"
                  placeholder="Write your feedback here..."
                />
                <span className="self-end text-xs text-slate-500">
                  {form.message.length}/5000
                </span>
              </label>

              {error && (
                <p role="alert" className="rounded-xl border border-rose-500/25 bg-rose-500/10 p-3 text-sm text-rose-300">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-4 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="inline-flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck size={15} className="shrink-0 text-emerald-400" />
                  Your email app sends the message; nothing is sent by this page.
                </p>
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-[#022c22] shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
                >
                  <Mail size={16} />
                  Prepare email
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
