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

-- Hukum Teknologi & ITE
('d4000000-0000-0000-0000-000000000001', 'c4000000-0000-0000-0000-000000000004', 'Dasar UU ITE dan Revisinya', 'Pemahaman dasar mengenai Undang-Undang Informasi dan Transaksi Elektronik, termasuk pasal karet tentang pencemaran nama baik dan ujaran kebencian.', 1, false, 'free'),
('d4000000-0000-0000-0000-000000000002', 'c4000000-0000-0000-0000-000000000004', 'Keamanan Data Pribadi (UU PDP)', 'Kewajiban perusahaan dan hak pengguna berdasarkan Undang-Undang Pelindungan Data Pribadi. Apa yang harus dilakukan bila data Anda bocor?', 2, true, 'professional')
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
