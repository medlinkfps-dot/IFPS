-- ==============================================================================
-- Iraqi Family Physicians Society (IFPS) - Official Seed Data
-- ==============================================================================

-- 1. INSERT CONTENT TYPES
INSERT INTO public.content_types (id, slug, name_ar, name_en, description, icon, is_in_nav, sort_order, is_active)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'news', 'الأخبار', 'News', 'أحدث أخبار ونشاطات الجمعية والمستجدات الطبية', 'Newspaper', true, 1, true),
    ('22222222-2222-2222-2222-222222222222', 'events', 'الفعاليات والمؤتمرات', 'Events & Conferences', 'المؤتمرات العلمية والندوات وورش العمل المتخصصة', 'Calendar', true, 2, true),
    ('33333333-3333-3333-3333-333333333333', 'courses', 'الدورات والورش', 'Courses & Workshops', 'برامج التدريب المستمر ومنظومة التطوير المهني CPD-s', 'GraduationCap', true, 3, true),
    ('44444444-4444-4444-4444-444444444444', 'opportunities', 'الدراسات العليا والفرص', 'Postgraduate & Fellowships', 'فرص البورد والزمالات والتدريب الأكاديمي والسريري', 'Award', true, 4, true),
    ('55555555-5555-5555-5555-555555555555', 'announcements', 'الإعلانات الإدارية', 'Announcements', 'الأوامر الإدارية والتعميمات الرسمية للأعضاء', 'Bell', false, 5, true)
ON CONFLICT (slug) DO UPDATE 
SET name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en;

