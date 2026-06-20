# PRD Update 2.5: KonsultanAI
## Fitur Prioritas untuk Solo Developer + Government Intelligence Layer

**Version:** 2.5  
**Last Updated:** Juni 2026  
**Status:** Ready for Implementation (Phase 1 & 2)

---

## Executive Summary

Update ini mengintegrasikan **3 fitur strategis** yang meningkatkan value proposition tanpa menambah kompleksitas teknis terlalu tinggi untuk solo developer:

1. **Intake Form + AI Triage System** — Menggantikan free chat randomizer dengan sistem intake terstruktur yang meningkatkan akurasi analisis & data quality
2. **Case Template Library** — Koleksi template dokumen hukum untuk kasus umum (somasi, perjanjian, kuasa)
3. **Government Analytics Dashboard** — Business tier exclusive: anonymized aggregate data insights untuk agencies + private sector legal intelligence

**Business Impact:**
- Improved UX & data quality (intake form)
- Revenue multiplier via Business tier (gov + enterprise)
- Competitive moat (government partnership potential)
- Privacy-first design (reduce regulatory risk)

---

## 1. Core Changes to Existing Features

### 1.1 AI Legal Assistant → AI Legal Assistant + Intake Form System

**Current Flow:**
```
User → Free Chat (1x) / Subscription Chat → Export PDF → (Optional) Book Advokat
```

**New Flow:**
```
User → Intake Form (Structured) → AI Classifier/Triage → Routing Decision → Output
                                                              ├─ Learning Center (recommendation)
                                                              ├─ Advokat Marketplace (direct booking)
                                                              └─ Deep AI Analysis (paid)
```

#### Intake Form Structure

**Mandatory Fields:**
1. **Jenis Kasus** (Dropdown)
   - Pidana: Penipuan, Kekerasan, Pencurian, Lainnya
   - Perdata: Perceraian, Sengketa Tanah, Utang, Sengketa Bisnis, Lainnya
   - Keluarga: Waris, Perwalian, Adopsi
   - Bisnis & Komersial: Kontrak, IP, Labor, Lainnya

2. **Wilayah/Lokasi** (Dropdown + Autocomplete)
   - Auto-populate untuk Learning Center yang relevan (Perda, regulasi lokal)
   - Digunakan untuk government dashboard filtering

3. **Kronologi Singkat** (Textarea, min 100 karakter)
   - Deskripsi detail: apa yang terjadi, kapan, siapa pihak lain
   - Digunakan untuk LLM context dalam analisis

4. **Jumlah Nilai (Jika Relevan)** (Number field, optional)
   - Contoh: utang Rp 500jt, kerugian Rp 2 miliar
   - Digunakan untuk case severity classifier & statistics

5. **Tingkat Urgensi** (Radio)
   - Immediate (< 7 hari)
   - Normal (1-4 minggu)
   - Planning (> 1 bulan)
   - Digunakan untuk advokat recommendation prioritization

6. **Sudah ada Advokat?** (Yes/No)
   - Jika Yes → skip marketplace recommendation
   - Jika No → show marketplace options

**Optional Fields:**
- Sudah lapor ke kepolisian? (for statistical tracking)
- Ada dokumen pendukung? (file upload)

#### AI Triage Logic (Post-Submission)

LLM receives:
```
System Prompt:
"Anda adalah legal case classifier. Analisis kasus berikut dan berikan:
1. Case category confidence (pidana/perdata/keluarga/bisnis)
2. Severity level (1-5)
3. Recommended path: [AI_ANALYSIS | LEARNING_FIRST | ADVOKAT_URGENT | TEMPLATES]
4. If AI_ANALYSIS: provide initial assessment + critical questions for follow-up
5. Learning modules to recommend (max 3)
6. If advokat needed: urgency level for marketplace filtering"
```

**Classifier Output → Routing Logic:**

| Severity | Urgency | Recommendation | Action |
|----------|---------|-----------------|--------|
| 1-2 (Low) | Normal | LEARNING_FIRST | Show relevant Learning Modules + Templates |
| 2-3 (Medium) | Normal | AI_ANALYSIS | Run deep AI analysis + option to book advokat |
| 3-4 (Medium-High) | Immediate | ADVOKAT_URGENT | Show verified advocates + skip learning |
| 4-5 (Critical) | Immediate | ADVOKAT_URGENT | Show verified advocates + skip learning |

#### User Experience (Post-Form)

**For Free Tier:**
- Intake form submission = counts as 1 free trial (replaces old "1x free chat")
- Receive: AI triage result (text) + recommended learning modules + templates
- Option to upgrade for deeper analysis

**For Paid Tiers (Basic+):**
- Unlimited intake submissions + follow-up AI conversations
- Full analysis report
- Can ask follow-up questions in chat (continuation of analysis)

