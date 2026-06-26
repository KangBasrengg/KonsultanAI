(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,11241,a=>{"use strict";let e=(0,a.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);a.s(["ArrowLeft",0,e],11241)},51757,a=>{"use strict";let e=(0,a.i(56420).default)("circle-check",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);a.s(["CheckCircle2",0,e],51757)},62368,a=>{"use strict";let e=(0,a.i(56420).default)("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]);a.s(["Download",0,e],62368)},13289,a=>{"use strict";let e=[{id:"somasi-penipuan",category:"somasi",title:"Surat Somasi (Dugaan Penipuan)",description:"Template surat teguran hukum (somasi) untuk kasus dugaan tindak pidana penipuan dan/atau penggelapan.",tier_required:"free",placeholders:[{key:"KOTA_TANGGAL",label:"Kota dan Tanggal Surat",type:"text",required:!0},{key:"NAMA_PENERIMA",label:"Nama Penerima Somasi",type:"text",required:!0},{key:"ALAMAT_PENERIMA",label:"Alamat Penerima",type:"text",required:!0},{key:"NAMA_PENGIRIM",label:"Nama Anda (Pengirim)",type:"text",required:!0},{key:"ALAMAT_PENGIRIM",label:"Alamat Anda",type:"text",required:!0},{key:"TANGGAL_KEJADIAN",label:"Tanggal Kejadian",type:"date",required:!0},{key:"NOMINAL_KERUGIAN",label:"Nominal Kerugian (Rp)",type:"number",required:!0},{key:"BATAS_WAKTU",label:"Batas Waktu (Hari)",type:"number",required:!0}],content:`
**HAL: SOMASI / TEGURAN HUKUM PERTAMA DAN TERAKHIR**

[KOTA_TANGGAL]

Kepada Yth.,
Sdr/i. **[NAMA_PENERIMA]**
di 
[ALAMAT_PENERIMA]

Dengan hormat,

Yang bertanda tangan di bawah ini, saya **[NAMA_PENGIRIM]**, bertempat tinggal di [ALAMAT_PENGIRIM], dengan ini menyampaikan SOMASI (Teguran Hukum) kepada Saudara/i dengan alasan-alasan sebagai berikut:

1. Bahwa pada tanggal [TANGGAL_KEJADIAN], Saudara/i telah melakukan tindakan yang merugikan saya secara materil sebesar Rp [NOMINAL_KERUGIAN].
2. Bahwa tindakan Saudara/i tersebut patut diduga telah memenuhi unsur tindak pidana Penipuan dan/atau Penggelapan sebagaimana diatur dalam Pasal 378 dan/atau Pasal 372 Kitab Undang-Undang Hukum Pidana (KUHP).
3. Bahwa hingga surat somasi ini diterbitkan, Saudara/i belum menunjukkan itikad baik untuk menyelesaikan kewajiban dan mengembalikan kerugian saya.

Berdasarkan hal-hal tersebut di atas, dengan ini saya memberikan TEGURAN KERAS agar Saudara/i segera mengembalikan dana sebesar Rp [NOMINAL_KERUGIAN] kepada saya selambat-lambatnya dalam waktu **[BATAS_WAKTU] hari** sejak diterimanya surat ini.

Apabila dalam batas waktu tersebut Saudara/i tidak juga menunjukkan itikad baik, maka saya akan menempuh jalur hukum secara tegas, baik pelaporan pidana ke pihak Kepolisian RI maupun gugatan perdata di Pengadilan Negeri.

Demikian surat somasi ini dibuat agar menjadi perhatian Saudara/i.

Hormat saya,


( **[NAMA_PENGIRIM]** )
    `},{id:"perjanjian-pinjam-uang",category:"perjanjian",title:"Surat Perjanjian Pinjam Meminjam Uang",description:"Template dasar perjanjian utang piutang antar individu untuk melindungi hak hukum.",tier_required:"basic",placeholders:[{key:"HARI_TANGGAL",label:"Hari dan Tanggal",type:"text",required:!0},{key:"NAMA_PIHAK_1",label:"Nama Pihak Pertama (Peminjam)",type:"text",required:!0},{key:"NIK_PIHAK_1",label:"NIK Pihak Pertama",type:"number",required:!0},{key:"ALAMAT_PIHAK_1",label:"Alamat Pihak Pertama",type:"text",required:!0},{key:"NAMA_PIHAK_2",label:"Nama Pihak Kedua (Pemberi Pinjaman)",type:"text",required:!0},{key:"NIK_PIHAK_2",label:"NIK Pihak Kedua",type:"number",required:!0},{key:"ALAMAT_PIHAK_2",label:"Alamat Pihak Kedua",type:"text",required:!0},{key:"NOMINAL_PINJAMAN",label:"Nominal Pinjaman (Rp)",type:"number",required:!0},{key:"TANGGAL_JATUH_TEMPO",label:"Tanggal Jatuh Tempo",type:"date",required:!0}],content:`
**SURAT PERJANJIAN PINJAM MEMINJAM UANG**

Pada hari ini, [HARI_TANGGAL], kami yang bertanda tangan di bawah ini:

1. Nama: **[NAMA_PIHAK_1]**
   NIK: [NIK_PIHAK_1]
   Alamat: [ALAMAT_PIHAK_1]
   Selanjutnya disebut sebagai **PIHAK PERTAMA (Peminjam)**.

2. Nama: **[NAMA_PIHAK_2]**
   NIK: [NIK_PIHAK_2]
   Alamat: [ALAMAT_PIHAK_2]
   Selanjutnya disebut sebagai **PIHAK KEDUA (Pemberi Pinjaman)**.

Kedua belah pihak sepakat untuk mengadakan perjanjian utang piutang dengan syarat dan ketentuan sebagai berikut:

**Pasal 1: Besaran Pinjaman**
PIHAK KEDUA telah memberikan pinjaman uang tunai/transfer kepada PIHAK PERTAMA sebesar **Rp [NOMINAL_PINJAMAN]** dan PIHAK PERTAMA mengakui telah menerima uang tersebut secara penuh.

**Pasal 2: Jangka Waktu & Pengembalian**
PIHAK PERTAMA berjanji akan mengembalikan pinjaman tersebut secara lunas kepada PIHAK KEDUA selambat-lambatnya pada tanggal **[TANGGAL_JATUH_TEMPO]**.

**Pasal 3: Penyelesaian Sengketa**
Apabila terjadi perselisihan, kedua belah pihak sepakat menyelesaikan secara kekeluargaan. Jika tidak tercapai mufakat, maka akan diselesaikan melalui jalur hukum sesuai ketentuan hukum yang berlaku di Indonesia.

Demikian Surat Perjanjian ini dibuat dan ditandatangani oleh kedua belah pihak dalam keadaan sadar dan tanpa paksaan.

**PIHAK PERTAMA**
(materai 10.000)

**[NAMA_PIHAK_1]**

**PIHAK KEDUA**


**[NAMA_PIHAK_2]**
    `},{id:"kuasa-insidentil",category:"kuasa",title:"Surat Kuasa Insidentil (Keluarga)",description:"Template surat kuasa khusus bagi keluarga untuk mewakili di pengadilan tanpa advokat.",tier_required:"basic",placeholders:[{key:"NAMA_PEMBERI",label:"Nama Pemberi Kuasa",type:"text",required:!0},{key:"ALAMAT_PEMBERI",label:"Alamat Pemberi",type:"text",required:!0},{key:"NAMA_PENERIMA",label:"Nama Penerima Kuasa",type:"text",required:!0},{key:"ALAMAT_PENERIMA",label:"Alamat Penerima",type:"text",required:!0},{key:"HUBUNGAN",label:"Hubungan Kekeluargaan (mis. Suami, Anak)",type:"text",required:!0},{key:"NAMA_PENGADILAN",label:"Nama Pengadilan (mis. PN Jakarta Selatan)",type:"text",required:!0},{key:"HAL_KASUS",label:"Hal / Kasus",type:"text",required:!0},{key:"KOTA_TANGGAL",label:"Kota dan Tanggal Surat",type:"text",required:!0}],content:`
**SURAT KUASA INSIDENTIL**

Yang bertanda tangan di bawah ini:
Nama: **[NAMA_PEMBERI]**
Alamat: [ALAMAT_PEMBERI]
Selanjutnya disebut sebagai **PEMBERI KUASA**.

Dengan ini memberikan kuasa kepada keluarga saya:
Nama: **[NAMA_PENERIMA]**
Alamat: [ALAMAT_PENERIMA]
Hubungan: [HUBUNGAN]
Selanjutnya disebut sebagai **PENERIMA KUASA**.

**------------------------- KHUSUS -------------------------**

Untuk dan atas nama PEMBERI KUASA, mewakili dan mendampingi Pemberi Kuasa di **[NAMA_PENGADILAN]** sebagai Penggugat/Tergugat/Pemohon/Termohon dalam perkara:

**"[HAL_KASUS]"**

Untuk itu Penerima Kuasa berhak menghadiri semua persidangan, menghadap hakim, menyerahkan alat-alat bukti, mengajukan saksi-saksi, menandatangani surat-surat, meminta putusan, dan melakukan segala tindakan hukum yang diperlukan demi membela hak-hak Pemberi Kuasa sejauh diperbolehkan hukum.

Kekuasaan ini diberikan dengan hak substitusi maupun retensi.

[KOTA_TANGGAL]

**PENERIMA KUASA**


**[NAMA_PENERIMA]**

**PEMBERI KUASA**
(materai 10.000)

**[NAMA_PEMBERI]**
    `}];a.s(["getTemplateById",0,function(a){return e.find(e=>e.id===a)},"templates",0,e])},78002,a=>{"use strict";var e=a.i(43476),t=a.i(71645),n=a.i(18566),i=a.i(11241),r=a.i(62368),l=a.i(26091),d=a.i(51757),s=a.i(22016),u=a.i(18789),m=a.i(3265),A=a.i(2594),k=a.i(13289);a.s(["default",0,function({params:a}){(0,n.useRouter)();let{user:o,profile:p}=(0,A.useAuth)(),[b,h]=(0,t.useState)({}),[g,c]=(0,t.useState)(!1),x=(0,t.use)(a),y=(0,k.getTemplateById)(x.id);if((0,t.useEffect)(()=>{if(y){let a={};y.placeholders.forEach(e=>{a[e.key]=""}),h(a)}},[y]),!y)return(0,e.jsxs)("main",{className:"min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300",children:[(0,e.jsx)(l.FileText,{className:"w-16 h-16 text-navy/20 dark:text-putih/20 mb-4"}),(0,e.jsx)("h1",{className:"text-2xl font-bold text-navy dark:text-putih mb-2",children:"Template Tidak Ditemukan"}),(0,e.jsx)(s.default,{href:"/templates",className:"text-gold hover:underline",children:"Kembali ke Koleksi Template"})]});let N=y.content;return y.placeholders.forEach(a=>{let e=b[a.key]||`[${a.key}]`;N=N.split(`[${a.key}]`).join(e)}),(0,e.jsxs)("main",{className:"min-h-screen flex flex-col print:bg-white print:text-black transition-colors duration-300",children:[(0,e.jsx)("div",{className:"print:hidden",children:(0,e.jsx)(m.default,{})}),(0,e.jsx)("div",{className:"flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 print:p-0 print:m-0",children:(0,e.jsxs)("div",{className:"max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 print:block",children:[(0,e.jsxs)("div",{className:"w-full lg:w-1/3 space-y-6 print:hidden",children:[(0,e.jsxs)(s.default,{href:"/templates",className:"inline-flex items-center gap-2 text-navy/60 dark:text-putih/60 hover:text-gold transition-colors mb-4 font-medium",children:[(0,e.jsx)(i.ArrowLeft,{className:"w-4 h-4"})," Kembali ke Daftar"]}),(0,e.jsxs)("div",{className:"bg-white/80 dark:bg-navy-light/40 border border-slate-200 dark:border-putih/20 rounded-3xl p-6 backdrop-blur-md shadow-lg dark:shadow-none transition-all",children:[(0,e.jsx)("h2",{className:"text-xl font-bold text-navy dark:text-putih mb-2",children:y.title}),(0,e.jsx)("p",{className:"text-sm text-navy/60 dark:text-putih/50 mb-6 leading-relaxed",children:y.description}),(0,e.jsxs)("div",{className:"space-y-4",children:[(0,e.jsx)("h3",{className:"font-semibold text-gold border-b border-slate-200 dark:border-putih/10 pb-2",children:"Isi Data Dokumen"}),y.placeholders.map(a=>(0,e.jsxs)("div",{className:"space-y-1.5",children:[(0,e.jsxs)("label",{className:"block text-xs font-medium text-navy/80 dark:text-putih/80",children:[a.label," ",a.required&&(0,e.jsx)("span",{className:"text-red-500 dark:text-red-400",children:"*"})]}),"textarea"===a.type?(0,e.jsx)("textarea",{value:b[a.key]||"",onChange:e=>h({...b,[a.key]:e.target.value}),className:"w-full bg-white dark:bg-navy border border-slate-200 dark:border-putih/20 rounded-xl px-3 py-2 text-sm text-navy dark:text-putih focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 resize-y min-h-[80px] transition-all shadow-inner"}):(0,e.jsx)("input",{type:a.type,value:b[a.key]||"",onChange:e=>h({...b,[a.key]:e.target.value}),className:"w-full bg-white dark:bg-navy border border-slate-200 dark:border-putih/20 rounded-xl px-3 py-2.5 text-sm text-navy dark:text-putih focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all shadow-inner"})]},a.key))]}),(0,e.jsxs)("div",{className:"mt-8 space-y-3",children:[(0,e.jsxs)("button",{onClick:()=>{c(!0),setTimeout(()=>{window.print(),c(!1)},500)},disabled:g,className:"w-full flex items-center justify-center gap-2 bg-gold text-white dark:text-navy px-4 py-3.5 rounded-xl font-bold hover:bg-gold-light transition-all shadow-md shadow-gold/20",children:[(0,e.jsx)(r.Download,{className:"w-4 h-4"}),g?"Menyiapkan PDF...":"Cetak / Export PDF"]}),(0,e.jsxs)("button",{onClick:()=>{let a=new Blob([N],{type:"text/markdown"}),e=URL.createObjectURL(a),t=document.createElement("a");t.href=e,t.download=`${y.id}-draft.md`,document.body.appendChild(t),t.click(),document.body.removeChild(t),URL.revokeObjectURL(e)},className:"w-full flex items-center justify-center gap-2 bg-slate-50 dark:bg-navy border border-slate-200 dark:border-putih/20 text-navy dark:text-putih px-4 py-3.5 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-putih/10 transition-colors",children:[(0,e.jsx)(l.FileText,{className:"w-4 h-4"}),"Download Word/Markdown (.md)"]})]}),(0,e.jsxs)("div",{className:"mt-6 flex gap-3 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20",children:[(0,e.jsx)(d.CheckCircle2,{className:"w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0"}),(0,e.jsx)("p",{className:"text-[10px] sm:text-xs text-navy/70 dark:text-putih/70 leading-relaxed",children:"Data yang Anda isikan di sini hanya diproses di browser Anda (client-side) dan tidak disimpan di server kami demi privasi Anda."})]})]})]}),(0,e.jsx)("div",{className:"w-full lg:w-2/3 print:w-full",children:(0,e.jsx)("div",{className:"bg-white text-black min-h-[842px] rounded-2xl shadow-xl border border-slate-200 dark:border-none print:shadow-none p-10 md:p-16 text-sm font-serif",children:(0,e.jsx)("div",{className:"prose prose-sm md:prose-base max-w-none text-black prose-headings:text-black prose-headings:font-bold prose-headings:text-center prose-p:leading-relaxed prose-p:text-justify prose-strong:text-black",children:(0,e.jsx)(u.default,{children:N})})})})]})})]})}])}]);