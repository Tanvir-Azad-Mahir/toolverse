<div align="center">

<img src="https://toolverse-e57.pages.dev/log2.png" alt="ToolVerse logo" width="88" />

# ToolVerse

### Everything you need. Nothing you don't.

**A free, fast, neon-inspired toolbox for everyday digital tasks — right in your browser.**

[![Live Website](https://img.shields.io/badge/Launch-ToolVerse-06b6d4?style=for-the-badge&logo=cloudflare&logoColor=white)](https://toolverse-e57.pages.dev/)
[![React](https://img.shields.io/badge/React-19-149eca?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[**Try ToolVerse ↗**](https://toolverse-e57.pages.dev/) · [**Explore Tools**](#-the-toolkit) · [**Get Started**](#-run-locally) · [**Suggest a Feature**](mailto:galvoid.tech@gmail.com?subject=ToolVerse%20Feature%20Suggestion)

</div>

---

## ✨ Meet ToolVerse

**ToolVerse** brings frequently needed utilities together in one clean, responsive workspace. Compress an image, format JSON, generate a strong password, convert images to PDF, or calculate a date — without bouncing between separate sites.

The interface pairs a **dark, neon cyan-and-blue design** with an **animated galaxy hero**, searchable tool cards, category filtering, and streamlined, browser-based workflows.

> **Built for convenience:** no account required, straightforward controls, and local processing for supported tasks.

## 🧰 The Toolkit

**12 tools across 7 functional categories:**

| Category | Tool | What it does |
|:--|:--|:--|
| 🖼️ Images | **Image Compressor** | Reduce image file size in your browser. |
| 🖼️ Images | **Image Resizer** | Resize images to your chosen dimensions. |
| 🔧 Utilities | **QR Code Generator** | Turn text and URLs into downloadable QR codes. |
| ✍️ Writing | **Word Counter** | Count words, characters, and estimate reading time. |
| 💻 Developer | **JSON Formatter** | Validate, prettify, and minify JSON. |
| 🧮 Calculators | **Percentage Calculator** | Calculate percentages, discounts, and changes. |
| ✍️ Writing | **Text Case Converter** | Convert text between common capitalization styles. |
| 🔐 Security | **Password Generator** | Generate strong passwords with adjustable character options. |
| 💻 Developer | **UUID Generator** | Create UUID v4 identifiers, individually or in bulk. |
| 💻 Developer | **Base64 Converter** | Encode and decode UTF-8 text using Base64. |
| 🧮 Calculators | **Date Calculator** | Calculate date differences and add or subtract days. |
| 📄 Documents | **Image to PDF Converter** | Combine multiple images into a downloadable PDF. |

Use the homepage **search box** or **category filters** to find the tool you need.

## 🌌 Highlights

- **Galaxy-inspired design** — glowing orbital rings, floating tool shortcuts, animated stars, and subtle neon accents.
- **Responsive layout** — designed for phones, tablets, and desktops.
- **Fast navigation** — browse tools without a traditional multi-page reload.
- **Client-side utilities** — image and text processing where supported, without requiring a user account.
- **Accessibility-minded motion** — reduced-motion preferences are respected.
- **Modular architecture** — individual tools live in dedicated React components.
- **Performance-conscious** — Vite production builds and optional lazy-loading of tool components.
- **Feedback welcome** — ideas, bug reports, and improvements are encouraged.

## 🛠️ Built With

| Technology | Purpose |
|:--|:--|
| [React](https://react.dev/) | Component-based user interface |
| [Vite](https://vite.dev/) | Local development and production builds |
| [Tailwind CSS](https://tailwindcss.com/) | Responsive, utility-first styling |
| [Lucide React](https://lucide.dev/) | Consistent UI icons |
| [jsPDF](https://github.com/parallax/jsPDF) | Image-to-PDF export |
| [qrcode](https://www.npmjs.com/package/qrcode) | QR code generation |
| [Cloudflare Pages](https://pages.cloudflare.com/) | Website deployment |

## 🚀 Run Locally

### Prerequisites

Install a recent version of **Node.js** and **npm** compatible with Vite 8.

### Installation

```bash
git clone https://github.com/Tanvir-Azad-Mahir/toolverse.git
cd toolverse
npm install
npm run dev
```

Open the URL shown in your terminal (typically **http://localhost:5173**).

### Other Commands

```bash
npm run lint      # Check code quality
npm run build     # Create a production build in dist/
npm run preview   # Preview the production build locally
```

## 📁 Project Structure

```text
toolverse/
├── public/
│   └── log2.png              # Brand image
├── src/
│   ├── tools/               # Individual utility components
│   │   ├── ImageCompressor.jsx
│   │   ├── ImageResizer.jsx
│   │   ├── QRCodeGenerator.jsx
│   │   ├── WordCounter.jsx
│   │   ├── JSONFormatter.jsx
│   │   ├── PercentageCalculator.jsx
│   │   ├── TextCaseConverter.jsx
│   │   ├── PasswordGenerator.jsx
│   │   ├── UUIDGenerator.jsx
│   │   ├── Base64Converter.jsx
│   │   ├── DateCalculator.jsx
│   │   └── ImageToPDF.jsx
│   ├── App.jsx               # Hash-based navigation
│   ├── Landing.jsx           # Homepage and animated galaxy
│   ├── SiteLayout.jsx        # Shared navbar and footer
│   ├── ToolPage.jsx          # Tool page shell / registry
│   ├── toolData.js           # Tool metadata and categories
│   ├── App.css
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

## 🔒 Privacy & Security

ToolVerse is designed around **browser-based processing** for supported utilities. For example, password generation uses the browser's cryptographic randomness APIs, while PDF creation and image manipulation are handled locally by their respective components.

**Important:** Browser-based processing is not a substitute for reviewing the code and dependencies when handling sensitive information. ToolVerse does not claim third-party security certification, end-to-end encryption, or a formal audit.

## ☁️ Deployment

ToolVerse is designed for static hosting and currently uses **Cloudflare Pages**.

| Setting | Value |
|:--|:--|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Framework | Vite / React |

The site currently uses **hash-based tool routes** such as `/#password` and `/#imagetopdf`. Dedicated crawlable routes are a potential future improvement.

## 🗺️ Roadmap

- [x] Build the initial tool directory
- [x] Expand to 12 browser-based utilities
- [x] Add the animated neon galaxy homepage
- [x] Add searchable categories and responsive layout
- [x] Add developer and feedback sections
- [ ] Improve automated testing across all tools
- [ ] Further refine mobile usability and accessibility
- [ ] Add search-friendly, dedicated tool URLs
- [ ] Add more useful tools based on community feedback

## 🤝 Contributions & Feedback

Have an idea for a new tool? Found a bug? Want to improve the UI or accessibility?

**Feedback and contributions are welcome.** You can open an issue or propose a pull request in the repository, or email suggestions directly:

📩 **[galvoid.tech@gmail.com](mailto:galvoid.tech@gmail.com?subject=ToolVerse%20Feedback)**

If you contribute code, please explain the change, keep the existing design consistent, and test relevant tools before submitting.

## 👨‍💻 Developer

**Developed by [Tanvir Azad Mahir](https://github.com/Tanvir-Azad-Mahir)**

A growing collection of practical tools, designed to make everyday digital work simpler.

---

<div align="center">

**Less friction. More creating.**

[Visit ToolVerse](https://toolverse-e57.pages.dev/) · [View GitHub Profile](https://github.com/Tanvir-Azad-Mahir) · [Send Feedback](mailto:mahir.cse.pc@gmail.com)

Made with care for the everyday web.

## License

ToolVerse is open-source software licensed under the
[MIT License](LICENSE).

Copyright © 2026 Tanvir Azad Mahir.

</div>
