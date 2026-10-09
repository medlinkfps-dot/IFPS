# Iraqi Family Physicians Society (IFPS) Official Web Platform & CMS
### الموقع الرسمي لجمعية أطباء الأسرة العراقية ونظام إدارة المحتوى المؤسسي

[![Built with React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-teal.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%7C%20Auth%20%7C%20Storage-emerald.svg)](https://supabase.com/)
[![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com/)

---

## 🏛️ Project Overview / نبذة عن المشروع

This is the official, production-ready web platform and Content Management System (CMS) for the **Iraqi Family Physicians Society (IFPS – جمعية أطباء الأسرة العراقية)**. Founded in 2012, IFPS serves as the official scientific and professional umbrella for family medicine specialists in Iraq and represents Iraq internationally in the **World Organization of Family Doctors (WONCA World)**.

The platform is designed following modern institutional aesthetics (clean minimalism, deep institutional navy, calm medical teal, subtle Iraqi gold accents) with native, bidirectional Right-to-Left (RTL) Arabic typography, complete responsive support across mobile and desktop, a protected admin CMS at `/admin`, and real Supabase PostgreSQL integration with Row Level Security (RLS).

---

## 🚀 Key Features / المميزات الرئيسية

### 1. Public Institutional Portal (البوابة العامة)
- **Home (`/`)**: Hero section highlighting primary healthcare reform and national health insurance in Iraq, verified society metrics, address from Consultant Dr. Muntadhar Saad (President of IFPS), latest news grid, upcoming CPD-s courses, conferences timeline, postgraduate notices, and direct CTA for official membership and professional identity cards.
- **News (`/news` & `/news/:slug`)**: Categorized news cards, keyword search, pinned announcements, social sharing (Facebook, X, WhatsApp, direct link copy), reading time, and official PDF administrative order downloads (e.g. الأمر الإداري الوجبة الخامسة).
- **Conferences & Events (`/events` & `/events/:slug`)**: Annual national conferences, scientific webinars, schedule, venue in Baghdad and provinces, and external registration integration.
- **Courses & Workshops (`/courses` & `/courses/:slug`)**: Continuing Professional Development System (CPD-s / منظومة التطوير المهني المستدام), accredited hours, trainers, seat capacity, fees, eligibility criteria, and certificate details.
- **Postgraduate & Fellowships (`/opportunities` & `/opportunities/:slug`)**: Arab Board in Family Medicine, Iraqi Board of Medical Specializations, clinical training, exam guides, deadlines countdown, and downloadable instructions.
- **Membership & Professional IDs (`/membership`)**: Conditions of membership, required documentation, steps for new application and renewal, and direct integration with the official identity system portal (`https://id.iraqifps.org`).
- **About Society (`/about`)**: Verified institutional history since 2012, Vision, Mission, Strategic Objectives, Leadership & Scientific Committees, and WONCA World affiliation.
- **Contact Us (`/contact`)**: Verified society email (`info@iraqifps.org`), social handles (`iraqi.fps`), Baghdad headquarters, and a spam-protected contact form writing directly to the database.
- **Dynamic Sections (`/section/:slug`)**: Generic template page automatically displaying any custom content type created by the administrator from the CMS without writing code!

### 2. Protected Admin CMS (`/admin`)
- **Dashboard (`/admin/dashboard`)**: Live counts of published posts, drafts, news, events, courses, postgraduate opportunities, unread messages, and recent activity.
- **Post Manager & Editor (`/admin/posts` & `/admin/posts/new`)**: Full-featured CMS supporting draft/publish/schedule/archive statuses, pinned to top, slug customization, rich visual RTL Arabic editor, section-specific metadata fields, SEO tags, and **Live Preview** toggle between mobile and desktop frames!
- **Dynamic Sections Manager (`/admin/sections`)**: Create, reorder, and configure custom content sections with Arabic/English names and navigation visibility toggles.
- **Taxonomy / Categories (`/admin/categories`)**: Manage categories per section.
- **Media Library (`/admin/media`)**: Upload images and documents to Supabase Storage, preview, copy URLs, and securely delete files with safety confirmation.
- **Navigation Menu Manager (`/admin/navigation`)**: Drag/reorder public header links and customize labels.
- **Inquiries Inbox (`/admin/messages`)**: Read contact submissions, mark read/unread, and reply via email.
- **Audit Logs (`/admin/audit-logs`)**: Automated logging of all administrative operations (create, update, delete, settings changes) with timestamps and admin email.
- **Site Settings (`/admin/settings`)**: Update society name, tagline, email, address, social media links, logo URLs, and identity system URL.

---

## 🛠️ Tech Stack / التقنيات المستخدمة

- **Frontend**: React 18, Vite 6, TypeScript
- **Styling**: Tailwind CSS with custom institutional design tokens
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Sanitization**: DOMPurify (XSS prevention)
- **Backend & Auth**: Supabase (PostgreSQL, Supabase Auth, Storage)
- **Security**: Row Level Security (RLS) on all tables, server-side role validation
- **Hosting**: Vercel with SPA rewrite rules and security headers (`vercel.json`)

---

## 💻 Local Development / التشغيل المحلي

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup Steps
```bash
# 1. Clone or navigate to the repository
cd IFPS

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note on Offline/Demo Mode**: The application includes a resilient fallback data layer. Even before connecting to live Supabase, the public site and admin dashboard (`/admin/login` using `admin@iraqifps.org`) are fully functional and interactive for testing and demonstration!

---

## 🗄️ Supabase Setup & Migrations / إعداد قاعدة البيانات

To connect to your own Supabase project:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase Dashboard.
3. Open and run the migration script located at:
   ```
   supabase/migrations/20261009_001_initial_schema.sql
   ```
4. Run the seed data script located at:
   ```
   supabase/seed.sql
   ```
5. Go to **Storage** and ensure the `media` bucket is created and marked **Public** (the SQL migration creates this automatically).

### Creating the First Administrator Safely
To create the initial admin account without a public registration vulnerability:
1. In Supabase Dashboard, go to **Authentication -> Users -> Add User** (Invite or Create user).
2. Enter the admin email (e.g. `admin@iraqifps.org`) and a strong password.
3. In SQL Editor, assign the `admin` role to that user:
   ```sql
   INSERT INTO public.profiles (id, email, full_name, role)
   VALUES (
     'YOUR-USER-UUID-FROM-AUTH-USERS',
     'admin@iraqifps.org',
     'المسؤول الإداري العام',
     'admin'
   )
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```

---

## 🚢 Deployment to Vercel / النشر على Vercel

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "feat: Iraqi Family Physicians Society official platform and CMS"
git remote add origin https://github.com/YOUR_USERNAME/ifps-website.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to [vercel.com](https://vercel.com) and click **Add New -> Project**.
2. Select your GitHub repository `ifps-website`.
3. Framework Preset: **Vite**.
4. Root Directory: `./`.
5. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL (`https://xyzcompany.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key
   - `VITE_ID_SYSTEM_URL`: `https://id.iraqifps.org` (optional, default provided)
6. Click **Deploy**.

### Step 3: Custom Domain Setup
In your Vercel project settings:
1. Go to **Settings -> Domains**.
2. Add `iraqifps.org` and `www.iraqifps.org`.
3. Configure the DNS CNAME and A records with your domain registrar as instructed by Vercel.

---

## 🔐 Security & Architecture Rules / معايير الأمان

- **Zero Secret Leaks**: No secret keys (`service_role`) are included in frontend code. Only the public anonymous key (`VITE_SUPABASE_ANON_KEY`) is used with RLS enforcing read/write permissions.
- **Row Level Security (RLS)**: Enforced on all tables (`profiles`, `posts`, `categories`, `media`, `site_settings`, `contact_messages`, `audit_logs`).
- **Content Sanitization**: Rich HTML content entered in the CMS is sanitized using DOMPurify before rendering to prevent Cross-Site Scripting (XSS).
- **Spam Protection**: The public contact form includes honeypot validation and strict input type checking.
- **Robots & Privacy**: Admin routes (`/admin/*`) are blocked in `robots.txt` from search engine indexing.

---

## 📞 Official Contacts / معلومات التواصل الرسمية

- **Organization**: Iraqi Family Physicians Society (جمعية أطباء الأسرة العراقية)
- **President**: Consultant Dr. Muntadhar Saad (الطبيب الاستشاري د. منتظر سعد)
- **Official Email**: [info@iraqifps.org](mailto:info@iraqifps.org)
- **Social Media**: Facebook / Instagram `@iraqi.fps`
- **Headquarters**: Baghdad, Republic of Iraq
- **International Affiliation**: World Organization of Family Doctors (WONCA)

---

Copyright © 2026 Iraqi Family Physicians Society (IFPS). All rights reserved.