-- 2. INSERT CATEGORIES
INSERT INTO public.categories (id, content_type_id, name_ar, name_en, slug, description)
VALUES
    -- News
    ('c1111111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'أنشطة الجمعية', 'Society Activities', 'society-activities', 'أخبار اللقاءات والأنشطة الإدارية والميدانية'),
    ('c1111111-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'التعاون الدولي والـ WONCA', 'International & WONCA', 'wonca-international', 'المشاركات والفعاليات في المنظمة العالمية لأطباء الأسرة'),
    ('c1111111-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'الصحة العامة والضمان الصحي', 'Public Health & Health Insurance', 'health-insurance', 'مستجدات قانون الضمان الصحي ومراكز الرعاية الأولية'),

    -- Events
    ('c2222222-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'مؤتمرات سنوية', 'Annual Conferences', 'annual-conferences', 'المؤتمرات السنوية الكبرى لطب الأسرة في العراق'),
    ('c2222222-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'ندوات علمية', 'Scientific Webinars', 'scientific-webinars', 'الندوات العلمية الافتراضية والحضورية'),

    -- Courses
    ('c3333333-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'التطوير المهني المستدام (CPD-s)', 'CPD Programs', 'cpd-programs', 'الدورات المعتمدة ضمن ساعات التطوير الطبي المستمر'),
    ('c3333333-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'مهارات سريرية ورعاية أولية', 'Clinical Skills', 'clinical-skills', 'ورش تدريبية سريرية وعملية لأطباء الأسرة'),

    -- Opportunities
    ('c4444444-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'البورد العربي والعراقي', 'Arab & Iraqi Boards', 'boards-training', 'إعلانات وامتحانات المجلس العربي والعراقي للاختصاصات الطبية'),
    ('c4444444-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'زمالات وبحوث', 'Fellowships & Research', 'fellowships', 'الزمالات الإكلينيكية والمشاريع البحثية المدعومة')
ON CONFLICT (content_type_id, slug) DO NOTHING;

-- 3. INSERT SITE SETTINGS
INSERT INTO public.site_settings (key, value_ar, value_en, description, category, is_public)
VALUES
    ('site_name', 'جمعية أطباء الأسرة العراقية', 'Iraqi Family Physicians Society', 'الاسم الرسمي للمؤسسة', 'general', true),
    ('site_acronym', 'IFPS', 'IFPS', 'المختصر الرسمي', 'general', true),
    ('site_tagline', 'شريككم الدائم نحو صحة أفضل.. لأن صحتكم تبدأ قبل المرض', 'Your Trusted Partner for Better Health', 'شعار الجمعية', 'general', true),
    ('founding_year', '2012', '2012', 'سنة التأسيس الرسمية', 'general', true),
    ('president_name', 'الطبيب الاستشاري د. منتظر سعد', 'Consultant Dr. Muntadhar Saad', 'اسم رئيس الجمعية', 'general', true),
    ('president_title', 'رئيس جمعية أطباء الأسرة العراقية', 'President of Iraqi Family Physicians Society', 'صفة رئيس الجمعية', 'general', true),
    ('official_email', 'info@iraqifps.org', 'info@iraqifps.org', 'البريد الإلكتروني الرسمي', 'contact', true),
    ('headquarters_city', 'بغداد - جمهورية العراق', 'Baghdad, Iraq', 'المقر الرسمي', 'contact', true),
    ('facebook_handle', 'iraqi.fps', 'iraqi.fps', 'معرف الفيسبوك الرسمي', 'social', true),
    ('instagram_handle', 'iraqi.fps', 'iraqi.fps', 'معرف الانستغرام الرسمي', 'social', true),
    ('id_system_url', 'https://id.iraqifps.org', 'https://id.iraqifps.org', 'رابط نظام الهويات الإلكتروني', 'links', true),
    ('official_logo_url', '/fps.png', '/fps.png', 'رابط الشعار المعتمد', 'media', true),
    ('official_emblem_url', '/fps.png', '/fps.png', 'الشعار الدائري للجمعية', 'media', true),
    ('wonca_affiliation', 'مشاركة فاعلة وممثلية مهنية في المنظمة العالمية لأطباء الأسرة (WONCA)', 'Active participation in WONCA World', 'التمثيل الدولي', 'general', true)
ON CONFLICT (key) DO UPDATE 
SET value_ar = EXCLUDED.value_ar, value_en = EXCLUDED.value_en;

-- 4. INSERT NAVIGATION ITEMS
INSERT INTO public.navigation_items (id, label_ar, label_en, path, is_external, sort_order, is_active)
VALUES
    ('a0000001-0000-0000-0000-000000000001', 'الرئيسية', 'Home', '/', false, 1, true),
    ('a0000001-0000-0000-0000-000000000002', 'عن الجمعية', 'About Us', '/about', false, 2, true),
    ('a0000001-0000-0000-0000-000000000003', 'الأخبار', 'News', '/news', false, 3, true),
    ('a0000001-0000-0000-0000-000000000004', 'الفعاليات والمؤتمرات', 'Events', '/events', false, 4, true),
    ('a0000001-0000-0000-0000-000000000005', 'الدورات والورش', 'Courses', '/courses', false, 5, true),
    ('a0000001-0000-0000-0000-000000000006', 'الدراسات العليا', 'Postgraduate', '/opportunities', false, 6, true),
    ('a0000001-0000-0000-0000-000000000007', 'العضوية والهويات', 'Membership & IDs', '/membership', false, 7, true),
    ('a0000001-0000-0000-0000-000000000008', 'اتصل بنا', 'Contact', '/contact', false, 8, true)
ON CONFLICT (id) DO NOTHING;

-- 5. INSERT SEED POSTS
-- Post 1: WONCA World
INSERT INTO public.posts (
    id, content_type_id, title_ar, title_en, slug, summary_ar, summary_en, 
    content_ar, content_en, featured_image, status, is_pinned, is_featured, 
    published_at, metadata, seo_title, seo_description
) VALUES (
    'p1000001-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'مشاركة جمعية أطباء الأسرة العراقية في فعاليات WONCA World وتطبيقات الذكاء الاصطناعي في طب الأسرة',
    'IFPS Participation in WONCA World & AI in Family Practice',
    'wonca-world-family-medicine-ai',
    'مراجعة شاملة لتطبيقات الذكاء الاصطناعي في تعزيز العلاقة بين الطبيب والمريض ودور التكنولوجيا الرقمية في الرعاية الصحية الأولية عالمياً.',
    'Reviewing artificial intelligence applications in deepening doctor-patient relationships within primary healthcare worldwide.',
    '<p>شهدت فعاليات منظمة أطباء الأسرة العالمية (WONCA World) جلسات علمية موسعة حول توظيف الذكاء الاصطناعي لتعزيز الرعاية الصحية الأولية وتخفيف الأعباء الإدارية عن الطبيب، مما يتيح له التفرغ الكامل لبناء علاقة علاجية عميقة مع المريض.</p><p>أكدت المحاضرات على دور التكنولوجيا الرقمية وأدوات الفحص المبكر والتشخيص الدقيق في رفع كفاءة المتابعة السريرية، مع مناقشة التحديات من منظور العوامل البشرية وأخلاقيات الطب الحديث.</p><p>وتواصل جمعية أطباء الأسرة العراقية حرصها على نقل أحدث الخبرات والابتكارات الدولية إلى أطباء الأسرة في العراق عبر شراكاتها وأنشطتها المستمرة.</p>',
    '<p>WONCA World sessions discussed the transformative impact of artificial intelligence in family practice, enhancing diagnostic capabilities while maintaining personal therapeutic rapport.</p>',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    'published',
    true,
    true,
    NOW() - INTERVAL '2 days',
    '{"read_time": "4 دقائق", "source": "WONCA International"}'::jsonb,
    'مشاركة الجمعية في WONCA World | جمعية أطباء الأسرة العراقية',
    'مشاركة جمعية أطباء الأسرة العراقية في فعاليات WONCA World وتطبيقات الذكاء الاصطناعي في طب الأسرة.'
) ON CONFLICT (slug) DO NOTHING;

-- Post 2: Administrative Order Batch 5
INSERT INTO public.posts (
    id, content_type_id, title_ar, title_en, slug, summary_ar, summary_en, 
    content_ar, content_en, featured_image, status, is_pinned, is_featured, 
    published_at, metadata, seo_title, seo_description
) VALUES (
    'p1000002-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-111111111111',
    'صدور الأمر الإداري الخاص بالوجبة الخامسة لأطباء الأسرة',
    'Issuance of Administrative Order - Batch 5 for Family Physicians',
    'administrative-order-batch-5',
    'تعلن جمعية أطباء الأسرة العراقية عن صدور الأمر الإداري الخاص بالوجبة الخامسة للزملاء أطباء وطبيبات الأسرة.',
    'Announcement of Administrative Order for Batch 5 of Family Physicians in Iraq.',
    '<p>تعلن جمعية أطباء الأسرة العراقية لكافة الزملاء الكرام عن صدور الأمر الإداري الخاص بالوجبة الخامسة، ويمكن للأعضاء المعنيين مراجعة القوائم والوثائق المرفقة الرسمية.</p><p>تؤكد الجمعية حرصها الدائم على متابعة كافة الاستحقاقات الإدارية والمهنية لأعضائها بالتنسيق مع الجهات المعنية والوزارية.</p>',
    '<p>The administrative order for the 5th batch of family medicine specialists has been officially published.</p>',
    'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    'published',
    false,
    true,
    NOW() - INTERVAL '5 days',
    '{"file_url": "https://iraqifps.org/wp-content/uploads/2026/05/%D8%A7%D9%85%D8%B1-%D8%A7%D8%AF%D8%A7%D8%B1%D9%8A-%D9%88%D8%AC%D8%A8%D8%A9-%D8%AE%D8%A7%D9%85%D8%B3%D8%A9.pdf", "file_name": "امر اداري وجبة خامسة.pdf"}'::jsonb,
    'الأمر الإداري الوجبة الخامسة | جمعية أطباء الأسرة العراقية',
    'صدور الأمر الإداري الخاص بالوجبة الخامسة لأطباء الأسرة وتفاصيل التحميل.'
) ON CONFLICT (slug) DO NOTHING;

-- Post 3: Course - CPD-s Program
INSERT INTO public.posts (
    id, content_type_id, title_ar, title_en, slug, summary_ar, summary_en, 
    content_ar, content_en, featured_image, status, is_pinned, is_featured, 
    published_at, metadata, seo_title, seo_description
) VALUES (
    'p3000001-0000-0000-0000-000000000001',
    '33333333-3333-3333-3333-333333333333',
    'البرنامج المتقدم لمنظومة التدريب والتطوير المهني المستدام (CPD-s)',
    'Advanced Continuing Professional Development System (CPD-s)',
    'cpd-s-advanced-training-program',
    'برنامج تدريبي معتمد لصياغة مسارات التدريب السريري والإداري والبحثي لأطباء الأسرة وفق المعايير العالمية.',
    'Accredited professional training program outlining clinical, administrative, and research tracks for family physicians.',
    '<p>نظراً للتطور الجذري في الابتكارات العلاجية، تحول التعليم الطبي المستمر إلى ضرورة استراتيجية لضمان كفاءة النظام الصحي، وتحديداً في اختصاص طب الأسرة بوصفه حجر الزاوية للرعاية الأولية.</p><p>صاغت جمعية أطباء الأسرة العراقية دليل منظومة التطوير المهني المستدام (CPD-s) ليكون إطاراً معيارياً شاملاً يهدف إلى مأسسة التدريب عبر مسارات محددة وآليات تقييم دقيقة ترتقي بالأداء الطبي والإداري والبحثي، لضمان استمرارية تجديد الكفاءة وتحسين جودة الخدمة المقدمة للمجتمع.</p>',
    '<p>Comprehensive continuing professional development program established by IFPS to institutionalize medical training standards.</p>',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    'published',
    true,
    true,
    NOW() - INTERVAL '1 day',
    '{"duration": "4 أسابيع", "mode": "حضوري وعبر المنصة الرقمية", "instructor": "اللجنة العلمية العليا للجمعية", "seats": 50, "cpd_hours": 24, "registration_status": "open", "registration_url": "https://forms.gle/ifps-cpd-registration"}'::jsonb,
    'برنامج منظومة التطوير المهني CPD-s | جمعية أطباء الأسرة العراقية',
    'تفاصيل والتسجيل في البرنامج المتقدم لمنظومة التطوير المهني المستدام لأطباء الأسرة.'
) ON CONFLICT (slug) DO NOTHING;

-- Post 4: Event - Annual National Conference
INSERT INTO public.posts (
    id, content_type_id, title_ar, title_en, slug, summary_ar, summary_en, 
    content_ar, content_en, featured_image, status, is_pinned, is_featured, 
    published_at, metadata, seo_title, seo_description
) VALUES (
    'p2000001-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222',
    'المؤتمر الوطني السنوي لطب الأسرة: طب الأسرة حجر الزاوية للضمان الصحي',
    'Annual National Family Medicine Conference: Corner-Stone of Health Insurance',
    'annual-national-family-medicine-conference',
    'المؤتمر العلمي السنوي لجمعية أطباء الأسرة العراقية بمشاركة نخبة من الخبراء وممثلي وزارة الصحة ومنظمة الصحة العالمية.',
    'Annual National Conference of the Iraqi Family Physicians Society discussing health insurance implementation and primary care reform.',
    '<p>تنظم جمعية أطباء الأسرة العراقية مؤتمرها العلمي الوطني السنوي بحضور استشاريي وأطباء طب الأسرة من مختلف محافظات العراق، وبمشاركة ممثلين عن وزارة الصحة والمجلس العلمي لطب الأسرة ومنظمة الصحة العالمية.</p><p>يتناول المؤتمر المحاور التالية:<br>1. دور طبيب الأسرة في تطبيق قانون الضمان الصحي الوطني.<br>2. الكشف المبكر والوقاية من الأمراض المزمنة والأورام.<br>3. تحديات التدريب السريري والتوسع في مراكز الرعاية الأولية.<br>4. البحث العلمي في الرعاية الصحية الأولية في العراق.</p>',
    '<p>The prime annual medical gathering in Iraq focusing on family practice and national healthcare reforms.</p>',
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80',
    'published',
    true,
    true,
    NOW() - INTERVAL '3 days',
    '{"event_date": "2026-11-20", "event_time": "09:00 ص - 04:00 م", "venue": "بغداد - فندق الرشيد - قاعة المؤتمرات الكبرى", "organizer": "جمعية أطباء الأسرة العراقية", "status": "upcoming", "registration_url": "https://iraqifps.org/conference-registration"}'::jsonb,
    'المؤتمر الوطني السنوي لطب الأسرة | جمعية أطباء الأسرة العراقية',
    'المؤتمر السنوي لجمعية أطباء الأسرة العراقية - محاور المؤتمر، الموعد، والتسجيل.'
) ON CONFLICT (slug) DO NOTHING;

-- Post 5: Postgraduate Studies - Arab Board Announcement
INSERT INTO public.posts (
    id, content_type_id, title_ar, title_en, slug, summary_ar, summary_en, 
    content_ar, content_en, featured_image, status, is_pinned, is_featured, 
    published_at, metadata, seo_title, seo_description
) VALUES (
    'p4000001-0000-0000-0000-000000000001',
    '44444444-4444-4444-4444-444444444444',
    'إعلان امتحانات البورد العربي والمجلس العلمي لاختصاص طب الأسرة',
    'Arab Board Family Medicine Examinations & Scientific Council Notice',
    'arab-board-family-medicine-exams',
    'جدول ومواعيد الامتحانات السريرية والأوسكي والنظري لطلبة البورد العربي لاختصاص طب الأسرة للدورة القادمة.',
    'Schedule and requirements for the Arab Board Family Medicine clinical, OSCE, and written examinations.',
    '<p>يعلن المجلس العربي للاختصاصات الصحية بالتعاون مع جمعية أطباء الأسرة العراقية عن فتح باب التسجيل وتحديد مواعيد الامتحانات التمهيدية والنهائية (السريرية، الأوسكي، والنظري) للأطباء المقيمين الأقدم في اختصاص طب الأسرة.</p><p>يرجى من جميع المتقدمين استكمال متطلبات التسجيل وتقديم دفاتر الحالات الإكلينيكية (Logbook) في المواعيد المقررة عبر اللجان التنسيقية للمراكز التدريبية في بغداد والمحافظات.</p>',
    '<p>Official examination announcement and clinical guidelines for Arab Board candidates in Family Medicine.</p>',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
    'published',
    true,
    true,
    NOW() - INTERVAL '4 days',
    '{"deadline": "2026-11-15", "authority": "المجلس العربي للاختصاصات الصحية & IFPS", "exam_type": "سريري، أوسكي، نظري", "requirements_pdf": "https://iraqifps.org/board-exam-guidelines.pdf"}'::jsonb,
    'امتحانات البورد العربي لطب الأسرة | جمعية أطباء الأسرة العراقية',
    'جدول وتعليمات امتحانات البورد العربي لاختصاص طب الأسرة في العراق.'
) ON CONFLICT (slug) DO NOTHING;
