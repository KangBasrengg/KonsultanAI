import puppeteer from 'puppeteer';
import fs from 'fs';

const markdown = fs.readFileSync('C:\\Users\\hp5CD\\.gemini\\antigravity\\brain\\40b06b0f-5a93-49ea-bf5f-05ed125148d8\\proposal_bphn.md', 'utf-8');
const logoTs = fs.readFileSync('./src/lib/logo-base64.ts', 'utf-8');
const logoMatch = logoTs.match(/"(data:image\/png;base64,.*?)"/);
const logoBase64 = logoMatch ? logoMatch[1] : '';

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    
    @page { margin: 0; }
    body { font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #1a1a1a; background: white; }
    
    /* Cover / Letterhead */
    .header { background-color: #0B132B; color: white; display: flex; align-items: center; justify-content: space-between; padding: 30px 50px; border-bottom: 6px solid #D4AF37; -webkit-print-color-adjust: exact; }
    .header-left { display: flex; align-items: center; }
    .header-logo { width: 55px; height: 55px; margin-right: 20px; }
    .header-title { color: #D4AF37; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px; }
    .header-subtitle { color: #F3E5AB; margin: 5px 0 0 0; font-size: 14px; font-weight: 400; letter-spacing: 0.5px; }
    .header-right { text-align: right; }
    .header-doc-type { margin: 0; font-size: 15px; font-weight: 700; letter-spacing: 1.5px; color: #FFFFFF; }
    .header-meta { color: #F3E5AB; margin: 5px 0 0 0; font-size: 12px; }
    
    /* Content */
    .content { padding: 30px 60px 0 60px; line-height: 1.8; font-size: 11pt; text-align: justify; }
    h1, h2, h3 { color: #0B132B; page-break-after: avoid; break-after: avoid; }
    h2 { border-bottom: 2px solid #e0e0e0; padding-bottom: 8px; margin-top: 35px; margin-bottom: 15px; font-size: 16pt; font-weight: 700; color: #0B132B; }
    
    /* Elements */
    p { margin-bottom: 15px; }
    ul, ol { margin-bottom: 20px; padding-left: 25px; }
    li { margin-bottom: 8px; }
    
    table { width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 10pt; }
    th, td { border: 1px solid #d0d0d0; padding: 12px 15px; text-align: left; }
    th { background-color: #0B132B; color: white; font-weight: 600; -webkit-print-color-adjust: exact; }
    tr:nth-child(even) { background-color: #f9f9f9; -webkit-print-color-adjust: exact; }
    
    /* Print rules to avoid clipping */
    p, li, tr { page-break-inside: avoid; break-inside: avoid; }
    
    /* Signature area */
    .signature-area { margin-top: 60px; display: flex; justify-content: flex-end; page-break-inside: avoid; break-inside: avoid; }
    .signature-box { text-align: left; width: 300px; }
    .signature-box p { margin: 0 0 5px 0; text-align: left; }
    .signature-space { height: 80px; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>
<body>
  <div class="header">
    <div class="header-left">
      ${logoBase64 ? '<img src="' + logoBase64 + '" class="header-logo" />' : ''}
      <div>
        <h1 class="header-title">KonsultanAI</h1>
        <p class="header-subtitle">AI Legal Assistant Indonesia</p>
      </div>
    </div>
    <div class="header-right">
      <h3 class="header-doc-type">PROPOSAL RESMI</h3>
      <p class="header-meta">Dokumen Pengajuan Dana</p>
    </div>
  </div>
  
  <div class="content">
    <div style="text-align: right; font-size: 11pt; margin-bottom: 30px; color: #555;">
      Jakarta, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
    </div>
    <div id="md-content"></div>
    
    <div class="signature-area">
      <div class="signature-box">
        <p>Hormat kami,</p>
        <p><strong>Tim Pengembang Hoodtech</strong></p>
        <p>Pemegang Hak Cipta Konsultan-AI.com</p>
        <div class="signature-space"></div>
        <p style="text-decoration: underline; font-weight: 600;">( ......................................... )</p>
        <p style="font-size: 10pt; color: #666;">CEO / Perwakilan Tim</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  // Clean markdown by removing the HTML table we injected earlier
  let cleanMd = markdown.replace(/<table[\s\S]*?<\/table>\s*<br\/>/, '');
  // Also remove the "Hormat kami..." from the markdown since we added a beautiful signature area
  cleanMd = cleanMd.replace(/\*\*Hormat kami,\*\*[\s\S]*/, '');
  // And remove the <h2 align="center"> HTML we added
  cleanMd = cleanMd.replace(/<h2 align="center">[\s\S]*?<\/h2>/, '');
  
  // Add a nice main title
  cleanMd = "# PROPOSAL PENGAJUAN DANA PENGEMBANGAN PLATFORM\n" + cleanMd;
  
  await page.evaluate((md) => {
    document.getElementById('md-content').innerHTML = marked.parse(md);
  }, cleanMd);

  await page.pdf({ 
    path: 'Proposal_BPHN_KonsultanAI.pdf', 
    format: 'A4', 
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="width: 100%; font-size: 9px; padding-top: 5px; text-align: center; color: #777; border-top: 1px solid #D4AF37; margin: 0 50px;">konsultan-ai.com • Hak Cipta &copy; Hoodtech • Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span></div>',
    margin: {
      top: '0px',
      bottom: '60px',
      left: '0px',
      right: '0px'
    }
  });
  
  await browser.close();
  console.log('PDF generated: Proposal_BPHN_KonsultanAI.pdf');
})();
