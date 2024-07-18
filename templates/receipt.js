const fs = require('fs');
const PDFDocument = require('pdfkit');

const doc = new PDFDocument();

const stream = fs.createWriteStream('example.pdf');
doc.pipe(stream);

doc.fontSize(12).text('Hello, Welcome to PDFKit!', { align: 'center' });

doc.end();

stream.on('finish', () => {
    console.log('Here\'s your PDF!');
});
