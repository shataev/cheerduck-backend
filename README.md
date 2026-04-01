# Cheerduck Receipt Generator

Small Node.js/Express app for generating Cheerduck Property receipts and debit notes. The main workflow is implemented as a static form page: the user enters the required data, the page injects it into a hidden receipt template, and then opens the browser print dialog so the document can be saved as a PDF.

### Features

- Serves a receipt / debit note generation form.
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

### Run

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

- `server.js` - minimal Express server that serves static files.
- `public/index.html` - main UI and client-side receipt generation logic.
- `assets/` - images for the logo, PromptPay, and QR code.
- `templates/receipt.html` - alternative HTML-based receipt template using `html2pdf.js`.
- `templates/receipt.css` - styles for the alternative template.
- `templates/receipt.js` - simple PDF generation example using `pdfkit`.
- `index.js` - standalone script for generating a `.docx` file from `templates/receipt.docx`.

### Optional DOCX Script

The repository also contains a helper script:

```bash
node index.js
```

It reads `templates/receipt.docx`, patches placeholders, and writes a new file like `Cheerduck_<name>.docx`.

Important notes:

- This flow is not used by the web server.
- It requires `templates/receipt.docx`.
- `package.json` points `main` to `index.js`, but the actual web app starts via `server.js`.

### Configuration

Supported environment variables:

- `PORT` - HTTP server port, default is `3000`.

### Known Limitations

- This is closer to a static app hosted by Node than to a full backend API.
- `server.js` does not define REST endpoints beyond static file serving.
- The main PDF output is client-side and relies on the browser print dialog.
- The server exposes `/node_modules` as a static path; this should usually be reconsidered for production.
- Correct rendering depends on image files inside `assets/`: `logo.png`, `promptPayLogo.png`, and `QRCode.png`.
- Automated tests are not set up yet.
