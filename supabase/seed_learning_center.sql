-- Seed Data for Legal Learning Center

-- 1. Insert Categories
INSERT INTO public.legal_categories (id, name, description) VALUES
('c1000000-0000-0000-0000-000000000001', 'Hukum Pidana', 'Pelajari tentang tindak pidana, penipuan, penggelapan, dan proses hukum pidana dasar.'),
('c2000000-0000-0000-0000-000000000002', 'Hukum Perdata', 'Pahami tentang wanprestasi, perbuatan melawan hukum, dan hukum perjanjian.'),
('c3000000-0000-0000-0000-000000000003', 'Hukum Bisnis', 'Panduan legalitas usaha, kontrak kerja sama, hak kekayaan intelektual (HKI), dan sengketa.'),
('c4000000-0000-0000-0000-000000000004', 'Hukum Teknologi & ITE', 'Dasar UU ITE, penipuan online, keamanan data pribadi, dan jejak digital.')
ON CONFLICT DO NOTHING;

-- 2. Insert Materials
INSERT INTO public.legal_materials (id, category_id, title, content, order_index, is_premium, required_tier) VALUES
-- Hukum Pidana
('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Dasar-dasar Hukum Pidana di Indonesia', 'Materi ini membahas pengantar hukum pidana di Indonesia, mencakup definisi tindak pidana, asas legalitas, dan perbedaan antara pelanggaran dan kejahatan.', 1, false, 'free'),
('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Langkah Hukum Kasus Penipuan', 'Panduan praktis tentang apa yang harus dilakukan jika Anda menjadi korban penipuan (Pasal 378 KUHP), mulai dari pengumpulan bukti hingga pelaporan ke kepolisian.', 2, true, 'basic'),

-- Hukum Perdata
('d2000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000002', 'Memahami Wanprestasi (Ingkar Janji)', 'Penjelasan lengkap mengenai wanprestasi, syarat-syarat terjadinya wanprestasi, dan langkah hukum somasi sebelum mengajukan gugatan perdata ke pengadilan.', 1, false, 'free'),
('d2000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000002', 'Perbuatan Melawan Hukum (PMH)', 'Kupas tuntas Pasal 1365 KUHPerdata tentang Perbuatan Melawan Hukum. Kapan seseorang bisa dituntut ganti rugi atas kerugian yang disebabkannya.', 2, true, 'basic'),

-- Hukum Bisnis
('d3000000-0000-0000-0000-000000000001', 'c3000000-0000-0000-0000-000000000003', 'Panduan Legalitas Usaha (PT, CV, Perorangan)', 'Perbandingan berbagai bentuk badan usaha di Indonesia serta panduan dasar mendirikan PT (Perseroan Terbatas) sesuai UU Cipta Kerja terbaru.', 1, false, 'free'),
('d3000000-0000-0000-0000-000000000002', 'c3000000-0000-0000-0000-000000000003', 'Dasar-dasar Kontrak Bisnis', 'Cara menyusun kontrak kerja sama (MoU, Perjanjian Kerahasiaan/NDA, Perjanjian Kerja Sama) yang sah dan mengikat secara hukum agar aman dari risiko sengketa.', 2, true, 'professional'),
('d3000000-0000-0000-0000-000000000003', 'c3000000-0000-0000-0000-000000000003', 'Masterclass: Menyusun Kontrak Bisnis Anti-Bocor & Strategi Ekspansi', 'Materi eksklusif ini membahas secara mendalam anatomi kontrak bisnis tingkat lanjut. Anda akan belajar dari studi kasus nyata di mana perusahaan kehilangan miliaran rupiah hanya karena satu celah kecil dalam klausa "Force Majeure" dan "Confidentiality".\n\n### Yang Akan Anda Pelajari:\n1. **Drafting Klausa Ekstrem:** Memastikan hak intelektual dan aset perusahaan aman 100%.\n2. **Negosiasi Kontrak:** Trik psikologis legal dalam memenangkan kesepakatan dengan vendor atau investor besar.\n3. **Mitigasi Risiko:** Menambal celah hukum yang sering dimanfaatkan kompetitor.\n\n> **Nilai Tambah (Sales Pitch):** \n> Membangun bisnis yang solid (scale-up) tidak bisa hanya mengandalkan template gratisan. Anda butuh penjahit jas hukum (lawyer) yang mengerti arah bisnis Anda. Dengan berlangganan paket **Business**, Anda tidak hanya mendapatkan seluruh materi premium kami, tetapi juga **Akses Prioritas ke Advokat Korporat Bintang 5** di KonsultanAI. Jangan pertaruhkan aset Anda, pastikan setiap tanda tangan Anda memiliki perisai hukum yang mutlak.', 3, true, 'business'),

