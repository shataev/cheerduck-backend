# Cheerduck Receipt Generator

Small static web app for generating Cheerduck Property receipts and debit notes. The main workflow is implemented as a browser-based form page: the user enters the required data, the page injects it into a hidden receipt template, renders that template to a PDF in the browser, and downloads the file.

### Features

- Serves a receipt / debit note generation form as a static page.
- Calculates electricity charges from meter readings.
- Fills two receipt copies on a single A4 landscape layout.
- Produces the final PDF client-side with `html2pdf.js` and downloads it.

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

Serves the repository as plain static files, exactly as it is deployed.

Then open:

```text
http://localhost:3000
```

The root URL redirects to the main app at `public/index.html`.

To override the port:

```bash
PORT=4000 npm start
```

### Development Mode

```bash
npm run dev
```

This runs `scripts/dev-server.js` (no dependencies) with `CHEERDUCK_DEV=1`. The
server serves the same static files but injects `window.CHEERDUCK_DEV = true`
into every HTML response, which reveals a `Generate sample PDF (dev)` button
under the main one. That button renders the receipt from built-in sample data,
so the generated PDF can be checked without filling in the form.

The flag is attached to the response rather than to the hostname, so the button
also shows up on a phone opening the printed `Network:` URL over the same Wi-Fi.
It never reaches the deployed build, because production is served as static
files without this server.

The dev server prints both URLs on start:

```text
  - Local:    http://localhost:3000
  - Network:  http://192.168.1.5:3000
```

Environment variables:

- `PORT` - port to listen on, default `3000`.
- `HOST` - interface to bind, default `0.0.0.0`.
- `CHEERDUCK_DEV` - set to `0` to serve without the dev button.

On a deployed build the button can still be revealed for a one-off check by
adding `?dev` to the URL.

### Usage

1. Open `http://localhost:3000`.
2. Fill in the form fields: guest info, dates, price, deposit, electricity readings, and extra charges.
3. Click `Generate PDF Receipt`.
4. The PDF is generated in the browser and downloaded automatically.

### Project Structure

- `index.html` - lightweight redirect page for generic static hosting and local preview.
- `public/index.html` - main UI and client-side receipt generation logic.
- `public/assets/` - images for the logo, PromptPay, and QR code.
- `templates/receipt.html` - alternative HTML-based receipt template using `html2pdf.js` from a CDN.
- `templates/receipt.css` - styles for the alternative template.
- `templates/receipt.js` - simple PDF generation example using `pdfkit`.
- `scripts/dev-server.js` - zero-dependency static server for `npm run dev`; injects the dev-mode flag.
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

- The main PDF output is generated client-side, so it depends on the browser rendering the hidden template correctly.
- Correct rendering depends on image files inside `public/assets/`: `logo.png`, `promptPayLogo.png`, and `QRCode.png`.
- Automated tests are not set up yet.
