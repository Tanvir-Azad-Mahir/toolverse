import { Image, Maximize, QrCode, Type, Braces, Calculator, CaseUpper } from "lucide-react";

export const tools = [
  { id: "compress", name: "Image Compressor", description: "Shrink image files while keeping them looking sharp.", icon: Image, category: "Images" },
  { id: "resize", name: "Image Resizer", description: "Get the exact dimensions you need in seconds.", icon: Maximize, category: "Images" },
  { id: "qr", name: "QR Code Generator", description: "Turn links and text into downloadable QR codes.", icon: QrCode, category: "Utilities" },
  { id: "words", name: "Word Counter", description: "Count words, characters, and reading time.", icon: Type, category: "Writing" },
  { id: "json", name: "JSON Formatter", description: "Validate, format, and minify JSON with ease.", icon: Braces, category: "Developer" },
  { id: "percent", name: "Percentage Calculator", description: "Work out percentages, discounts, and changes.", icon: Calculator, category: "Calculators" },
  { id: "textcase", name: "Text Case Converter", description: "Switch between uppercase, lowercase, and more.", icon: CaseUpper, category: "Writing" },
];

export const descriptions = {
  compress: { eyebrow: "IMAGE TOOLS", title: "Image Compressor", description: "Reduce image file size directly in your browser." },
  resize: { eyebrow: "IMAGE TOOLS", title: "Image Resizer", description: "Resize images to the dimensions you need." },
  qr: { eyebrow: "QUICK UTILITIES", title: "QR Code Generator", description: "Turn text or links into downloadable QR codes." },
  words: { eyebrow: "WRITING TOOLS", title: "Word Counter", description: "Analyze word count, characters, and reading time." },
  json: { eyebrow: "DEVELOPER TOOLS", title: "JSON Formatter", description: "Validate, format, and minify JSON instantly." },
  percent: { eyebrow: "CALCULATORS", title: "Percentage Calculator", description: "Solve percentage, discount, and change calculations." },
  textcase: { eyebrow: "WRITING TOOLS", title: "Text Case Converter", description: "Convert uppercase, lowercase, title case, and sentence case in your browser." },
};

export const categories = ["All tools", "Images", "Writing", "Developer", "Utilities", "Calculators"];