---

### 1.2 Learning Center — Tier-Based + Contextual Recommendations

**No structural change**, but now receives:

- **AI-recommended modules** based on intake form classification
- **Perda/lokal regulations** auto-filtered by wilayah (user's location from form)
- **Learning path suggestion** (contoh: "Sebelum konsultasi advokat perceraian, kami sarankan Module 3.2: Hak Asuh Anak")

Example: User intake → Kasus perceraian di Jakarta → Platform auto-suggest:
- Module: Hukum Keluarga (Free Tier preview)
- Module: Perda Jakarta Tentang Keluarga (if exists)
- Module: Hak Asuh Anak (Pro Tier)
- Template: Surat Kuasa untuk Kasus Perceraian (Basic Tier+)

---

### 1.3 Advocate Marketplace — Verification + Badging System

**Current State:** Advokat list dengan experience (tahun) + case count.

**New Addition:** Verification Badge System

#### Verification Levels

**🟡 Unverified**
- Default status
- Can still list, but flagged as "Belum Diverifikasi"
- Lower visibility in search results

**🟢 Verified**
- Nomor Induk Beracara confirmed (via KAI database or manual upload STPI scan)
- Appears higher in search results
- Trust indicator for users

**🔵 Certified Partner**
- Firma hukum ternama atau track record exceptional (10+ cases, all positive)
- Manual verification by admin
- Featured placement option

#### Verification Flow (Admin Panel)

1. Advokat uploads STPI scan + Nomor Induk Beracara
2. Admin manually checks KAI database or accepts scan as evidence
3. Badge applied automatically + email confirmation
4. Re-verification required: every 2 years (to keep STPI current)

**Implementation Effort:** Low
- Add `verification_status` (enum: unverified, verified, certified) to advokat profile
- Add verification timestamp + STPI document storage
- Filter/sort marketplace by verification status
- Display badge on advokat card

---

## 2. New Features (Phase 1 & 2)

### 2.1 Case Template Library (Phase 1 - Weeks 1-2)

**Purpose:** Enable users to self-serve with common legal documents, reduce dependency on advokat for routine paperwork.

**Templates Included (MVP):**

1. **Surat Somasi** (3 variants)
   - Untuk penipuan/utang
   - Untuk wanprestasi kontrak
   - Generic multi-purpose

2. **Perjanjian Dasar**
   - Perjanjian Pinjam Uang
   - Perjanjian Sewa-Menyewa Rumah
   - Perjanjian Kerja Sama Sederhana (partnership)

3. **Surat Kuasa**
   - Untuk litigasi
   - Untuk administrasi (bank, notaris)
   - Generic

4. **Dokumen Perceraian (Basic)**
   - Surat Permohonan Cerai Gugat (template overview)
   - List dokumen apa yang harus disiapkan

5. **Dokumen Ketenagakerjaan**
   - Surat Perjanjian Kerja Sederhana
   - Surat Pengakhiran Hubungan Kerja

#### Template Format & Delivery

**Storage:** Markdown + Fillable HTML template
```
Template file structure:
/templates
  /somasi
    /penipuan.md (dengan placeholder: [NAMA_PENGGUGAT], [ALAMAT], [JUMLAH], dll)
  /perjanjian
    /pinjam_uang.md
  /kuasa
    /litigasi.md
  ...
```

**User Flow:**
1. User → Learning Center / Marketplace / After Intake Form → "Templates" section
2. User select template category → choose template → fill placeholders
3. Download as: Word (.docx), PDF, atau Markdown
4. Note: "Template ini hanya referensi. Konsultasi advokat untuk kasus Anda yang spesifik."

#### Tier Access

| Tier | Access |
|------|--------|
| Free | Preview (1-2 templates max, watermarked) |
| Basic | All templates, downloadable (PDF) |
| Professional | All templates + fillable Word (.docx) |
| Business | All templates + customization support (via email) |

**Implementation Effort:** Low
- Create templates in Markdown/HTML
- Build template selector UI (dropdown + preview)
- PDF generation (use existing export pipeline)
- Word generation (use `docx` library or similar)

---

### 2.2 Government Analytics Dashboard (Phase 2 - Weeks 3-8)

**Audience:** Government agencies (PEMDA, Polda, Kejaksaan, etc.) + Large Legal Firms

**Access:** Business Tier Subscription (dedicated account type: "Government Account" or "Enterprise")

#### Data Collection & Anonymization Policy

**What Gets Collected:**
- Case intake form submissions (all fields except identifying info)
- Case outcome (if user provides update)
- Case closure timestamp
- Location (kabupaten/kota level)

**Anonymization Rule:**
- NO personal identifiers stored in analytics table (names, IDs, phone, emails removed)
- Only metadata retained: case type, severity, location, timestamps, outcome
- Original case data (with identifiers) stored separately, access-controlled

**Data Retention Policy:**

| Data State | Retention Period | Storage | Access |
|-----------|-----------------|---------|--------|
| Active Case (ongoing) | Unlimited | Full detail (identifiable) | Case owner + advokat + admin |
| Completed Case | 2 years | Full detail (identifiable) | Case owner + advokat + admin |
| After 2 years | Anonymize | Anonymized only | Analytics dashboard only |
| User Deletion Request | Permanent deletion | All records | 30-day deletion window |

**Compliance Basis:**
- Indonesia Personal Data Protection Law (UU PDP)
- Right to be forgotten (user can request deletion anytime)
- GDPR-adjacent best practice

#### Dashboard Features

**Role-Based Access:**

**Government Admin (PEMDA/Polda/Kejaksaan):**
- View: Aggregate data for their wilayah (kabupaten/kota/provinsi)
- Filters: Date range, case type, severity level, outcome
- Metrics:
  - Case volume trends (month-over-month)
  - Case type distribution (pie chart)
  - Case severity distribution
  - Average resolution timeline
  - Top issues by location (map visualization)
- Cannot see: Individual case identifiers, user/advokat names
- Export: CSV/PDF report generation

**Example Dashboard View (Polda Jakarta):**
```
Polda Jakarta - Case Intelligence Dashboard (June 2026)

Metrics:
├─ Total Cases (June): 247
├─ Case Volume Trend: ↑ 8% vs May
├─ New Cases This Week: 52
└─ Active Cases: 189

Distribution:
├─ Pidana: 35% (86 cases)
│  └─ Top sub-type: Penipuan (42 cases)
├─ Perdata: 45% (111 cases)
│  └─ Top sub-type: Sengketa Tanah (38 cases)
└─ Keluarga: 20% (50 cases)
   └─ Top sub-type: Perceraian (35 cases)

Severity Trend (Past 3 Months):
├─ Critical (Severity 4-5): ↑ 12%
├─ Medium (Severity 2-3): ↓ 3%
└─ Low (Severity 1): → 0%

Geographic Heat Map: [Interactive map showing case density by kabupaten]

Resolution Timeline (Average):
├─ Pidana Ringan: 45 days
├─ Pidana Berat: 120 days
└─ Perdata: 150 days
```

**Enterprise/Law Firm Admin (Business Tier):**
- View: Aggregate data across all wilayah (national)
- Filters: All government filters + firm comparison (competing market data)
- Metrics:
  - Market size by case type
  - Case volume by wilayah
  - Emerging case trends (predict demand)
- Use case: "Kami akan buka kantor cabang di Medan karena trend perceraian naik 25% year-over-year"
- Cannot see: Individual identifiers

**Platform Admin:**
- Full access to all data (for system health monitoring)
- Can generate reports for all agencies/firms
- Monitor data quality & compliance

#### Technical Architecture

**Database Changes:**

```sql
-- New table for anonymized analytics
CREATE TABLE case_analytics (
  id UUID PRIMARY KEY,
  case_type VARCHAR (case_type matched to intake form),
  sub_category VARCHAR,
  severity_level INT (1-5),
  urgency_level VARCHAR,
  wilayah_kabupaten VARCHAR,
  wilayah_provinsi VARCHAR,
  created_at TIMESTAMP,
  closed_at TIMESTAMP NULL,
  outcome VARCHAR (settled, ongoing, escalated, abandoned),
  has_advokat BOOLEAN,
  PRIMARY KEY (id),
  INDEX (wilayah_kabupaten, created_at),
  INDEX (case_type, created_at)
);

-- Original case data (with identifiers) remains in original table
-- Row-level security: analytics table accessible only to authorized roles
-- Scheduled job: Every month, anonymize cases older than 2 years
```

**Data Pipeline:**

1. **Intake Form Submission** → Create two records:
   - `cases` table (identifiable, user-owned)
   - `case_analytics` table (anonymized, for dashboards)

2. **Monthly Cron Job** (automated):
   - Find cases closed > 2 years ago
   - Remove identifying columns from analytics record (or archive to separate table)
   - Retain case_type, severity, wilayah, timestamps

3. **User Deletion Request**:
   - Delete from `cases` table
   - Flag corresponding `case_analytics` record as deleted (retention: 30 days before purge)

**API Endpoints (New):**

```
GET /api/analytics/dashboard
  - Query params: wilayah, date_range, case_type
  - Returns: aggregated metrics + chart data
  - Access: Business tier + Government role only

GET /api/analytics/trends
  - Query params: metric_type (case_volume, severity, outcome), period (month/quarter/year)
  - Returns: time-series data
  - Access: Business tier + Government role only

GET /api/analytics/export
  - Query params: format (csv/pdf), date_range
  - Returns: downloadable report
  - Access: Business tier + Government role only
```

#### Dashboard Implementation (Frontend)

**Tech Stack:**
- Charting: Recharts (already using) or Chart.js
- Map: Leaflet (free, OSS)
- Export: PDF via jsPDF, CSV via PapaParse
- State: React hooks + TanStack Query (already using via Vercel AI SDK ecosystem)

**Components:**
- KPI cards (total cases, trend indicators)
- Line chart (case volume over time)
- Pie/bar chart (distribution by type)
- Map (geographic heat map)
- Data table (sortable, filterable)
- Date range picker + export button

**UI Consideration:**
- Dark mode compatible (per existing design)
- Mobile responsive (dashboard on tablet)
- Performance: lazy load charts, virtualize tables

#### Monetization & Access Control

**Business Tier Pricing Expansion:**

Current (Assumed):
```
Free: 1x free trial
Basic: Rp 99k/month (10 chats/month, learning basic)
Professional: Rp 299k/month (unlimited chats, learning pro)
Business: Rp 999k/month (unlimited + ???)
```

**Proposed Business Tier Update:**

| Feature | Free | Basic | Professional | Business |
|---------|------|-------|--------------|----------|
| AI Chats/month | 1 (trial) | 10 | Unlimited | Unlimited |
| Learning Modules | Free only | Basic | Professional | All |
| Templates | Watermarked preview | PDF | Fillable Word | Custom support |
| Advocate Marketplace | View only | Booking | Booking + messaging | Booking + messaging + featured |
| **Analytics Dashboard** | ❌ | ❌ | ❌ | ✅ Government Only |
| **Government Data Export** | ❌ | ❌ | ❌ | ✅ |
| **Custom Reports** | ❌ | ❌ | ❌ | ✅ |
| Price/month | Free | Rp 99k | Rp 299k | **Rp 1.5-5M** (tiered by user seat) |

**Government Account Specific Pricing:**

```
Government Agency Base: Rp 2M/month (1 admin account)
  + Per Additional User Seat: Rp 300k/month/user
  
Enterprise/Law Firm Base: Rp 1.5M/month (1 admin account)
  + Per Additional User Seat: Rp 200k/month/user
  
Example:
- PEMDA Bandung (5 users): Rp 2M + (4 × Rp 300k) = Rp 3.2M/month
- Law Firm X (10 users): Rp 1.5M + (9 × Rp 200k) = Rp 3.3M/month
```

**Who Needs Business Tier:**

1. **Government Agencies (Primary Target)**
   - **PEMDA Dinas Hukum & HAM** → Monitor case trends, compliance gaps, education priorities
   - **Kepolisian (Polda, Polres)** → Early warning for crime patterns, resource allocation
   - **Kejaksaan** → Prosecution intelligence, case prioritization
   - **Mahkamah Agung** → Supreme court case outcome analytics
   - **Notaris/PPAT Association** → Dispute tracking, professional development

2. **Private Sector (Secondary Target)**
   - **Firma Hukum Besar** → Market intelligence, competitive positioning, lead generation
   - **Bank/Fintech** → Fraud pattern detection (loan disputes, payment fraud)
   - **Insurance Companies** → Claim pattern analysis (asuransi properti, asuransi keluarga)
   - **Corporate Legal Teams** → Employment dispute trends, contract dispute patterns
   - **Real Estate Developers** → Land dispute analytics

3. **Potential Revenue Sources**
   - 5-10 government agencies per province (estimate: 34 provinces × 8 agencies = 272 targets)
   - 10-20 major law firms per province
   - 5-10 banks/insurance/corporate per province
   - Realistic TAM: 500-1000 potential Business tier customers

---

## 3. User Flows (Revised)

### 3.1 Free User Journey (New)

```
Landing Page
    ↓
Sign Up / Login
    ↓
[Free Trial Intake Form]
    ├─ Fill form (jenis kasus, wilayah, kronologi, urgency)
    ├─ AI Classifier runs
    └─ Receive: Triage result + recommendations
            ├─ Learning modules (if low severity)
            ├─ Templates (printable preview)
            └─ Advokat marketplace (if needed)
    ↓
Option A: Upgrade to Basic/Professional/Business
Option B: Exit (can return anytime)
```

### 3.2 Paid User Journey (Intake + Follow-up)

```
User (Basic+ Tier) → Unlimited Intake Forms
    ├─ Submit form
    ├─ AI triage (instant)
    ├─ Review initial assessment
    ├─ Continue chat with AI for follow-ups
    ├─ Access recommended learning modules
    ├─ Download templates
    ├─ Book advokat if needed
    └─ Export full analysis as PDF
```

### 3.3 Government Agency User (Business Tier)

```
PEMDA/Polda Admin → Login to Business Dashboard
    ├─ View: Case volume trends (wilayah)
    ├─ View: Case type distribution
    ├─ View: Severity trends
    ├─ Filter: By date range, case type, kabupaten
    ├─ Download: CSV/PDF report
    └─ Use case: "Perceraian cases naik 30% di Q2, kami perlu increase family counseling budget"
```

### 3.4 Law Firm User (Business Tier)

```
Law Firm Partner → Login to Business Dashboard
    ├─ View: National case statistics
    ├─ View: Market size by wilayah & case type
    ├─ Analyze: Which kabupaten has highest demand for "sengketa bisnis"?
    ├─ Decision: "Bandung + Medan show 20%+ YoY growth, open branch there"
    └─ Export: Market analysis report
```

---

## 4. Implementation Roadmap (Solo Developer)

### Phase 1: Foundation (Weeks 1-4)

**Week 1-2: Intake Form + UI**
- [ ] Design intake form component (Figma mockup)
- [ ] Build form validation (Zod schema)
- [ ] Add form submission endpoint (`POST /api/cases`)
- [ ] Store form data in Supabase `cases` table
- [ ] Test with 10 manual submissions

**Week 2-3: AI Triage Logic**
- [ ] Write AI classifier prompt (detailed instructions for LLM)
- [ ] Integrate with Vercel AI SDK (LLM call)
- [ ] Parse classifier output (JSON schema)
- [ ] Route output: show recommendations UI
- [ ] Test with 20 real-world case scenarios (edge cases)

**Week 3-4: Case Templates**
- [ ] Create 5-6 template files (Markdown + HTML fillable)
- [ ] Build template selector UI
- [ ] Implement PDF export (use existing pipeline)
- [ ] Implement Word export (use `docx` npm package)
- [ ] Add templates to Learning Center section
- [ ] Test download + fill workflow

**Deliverable:** MVP intake form + triage + templates working end-to-end

**Effort Estimate:** 40-50 hours

---

### Phase 2: Data Infrastructure + Analytics (Weeks 5-8)

**Week 5: Data Architecture**
- [ ] Design `case_analytics` table schema
- [ ] Create Supabase table + indexes
- [ ] Write data anonymization logic (function)
- [ ] Set up Row Level Security (RLS) policies:
  - `cases` table: user can see own cases only
  - `case_analytics` table: government/business role can see aggregated only
- [ ] Test RLS with multiple user roles

**Week 6: Analytics API**
- [ ] Build API endpoints:
  - `GET /api/analytics/dashboard` (metrics + filtered data)
  - `GET /api/analytics/trends` (time-series)
  - `GET /api/analytics/export` (CSV/PDF)
- [ ] Add authentication/authorization checks
- [ ] Test with Postman/curl

**Week 7: Dashboard Frontend**
- [ ] Build KPI cards (React components)
- [ ] Implement charts (Recharts):
  - Line chart (case volume over time)
  - Pie chart (case type distribution)
  - Bar chart (severity distribution)
- [ ] Add filter controls (date range, case type, wilayah)
- [ ] Implement export buttons (CSV, PDF)
- [ ] Mobile responsive design

**Week 8: Testing + Admin Setup**
- [ ] Test full analytics flow with mock data
- [ ] Create admin panel to issue "Government" role to agencies
- [ ] Set up scheduled job: monthly anonymization cron
- [ ] Load test dashboard (simulate 1000+ rows)
- [ ] Write user guide for government agencies

**Deliverable:** Working analytics dashboard, government agencies can access (limited rollout)

**Effort Estimate:** 60-70 hours

---

### Phase 3: Advokat Verification + Polish (Weeks 9-10)

**Week 9: Verification System**
- [ ] Add `verification_status` field to advokat profile
- [ ] Build admin UI: verify button + STPI upload
- [ ] Add badge display on advokat marketplace card
- [ ] Re-verification workflow (2-year reminder email)

**Week 10: Bug Fixes + Deployment**
- [ ] Integration testing: intake form → triage → routing
- [ ] Performance optimization (intake form submit speed, dashboard query time)
- [ ] Deploy to production (Vercel)
- [ ] Monitor: error logs, user feedback
- [ ] Prepare announcement for existing users

**Deliverable:** Full v2.5 live in production

**Effort Estimate:** 30 hours

---

### Total Effort Estimate: 130-160 hours (~4-5 weeks full-time, or 2-3 months part-time)

---

## 5. Technology Considerations

### 5.1 Database Schema Updates

```sql
-- Existing table (no change, just RLS updates)
ALTER TABLE cases ADD COLUMN analytics_id UUID REFERENCES case_analytics(id);

-- New table for analytics
CREATE TABLE case_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_type VARCHAR NOT NULL,
  sub_category VARCHAR,
  severity_level INT CHECK (severity_level BETWEEN 1 AND 5),
  urgency_level VARCHAR,
  wilayah_kabupaten VARCHAR,
  wilayah_provinsi VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  closed_at TIMESTAMP,
  outcome VARCHAR,
  has_advokat BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_wilayah_time ON case_analytics(wilayah_kabupaten, created_at);
CREATE INDEX idx_analytics_type_time ON case_analytics(case_type, created_at);

-- RLS Policy for government access
CREATE POLICY "government_agencies_read_aggregated"
  ON case_analytics
  FOR SELECT
  USING (
    auth.jwt_as_json('app_metadata')::jsonb->>'role' = 'government'
    AND is_deleted = false
  );
```

### 5.2 API Changes

**New Endpoints:**

```javascript
// POST /api/cases
// Submit intake form
POST /api/cases
  Body: { case_type, sub_category, kronologi, jumlah, urgency, wilayah, ... }
  Response: { case_id, triage_result, recommended_modules, templates }

// GET /api/analytics/dashboard
// Fetch dashboard metrics
GET /api/analytics/dashboard?wilayah=bandung&start_date=2024-01-01&end_date=2024-06-30
  Response: {
    kpi: { total_cases: 247, trend: "+8%", ... },
    distribution: { pidana: 35%, perdata: 45%, keluarga: 20% },
    timeline: { pidana_ringan: 45, pidana_berat: 120, ... }
  }

// GET /api/analytics/export
// Download report
GET /api/analytics/export?format=pdf&wilayah=jakarta
  Response: PDF file (stream)
```

### 5.3 Frontend Dependencies (Additional)

```json
{
  "dependencies": {
    "docx": "^8.12.0",  // For Word document generation
    "recharts": "^2.10.0",  // Already using, for dashboard charts
    "leaflet": "^1.9.4",  // For interactive map visualization
    "jspdf": "^2.5.1",  // For PDF generation
    "papaparse": "^5.4.1"  // For CSV export
  }
}
```

Note: Most of these are lightweight. Install only if not already present.

---

## 6. Privacy & Compliance

### 6.1 Data Retention & Anonymization

**Policy Summary:**
- **Active Cases:** Full data retained indefinitely (user owns data)
- **Completed Cases:** Full data retained 2 years (legal/dispute resolution window)
- **After 2 Years:** Auto-anonymize (remove identifiers, keep metadata for analytics)
- **User Deletion:** Full deletion within 30 days (complies with GDPR right to be forgotten)

**Anonymization Process:**

```
Before:
├─ user_id: 12345
├─ user_name: "Budi Santoso"
├─ user_phone: "08123456789"
├─ user_address: "Jl. Merdeka No. 10, Bandung"
├─ case_type: "Sengketa Tanah"
└─ case_details: "Tanah warisan orang tua di Bandung, luas 500m2..."

After (Anonymized for Analytics):
├─ user_id: [DELETED]
├─ case_type: "Sengketa Tanah"
├─ wilayah_kabupaten: "Bandung"
├─ created_at: "2024-01-15"
└─ outcome: "ongoing"
   (All identifiable info removed)
```

### 6.2 Role-Based Access Control (RBAC)

```javascript
Roles:
├─ user (default)
├─ advokat
├─ government (PEMDA/Polda/Kejaksaan)
├─ enterprise (Law Firm/Bank/Insurance)
└─ admin (platform owner)

Permissions:
├─ user: create cases, access own cases, view templates
├─ advokat: see assigned cases, marketplace profile
├─ government: view aggregated case_analytics only (for their wilayah)
├─ enterprise: view aggregated case_analytics (national)
└─ admin: full access (all data, all functions)
```

### 6.3 Data Sharing Disclosure (ToS Update)

Users must accept (during intake form):
```
"Informasi kasus Anda akan digunakan untuk:
1. Analisis hukum yang dipersonalisasi
2. Rekomendasi advokat yang sesuai
3. Statistik agregat untuk lembaga pemerintah (TANPA identitas Anda)

Anda memiliki hak:
- Mengakses data Anda kapan saja
- Menghapus data Anda (proses 30 hari)
- Menolak bagian analytics (case Anda tidak masuk dalam dashboard)
"
```

---

## 7. Monetization Summary

### 7.1 Revised Pricing Structure

| Tier | Price/Month | Free Trial | AI Chats | Learning | Templates | Analytics | Advokat |
|------|-------------|-----------|----------|----------|-----------|-----------|---------|
| **Free** | Rp 0 | 1 intake form | - | Free modules | Watermark | ❌ | View-only |
| **Basic** | Rp 99k | - | 10/month | Basic access | PDF download | ❌ | Booking |
| **Professional** | Rp 299k | - | Unlimited | All modules | Fillable Word | ❌ | Booking + message |
| **Business (Individuals)** | Rp 999k | - | Unlimited | All modules | Custom | ❌ | All + featured |
| **Government Account** | Rp 2M base | - | N/A | N/A | N/A | ✅ Wilayah-specific | N/A |
| **Enterprise Account** | Rp 1.5M base | - | N/A | N/A | N/A | ✅ National | N/A |

**Seat Pricing:**
- Government: +Rp 300k/user/month
- Enterprise: +Rp 200k/user/month

### 7.2 Revenue Projections (Illustrative, Needs Validation)

**Scenario: Year 2 (Conservative Estimate)**

```
B2C Subscriptions:
├─ 500 Free users (no revenue)
├─ 200 Basic users: 200 × Rp 99k × 12 = Rp 237.6M/year
├─ 100 Professional users: 100 × Rp 299k × 12 = Rp 358.8M/year
└─ 20 Business users: 20 × Rp 999k × 12 = Rp 239.76M/year
   Subtotal B2C: Rp 836.16M/year

B2B (Government + Enterprise):
├─ 5 Government agencies (avg 3 users each): 
    5 × (Rp 2M + 2 × Rp 300k) × 12 = Rp 216M/year
├─ 3 Enterprise accounts (avg 4 users each):
    3 × (Rp 1.5M + 3 × Rp 200k) × 12 = Rp 86.4M/year
└─ Subtotal B2B: Rp 302.4M/year

Marketplace Commission (Future):
├─ 50 advokat earning Rp 5M/month = Rp 250M/month
├─ Commission 10% = Rp 25M/month = Rp 300M/year
└─ (This is speculative, depends on advokat adoption)

TOTAL YEAR 2: Rp 1.4B - 1.7B/year (~Rp 120-140M/month)
```

**Assumptions:**
- Churn rate: 5% monthly (aggressive retention effort)
- Government/enterprise acquisition: 5 accounts in year 2
- Advokat marketplace: Not yet revenue-generating (focus on B2C first)

---

## 8. Risk & Mitigation

### 8.1 Technical Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| AI classifier produces inaccurate triage | High | Extensive testing (50+ case scenarios); option to override + manual review |
| Analytics dashboard query slow (large dataset) | Medium | Proper indexing; caching layer (Redis) for common queries |
| Data anonymization fails (PII leaks) | Critical | Automated tests; manual audit; role-based access control strictly enforced |
| Storage costs explode (case history) | Medium | Archive old cases to cold storage after 2 years; set user download limits |

### 8.2 Business Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Government agencies unwilling to pay | High | Start with free pilot (6 months); prove ROI with anonymized metrics first |
| Advokat don't join/activate marketplace | High | Aggressive advokat recruitment; partner with bar associations; feature marketing |
| Regulatory scrutiny (data sharing with gov) | High | Transparent ToS; third-party compliance audit; privacy-by-design architecture |
| Competition (incumbent legal platforms) | Medium | Focus on niche: affordability + AI + Indonesian-specific; partner with gov (moat) |

### 8.3 Compliance Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| GDPR/PDP compliance violation | Critical | Implement full compliance checklist; annual audit; DPA with government agencies |
| Unauthorized data access | High | RLS enforcement; API authentication; audit logs |
| User data breach | Critical | Encryption at rest + in transit; zero-trust security model |

---

## 9. Success Metrics

### 9.1 Product Metrics

| Metric | Current | Target (6 months) | Target (12 months) |
|--------|---------|------------------|-------------------|
| Free tier signups | ? | 1,000 | 5,000 |
| Free-to-paid conversion | ? | 5-10% | 10-15% |
| Paid tier retention (monthly churn) | ? | < 10% | < 5% |
| Avg intake forms submitted (user) | - | 1.5 | 3 |
| Government agencies signed up | 0 | 1 pilot | 5+ |
| Advokat profiles verified | ? | 50+ | 200+ |

### 9.2 Business Metrics

| Metric | Current | Target (6 months) | Target (12 months) |
|--------|---------|------------------|-------------------|
| MRR (B2C) | ? | Rp 30-50M | Rp 80-120M |
| MRR (B2B) | Rp 0 | Rp 5-10M | Rp 30-50M |
| Total ARR | ? | Rp 420M-720M | Rp 1.3B-2B |
| CAC (Cost Acquisition, B2C) | ? | < Rp 50k | < Rp 100k |
| LTV (Lifetime Value, B2C) | ? | > Rp 2M | > Rp 5M |

---

## 10. Open Questions & Next Steps

1. **Data Sharing MOU with Government:**
   - Which agency partners first? (Polda Jakarta? PEMDA?)
   - Can we get formal written agreement before launch?

2. **Advokat Onboarding:**
   - How to incentivize advokat sign-up? (Marketing, commission structure, etc.)
   - Parallel track: approach bar associations for endorsement?

3. **Content Creation:**
   - Who writes case templates? (You, freelance lawyer, community?)
   - Who maintains Learning Center modules quality?

4. **Initial Funding:**
   - This roadmap needs 4-5 weeks full-time effort (~Rp 30-50M in opportunity cost)
   - Feasible solo, but will slow feature development

5. **MVP Launch Timeline:**
   - When can intake form + triage + templates be ready?
   - When to approach government agencies for pilot?

---

## Appendix A: Detailed Intake Form Schema (JSON)

```json
{
  "type": "object",
  "properties": {
    "case_type": {
      "type": "string",
      "enum": ["pidana", "perdata", "keluarga", "bisnis"],
      "description": "Kategori utama kasus"
    },
    "sub_category": {
      "type": "string",
      "description": "Sub-kategori (e.g., 'penipuan', 'perceraian', 'sengketa tanah')"
    },
    "kronologi": {
      "type": "string",
      "minLength": 100,
      "description": "Deskripsi detail apa yang terjadi"
    },
    "wilayah": {
      "type": "string",
      "description": "Kabupaten/Kota (untuk filtering Perda + analytics)"
    },
    "jumlah_nilai": {
      "type": "number",
      "description": "Nilai uang terlibat (jika ada), dalam Rupiah"
    },
    "urgency_level": {
      "type": "string",
      "enum": ["immediate", "normal", "planning"],
      "description": "Tingkat urgensi"
    },
    "sudah_advokat": {
      "type": "boolean",
      "description": "Apakah sudah memiliki advokat?"
    },
    "sudah_lapor_polisi": {
      "type": "boolean",
      "description": "Apakah sudah lapor ke kepolisian?"
    },
    "dokumen_pendukung": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "filename": "string",
          "url": "string (Supabase storage URL)"
        }
      },
      "description": "File pendukung (opsional)"
    }
  },
  "required": ["case_type", "sub_category", "kronologi", "wilayah", "urgency_level"]
}
```

---

## Appendix B: Government Dashboard API Response Example

```json
{
  "dashboard_meta": {
    "agency": "Polda Jawa Barat",
    "wilayah": "jawa-barat",
    "period": "2026-04-01 to 2026-06-30",
    "generated_at": "2026-06-18T10:30:00Z"
  },
  "kpi": {
    "total_cases": 1847,
    "new_cases_this_month": 247,
    "trend_vs_last_month": "+8%",
    "active_cases": 1203,
    "closed_cases": 644
  },
  "distribution": {
    "by_type": {
      "pidana": { "count": 647, "percentage": 35, "trend": "+12%" },
      "perdata": { "count": 831, "percentage": 45, "trend": "+3%" },
      "keluarga": { "count": 369, "percentage": 20, "trend": "-2%" }
    },
    "by_pidana_subtype": {
      "penipuan": { "count": 272, "percentage": 42 },
      "kekerasan": { "count": 156, "percentage": 24 },
      "pencurian": { "count": 125, "percentage": 19 },
      "lainnya": { "count": 94, "percentage": 15 }
    }
  },
  "severity": {
    "critical": { "count": 82, "percentage": 4, "trend": "+15%" },
    "high": { "count": 412, "percentage": 22, "trend": "+5%" },
    "medium": { "count": 894, "percentage": 48, "trend": "0%" },
    "low": { "count": 459, "percentage": 26, "trend": "-3%" }
  },
  "timeline": {
    "avg_days_to_close": {
      "pidana_ringan": 45,
      "pidana_berat": 120,
      "perdata": 150,
      "keluarga": 90
    }
  },
  "geography": {
    "kabupaten_distribution": [
      { "kabupaten": "Bandung", "cases": 412, "percentage": 22 },
      { "kabupaten": "Bogor", "cases": 365, "percentage": 20 },
      { "kabupaten": "Cirebon", "cases": 287, "percentage": 16 },
      { "..." : "..." }
    ]
  }
}
```

---

## Appendix C: Advokat Verification Workflow (Admin UI)

```
Admin Dashboard → Advokat Management
    ├─ Filter: Unverified (15 pending)
    │   ├─ "Advokat A" - [View STPI Scan] [Verify] [Reject]
    │   ├─ "Advokat B" - [No STPI Submitted] [Request Upload] [Reject]
    │   └─ ...
    ├─ Verified (87 active)
    │   ├─ "Advokat X" - ✅ Verified on 2026-01-15 [Re-verify Due: 2028-01-15]
    │   └─ ...
    └─ Certified Partners (5)
        ├─ "Law Firm Y" - ✅ Certified Partner [Edit] [Revoke]
        └─ ...
```

---

**Document Version:** 2.5  
**Last Updated:** June 2026  
**Status:** Ready for Implementation  
**Prepared for:** Solo Developer Execution