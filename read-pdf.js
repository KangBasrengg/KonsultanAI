const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('KonsultanAI-Laporan-2026-06-05.pdf');

pdf(dataBuffer).then(function(data) {
    console.log(data.text);
}).catch(err => {
    console.error("Error reading PDF:", err);
});
