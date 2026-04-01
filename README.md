# Cheerduck Receipt Generator

Small static web app for generating Cheerduck Property receipts and debit notes. The main workflow is implemented as a browser-based form page: the user enters the required data, the page injects it into a hidden receipt template, and then opens the browser print dialog so the document can be saved as a PDF.

### Features

- Serves a receipt / debit note generation form as a static page.
- Calculates electricity charges from meter readings.
- Fills two receipt copies on a single A4 landscape layout.
- Produces the final document through `window.print()` and the browser print dialog.

### Requirements

- Node.js `>= 18`
- npm

### Install

```bash
npm install
```

### Local Preview

```bash
npm start
```

or

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

The root URL redirects to the main app at `public/index.html`.

To override the port:

```bash
PORT=4000 npm start
```

### Usage

1. Open `http://localhost:3000`.
2. Fill in the form fields: guest info, dates, price, deposit, electricity readings, and extra charges.
3. Click `Generate PDF Receipt`.
4. The browser print dialog will open.
5. Choose `Save as PDF`.

### Project Structure

- `index.html` - lightweight redirect page for generic static hosting and local preview.
- `public/index.html` - main UI and client-side receipt generation logic.
- `public/assets/` - images for the logo, PromptPay, and QR code.
- `templates/receipt.html` - alternative HTML-based receipt template using `html2pdf.js` from a CDN.
- `templates/receipt.css` - styles for the alternative template.
- `templates/receipt.js` - simple PDF generation example using `pdfkit`.
- `index.js` - standalone script for generating a `.docx` file from `templates/receipt.docx`.
- `vercel.json` - Vercel rewrites for static deployment from the repository root.
- `netlify.toml` - Netlify redirects for static deployment from the repository root.

### Optional DOCX Script

The repository also contains a helper script:

```bash
node index.js
```

It reads `templates/receipt.docx`, patches placeholders, and writes a new file like `Cheerduck_<name>.docx`.

Important notes:

- This flow is not used by the static web app.
- It requires `templates/receipt.docx`.
- `package.json` points `main` to `index.js`, while the web app itself is served as static files.

### Deployment

The project is ready for static hosting. Recommended targets:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages with a small custom setup

For Vercel and Netlify, the included config files route `/` to `public/index.html`, map `/assets` to `public/assets`, and keep `/templates` accessible.

### Known Limitations

- The main PDF output is client-side and relies on the browser print dialog.
- Correct rendering depends on image files inside `public/assets/`: `logo.png`, `promptPayLogo.png`, and `QRCode.png`.
- Automated tests are not set up yet.
