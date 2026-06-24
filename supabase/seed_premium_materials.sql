-- Seed Premium Materials for Paid Subscribers
-- New Categories
INSERT INTO public.legal_categories (id, name, description) VALUES
('c5000000-0000-0000-0000-000000000005', 'Hukum Ketenagakerjaan', 'Pahami hak-hak pekerja, PHK, pesangon, kontrak kerja, dan penyelesaian sengketa hubungan industrial.'),
('c6000000-0000-0000-0000-000000000006', 'Hukum Perjanjian & Kontrak', 'Pelajari syarat sah kontrak, wanprestasi, MoU, NDA, dan cara menyusun perjanjian yang mengikat secara hukum.'),
('c7000000-0000-0000-0000-000000000007', 'Hukum Pajak & Keuangan', 'Panduan perpajakan untuk individu dan badan usaha, termasuk sanksi pajak, pelaporan SPT, dan penyelesaian sengketa pajak.')
ON CONFLICT DO NOTHING;