-- Hukum Teknologi & ITE
('d4000000-0000-0000-0000-000000000001', 'c4000000-0000-0000-0000-000000000004', 'Dasar UU ITE dan Revisinya', 'Pemahaman dasar mengenai Undang-Undang Informasi dan Transaksi Elektronik, termasuk pasal karet tentang pencemaran nama baik dan ujaran kebencian.', 1, false, 'free'),
('d4000000-0000-0000-0000-000000000002', 'c4000000-0000-0000-0000-000000000004', 'Keamanan Data Pribadi (UU PDP)', 'Kewajiban perusahaan dan hak pengguna berdasarkan Undang-Undang Pelindungan Data Pribadi. Apa yang harus dilakukan bila data Anda bocor?', 2, true, 'professional'),
('d4000000-0000-0000-0000-000000000003', 'c4000000-0000-0000-0000-000000000004', 'Masterclass: Mitigasi Risiko Kebocoran Data (UU PDP) untuk Startup', 'Berdasarkan UU Pelindungan Data Pribadi (PDP) terbaru, kegagalan melindungi data pengguna bukan sekadar teguran—ini berarti ancaman pidana dan denda yang bisa membuat startup Anda gulung tikar seketika. Materi ini didesain khusus untuk Founder, CEO, dan CTO.\n\n### Fokus Utama Pembahasan:\n1. **Audit Kepatuhan UU PDP:** Langkah taktis menilai seberapa rentan database Anda di mata hukum.\n2. **Protokol Insiden:** Apa yang secara hukum WAJIB Anda lakukan dalam 3x24 jam setelah peretas membobol server Anda.\n3. **Legal Framework Ekosistem Digital:** Memastikan Terms & Conditions dan Privacy Policy Anda bukan sekadar *copy-paste* dari Google.\n\n> **Lindungi Valuasi Perusahaan Anda:**\n> Kerugian finansial bisa dicari, namun hilangnya kepercayaan publik dan tuntutan class-action adalah akhir dari startup. **Tingkatkan perlindungan perusahaan Anda sekarang.** Langganan paket **Professional** atau **Business** untuk mendapatkan evaluasi risiko berkala dan pendampingan *cyber law* eksklusif. Kami menjaga punggung Anda, agar Anda bisa fokus membesarkan bisnis.', 3, true, 'professional'),

-- Tambahan Pidana
('d1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'Strategi Defensif: Menghadapi Tuduhan Pidana Korporasi', 'Pidana korporasi seringkali menjadi jebakan bagi direksi yang kurang waspada terhadap aktivitas operasional bawahannya (Vicarious Liability). Materi advanced ini membongkar bagaimana hukum pidana menjerat entitas bisnis.\n\n### Strategi Bertahan:\n1. **Memahami Doktrin Strict Liability** dalam hukum lingkungan dan bisnis di Indonesia.\n2. **Taktik Pre-emptive:** Membuat Standard Operating Procedure (SOP) yang membebaskan direksi dari jerat pidana bawahan.\n3. **Manajemen Krisis Legal:** Langkah pertama saat perusahaan Anda digeledah atau mendapat panggilan BAP dari penyidik.\n\n> **Keamanan Eksekutif:**\n> Jabatan tinggi memiliki risiko yang tinggi pula. Jangan hadapi penyidik tanpa amunisi yang tepat. Pengguna paket **Professional** di KonsultanAI dapat langsung berkonsultasi secara privat dengan pakar hukum pidana yang telah memiliki jam terbang tinggi, memastikan Anda selalu selangkah lebih maju dari risiko hukum.', 3, true, 'professional')
ON CONFLICT DO NOTHING;

-- 3. Insert Quizzes
INSERT INTO public.legal_quizzes (material_id, question, options, correct_option_index) VALUES
-- Kuis Hukum Pidana
('d1000000-0000-0000-0000-000000000001', 'Asas hukum pidana yang menyatakan tiada pidana tanpa undang-undang disebut?', '["Asas Praduga Tak Bersalah", "Asas Legalitas", "Asas Proporsionalitas", "Asas Subsidiaritas"]', 1),
('d1000000-0000-0000-0000-000000000002', 'Pasal berapa dalam KUHP yang mengatur tentang tindak pidana penipuan?', '["Pasal 362", "Pasal 338", "Pasal 378", "Pasal 372"]', 2),

-- Kuis Hukum Perdata
('d2000000-0000-0000-0000-000000000001', 'Surat teguran yang diberikan kepada pihak yang ingkar janji (wanprestasi) sebelum digugat ke pengadilan disebut?', '["Somasi", "Pledoi", "Eksepsi", "Replik"]', 0),
('d2000000-0000-0000-0000-000000000002', 'Pasal 1365 KUHPerdata mengatur mengenai?', '["Pewarisan", "Perceraian", "Wanprestasi", "Perbuatan Melawan Hukum (PMH)"]', 3),

-- Kuis Hukum Bisnis
('d3000000-0000-0000-0000-000000000001', 'Badan usaha berbadan hukum yang pertanggungjawaban modalnya terbatas pada saham yang dimiliki adalah?', '["Firma", "CV (Commanditaire Vennootschap)", "PT (Perseroan Terbatas)", "Koperasi"]', 2),
('d3000000-0000-0000-0000-000000000002', 'Perjanjian yang bertujuan menjaga kerahasiaan informasi bisnis disebut?', '["MoU", "NDA (Non-Disclosure Agreement)", "SLA", "Surat Kuasa"]', 1),

-- Kuis Hukum Teknologi & ITE
('d4000000-0000-0000-0000-000000000001', 'Undang-Undang yang mengatur transaksi dan informasi elektronik di Indonesia adalah?', '["UU PDP", "UU ITE", "UU Hak Cipta", "UU Konsumen"]', 1)
ON CONFLICT DO NOTHING;
