import { ContentType, Category, Post, SiteSetting, NavigationItem, ContactMessage, AuditLog } from '../types';

export const INITIAL_CONTENT_TYPES: ContentType[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    slug: 'news',
    name_ar: 'الأخبار',
    name_en: 'News',
    description: 'أحدث أخبار ونشاطات الجمعية والمستجدات الطبية المهنية',
    icon: 'Newspaper',
    is_in_nav: true,
    sort_order: 1,
    is_active: true,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    slug: 'events',
    name_ar: 'الفعاليات والمؤتمرات',
    name_en: 'Events & Conferences',
    description: 'المؤتمرات العلمية والندوات وورش العمل المتخصصة',
    icon: 'Calendar',
    is_in_nav: true,
    sort_order: 2,
    is_active: true,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    slug: 'courses',
    name_ar: 'الدورات والورش',
    name_en: 'Courses & Workshops',
    description: 'برامج التدريب المستمر ومنظومة التطوير المهني CPD-s',
    icon: 'GraduationCap',
    is_in_nav: true,
    sort_order: 3,
    is_active: true,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    slug: 'opportunities',
    name_ar: 'الدراسات العليا والفرص',
    name_en: 'Postgraduate & Fellowships',
    description: 'فرص البورد والزمالات والتدريب الأكاديمي والسريري',
    icon: 'Award',
    is_in_nav: true,
    sort_order: 4,
    is_active: true,
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    slug: 'announcements',
    name_ar: 'الإعلانات الرسمية',
    name_en: 'Announcements',
    description: 'الأوامر الإدارية والتعميمات الرسمية للأعضاء',
    icon: 'Bell',
    is_in_nav: false,
    sort_order: 5,
    is_active: true,
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-news-1',
    content_type_id: '11111111-1111-1111-1111-111111111111',
    name_ar: 'أنشطة الجمعية',
    name_en: 'Society Activities',
    slug: 'society-activities',
    description: 'أخبار اللقاءات والأنشطة الإدارية والميدانية',
  },
  {
    id: 'cat-news-2',
    content_type_id: '11111111-1111-1111-1111-111111111111',
    name_ar: 'التعاون الدولي والـ WONCA',
    name_en: 'International & WONCA',
    slug: 'wonca-international',
    description: 'المشاركات والفعاليات في المنظمة العالمية لأطباء الأسرة',
  },
  {
    id: 'cat-news-3',
    content_type_id: '11111111-1111-1111-1111-111111111111',
    name_ar: 'الصحة العامة والضمان الصحي',
    name_en: 'Public Health & Health Insurance',
    slug: 'health-insurance',
    description: 'مستجدات قانون الضمان الصحي ومراكز الرعاية الأولية',
  },
  {
    id: 'cat-events-1',
    content_type_id: '22222222-2222-2222-2222-222222222222',
    name_ar: 'مؤتمرات سنوية',
    name_en: 'Annual Conferences',
    slug: 'annual-conferences',
    description: 'المؤتمرات السنوية الكبرى لطب الأسرة في العراق',
  },
  {
    id: 'cat-events-2',
    content_type_id: '22222222-2222-2222-2222-222222222222',
    name_ar: 'ندوات علمية',
    name_en: 'Scientific Webinars',
    slug: 'scientific-webinars',
    description: 'الندوات العلمية الافتراضية والحضورية',
  },
  {
    id: 'cat-courses-1',
    content_type_id: '33333333-3333-3333-3333-333333333333',
    name_ar: 'التطوير المهني المستدام (CPD-s)',
    name_en: 'CPD Programs',
    slug: 'cpd-programs',
    description: 'الدورات المعتمدة ضمن ساعات التطوير الطبي المستمر',
  },
  {
    id: 'cat-courses-2',
    content_type_id: '33333333-3333-3333-3333-333333333333',
    name_ar: 'مهارات سريرية',
    name_en: 'Clinical Skills',
    slug: 'clinical-skills',
    description: 'ورش تدريبية سريرية وعملية لأطباء الأسرة',
  },
  {
    id: 'cat-opps-1',
    content_type_id: '44444444-4444-4444-4444-444444444444',
    name_ar: 'البورد العربي والعراقي',
    name_en: 'Arab & Iraqi Boards',
    slug: 'boards-training',
    description: 'إعلانات وامتحانات المجلس العربي والعراقي للاختصاصات الطبية',
  },
];

export const INITIAL_SETTINGS: Record<string, SiteSetting> = {
  site_name: {
    key: 'site_name',
    value_ar: 'جمعية أطباء الأسرة العراقية',
    value_en: 'Iraqi Family Physicians Society',
    description: 'الاسم الرسمي للمؤسسة',
    category: 'general',
    is_public: true,
  },
  site_acronym: {
    key: 'site_acronym',
    value_ar: 'IFPS',
    value_en: 'IFPS',
    description: 'المختصر الرسمي',
    category: 'general',
    is_public: true,
  },
  site_tagline: {
    key: 'site_tagline',
    value_ar: 'شريككم الدائم نحو صحة أفضل.. لأن صحتكم تبدأ قبل المرض',
    value_en: 'Your Trusted Partner for Better Health.. Healthcare Begins Before Illness',
    description: 'شعار الجمعية',
    category: 'general',
    is_public: true,
  },
  founding_year: {
    key: 'founding_year',
    value_ar: '2012',
    value_en: '2012',
    description: 'سنة التأسيس الرسمية',
    category: 'general',
    is_public: true,
  },
  president_name: {
    key: 'president_name',
    value_ar: 'الطبيب الاستشاري د. منتظر سعد',
    value_en: 'Consultant Dr. Muntadhar Saad',
    description: 'اسم رئيس الجمعية',
    category: 'general',
    is_public: true,
  },
  president_title: {
    key: 'president_title',
    value_ar: 'رئيس جمعية أطباء الأسرة العراقية',
    value_en: 'President of Iraqi Family Physicians Society',
    description: 'صفة رئيس الجمعية',
    category: 'general',
    is_public: true,
  },
  official_email: {
    key: 'official_email',
    value_ar: 'info@iraqifps.org',
    value_en: 'info@iraqifps.org',
    description: 'البريد الإلكتروني الرسمي للجمعية',
    category: 'contact',
    is_public: true,
  },
  headquarters_city: {
    key: 'headquarters_city',
    value_ar: 'بغداد - جمهورية العراق',
    value_en: 'Baghdad, Iraq',
    description: 'المقر الرسمي',
    category: 'contact',
    is_public: true,
  },
  facebook_handle: {
    key: 'facebook_handle',
    value_ar: 'iraqi.fps',
    value_en: 'iraqi.fps',
    description: 'رابط صفحة فيسبوك',
    category: 'social',
    is_public: true,
  },
  instagram_handle: {
    key: 'instagram_handle',
    value_ar: 'iraqi.fps',
    value_en: 'iraqi.fps',
    description: 'رابط حساب إنستغرام',
    category: 'social',
    is_public: true,
  },
  id_system_url: {
    key: 'id_system_url',
    value_ar: 'https://id.iraqifps.org',
    value_en: 'https://id.iraqifps.org',
    description: 'رابط منصة إصدار وتجديد الهويات والتحقق',
    category: 'links',
    is_public: true,
  },
  official_logo_url: {
    key: 'official_logo_url',
    value_ar: '/fps.png',
    value_en: '/fps.png',
    description: 'شعار الجمعية الرسمي المعتمد',
    category: 'media',
    is_public: true,
  },
  official_emblem_url: {
    key: 'official_emblem_url',
    value_ar: '/fps.png',
    value_en: '/fps.png',
    description: 'شعار وختم الجمعية الرسمي',
    category: 'media',
    is_public: true,
  },
};

export const INITIAL_NAVIGATION: NavigationItem[] = [
  { id: 'nav-1', label_ar: 'الرئيسية', label_en: 'Home', path: '/', is_external: false, sort_order: 1, is_active: true },
  { id: 'nav-2', label_ar: 'عن الجمعية', label_en: 'About Us', path: '/about', is_external: false, sort_order: 2, is_active: true },
  { id: 'nav-3', label_ar: 'الأخبار', label_en: 'News', path: '/news', is_external: false, sort_order: 3, is_active: true },
  { id: 'nav-4', label_ar: 'الفعاليات والمؤتمرات', label_en: 'Events', path: '/events', is_external: false, sort_order: 4, is_active: true },
  { id: 'nav-5', label_ar: 'الدورات والورش', label_en: 'Courses', path: '/courses', is_external: false, sort_order: 5, is_active: true },
  { id: 'nav-6', label_ar: 'الدراسات العليا', label_en: 'Postgraduate', path: '/opportunities', is_external: false, sort_order: 6, is_active: true },
  { id: 'nav-7', label_ar: 'الوثائق والاستمارات', label_en: 'Documents & Forms', path: '/documents', is_external: false, sort_order: 7, is_active: true },
  { id: 'nav-8', label_ar: 'اتصل بنا', label_en: 'Contact', path: '/contact', is_external: false, sort_order: 8, is_active: true },
];

export const INITIAL_DOCUMENTS = [
  {
    id: 'doc-1',
    title: 'الأمر الإداري الوجبة الخامسة لاختصاصيي طب الأسرة',
    description: 'الأمر الإداري الرسمي الصادر عن وزارة الصحة والجمعية الخاص بالوجبة الخامسة وتوزيع ملاكات أطباء الأسرة.',
    category: 'أوامر وقرارات إدارية',
    file_url: 'https://iraqifps.org/wp-content/uploads/2026/05/%D8%A7%D9%85%D8%B1-%D8%A7%D8%AF%D8%A7%D8%B1%D9%8A-%D9%88%D8%AC%D8%A8%D8%A9-%D8%AE%D8%A7%D9%85%D8%B3%D8%A9.pdf',
    file_name: 'امر-اداري-وجبة-خامسة.pdf',
    file_size: '245 KB',
    published_date: '2026-05-10',
    downloads_count: 840,
    is_active: true,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'doc-2',
    title: 'استمارة الانتساب وتحديث بيانات طبيب الأسرة',
    description: 'النموذج الرسمي الورقي لتحديث معلومات أطباء الأسرة والانتساب للجمعية وتوثيق جهة الممارسة والعمل.',
    category: 'استمارات رسمية',
    file_url: 'https://iraqifps.org/wp-content/uploads/2026/05/%D8%A7%D9%85%D8%B1-%D8%A7%D8%AF%D8%A7%D8%B1%D9%8A-%D9%88%D8%AC%D8%A8%D8%A9-%D8%AE%D8%A7%D9%85%D8%B3%D8%A9.pdf',
    file_name: 'استمارة-تحديث-بيانات-طبيب-اسرة.pdf',
    file_size: '180 KB',
    published_date: '2026-06-01',
    downloads_count: 1250,
    is_active: true,
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'doc-3',
    title: 'دليل منظومة التعليم والتطوير المهني المستدام (CPD-s)',
    description: 'الإطار المعياري لاحتساب ساعات التعليم الطبي المستمر والورش المعتمدة ونقاط الترقية المهنية.',
    category: 'أدلة إرشادية ومعايير',
    file_url: 'https://iraqifps.org/wp-content/uploads/2026/05/%D8%A7%D9%85%D8%B1-%D8%A7%D8%AF%D8%A7%D8%B1%D9%8A-%D9%88%D8%AC%D8%A8%D8%A9-%D8%AE%D8%A7%D9%85%D8%B3%D8%A9.pdf',
    file_name: 'دليل-منظومة-CPD-s.pdf',
    file_size: '1.4 MB',
    published_date: '2026-03-15',
    downloads_count: 960,
    is_active: true,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'doc-4',
    title: 'الدليل الإرشادي لبروتوكولات الرعاية الصحية الأولية في العراق',
    description: 'المبادئ السريرية والبروتوكولات الوقائية المعتمدة للتعامل مع الحالات المزمنة والفحص المبكر.',
    category: 'أدلة إرشادية ومعايير',
    file_url: 'https://iraqifps.org/wp-content/uploads/2026/05/%D8%A7%D9%85%D8%B1-%D8%A7%D8%AF%D8%A7%D8%B1%D9%8A-%D9%88%D8%AC%D8%A8%D8%A9-%D8%AE%D8%A7%D9%85%D8%B3%D8%A9.pdf',
    file_name: 'بروتوكولات-الرعاية-الاولية.pdf',
    file_size: '3.1 MB',
    published_date: '2026-01-20',
    downloads_count: 2100,
    is_active: true,
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: 'doc-5',
    title: 'لائحة أخلاقيات الممارسة الطبية وحقوق أطباء الأسرة',
    description: 'المعايير السلوكية والأخلاقية للممارسة السريرية وحماية العلاقة المهنية في مراكز طب الأسرة.',
    category: 'لوائح وتعليمات',
    file_url: 'https://iraqifps.org/wp-content/uploads/2026/05/%D8%A7%D9%85%D8%B1-%D8%A7%D8%AF%D8%A7%D8%B1%D9%8A-%D9%88%D8%AC%D8%A8%D8%A9-%D8%AE%D8%A7%D9%85%D8%B3%D8%A9.pdf',
    file_name: 'لائحة-اخلاقيات-الممارسة.pdf',
    file_size: '420 KB',
    published_date: '2026-02-14',
    downloads_count: 670,
    is_active: true,
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    content_type_id: '11111111-1111-1111-1111-111111111111',
    content_type_slug: 'news',
    content_type_name_ar: 'الأخبار',
    title_ar: 'مشاركة جمعية أطباء الأسرة العراقية في فعاليات WONCA World وتطبيقات الذكاء الاصطناعي في طب الأسرة',
    title_en: 'IFPS Participation in WONCA World & AI Applications in Family Practice',
    slug: 'wonca-world-family-medicine-ai',
    summary_ar: 'مراجعة شاملة لأحدث أدوات الذكاء الاصطناعي في تعزيز العلاقة بين الطبيب والمريض ودور التكنولوجيا الرقمية في مراكز الرعاية الصحية الأولية عالمياً.',
    summary_en: 'Exploring international breakthroughs in artificial intelligence tools to empower the doctor-patient therapeutic relationship in primary care.',
    content_ar: `
      <p>شهدت فعاليات منظمة أطباء الأسرة العالمية (WONCA World) جلسات علمية موسعة حول توظيف الذكاء الاصطناعي لتعزيز الرعاية الصحية الأولية وتخفيف الأعباء الإدارية عن الطبيب، مما يتيح له التفرغ الكامل لبناء علاقة علاجية عميقة ومستدامة مع المريض.</p>
      
      <h2>دور الذكاء الاصطناعي في خط الدفاع الأول</h2>
      <p>أكدت الجلسة العلمية التي شاركت فيها الدكتورة شيماء هاندان أكيون (منسقة مجموعة الصحة الرقمية والذكاء الاصطناعي في منظمة أطباء الأسرة الشباب) على أن دور الذكاء الاصطناعي لا يقتصر على تحسين عمليات الفحص المبكر والتشخيص السريع والمتابعة الدورية، بل يمتد إلى تقليص الوقت المستغرق في الأعمال الورقية والإدارية، مما يعيد التركيز إلى جوهر الرعاية الطبية الإنسانية.</p>
      
      <p>استعرضت الجلسة نماذج عالمية ناجحة لدمج الأدوات الرقمية في العيادات التخصصية ومراكز الرعاية الأولية، وحللت التحديات من منظور العوامل البشرية والأخلاقيات الطبية لضمان سلامة المرضى وخصوصية بياناتهم.</p>
      
      <h2>رؤية الجمعية وتطوير طب الأسرة في العراق</h2>
      <p>تؤكد جمعية أطباء الأسرة العراقية حرصها المستمر على مواكبة أحدث التطورات العلمية العالمية ونقل الخبرات المتقدمة إلى أطباء الأسرة في العراق، بما يسهم في رفع كفاءة الكوادر الطبية الوطنية ودعم التحول نحو رقمنة الرعاية الصحية والوقاية الاستباقية.</p>
    `,
    content_en: '<p>Comprehensive review of WONCA World conference insights on generative AI tools in primary healthcare.</p>',
    featured_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    author_name: 'اللجنة الإعلامية - IFPS',
    status: 'published',
    is_pinned: true,
    is_featured: true,
    published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    metadata: {
      read_time: '4 دقائق',
      source: 'WONCA World & IFPS International Affairs',
    },
    seo_title: 'مشاركة الجمعية في فعاليات WONCA World | جمعية أطباء الأسرة العراقية',
    seo_description: 'مشاركة جمعية أطباء الأسرة العراقية في فعاليات WONCA World وتطبيقات الذكاء الاصطناعي في الرعاية الصحية الأولية.',
    view_count: 1420,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'post-2',
    content_type_id: '11111111-1111-1111-1111-111111111111',
    content_type_slug: 'news',
    content_type_name_ar: 'الأخبار',
    title_ar: 'صدور الأمر الإداري الخاص بالوجبة الخامسة لأطباء الأسرة',
    title_en: 'Issuance of Administrative Order - Batch 5 for Family Physicians',
    slug: 'administrative-order-batch-5',
    summary_ar: 'تعلن جمعية أطباء الأسرة العراقية عن صدور الأمر الإداري الخاص بالوجبة الخامسة للزملاء أطباء وطبيبات الأسرة مع روابط التحميل الرسمية.',
    summary_en: 'Official administrative order published for the 5th batch of family medicine specialists in Iraq.',
    content_ar: `
      <p>يسر الهيئة الإدارية لجمعية أطباء الأسرة العراقية أن تبارك لجميع الزملاء والزميلات أطباء وطبيبات الأسرة بمناسبة صدور الأمر الإداري الموقر الخاص بالوجبة الخامسة.</p>
      <p>يمكن لجميع الأعضاء المعنيين تنزيل نسخة الأمر الإداري الرسمية ومراجعة الأسماء والتعليمات المرفقة عبر الرابط المعتمد.</p>
      <p>وتجدد الجمعية التزامها التام بمتابعة كافة الملفات والاستحقاقات المهنية والأكاديمية بالتنسيق الدائم مع وزارة الصحة والمؤسسات الصحية ذات العلاقة.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    author_name: 'المكتب التنفيذي - IFPS',
    status: 'published',
    is_pinned: false,
    is_featured: true,
    published_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    metadata: {
      file_url: 'https://iraqifps.org/wp-content/uploads/2026/05/%D8%A7%D9%85%D8%B1-%D8%A7%D8%AF%D8%A7%D8%B1%D9%8A-%D9%88%D8%AC%D8%A8%D8%A9-%D8%AE%D8%A7%D9%85%D8%B3%D8%A9.pdf',
      file_name: 'امر اداري وجبة خامسة.pdf',
      read_time: 'دقيقتان',
    },
    seo_title: 'الأمر الإداري الوجبة الخامسة | جمعية أطباء الأسرة العراقية',
    seo_description: 'تحميل الأمر الإداري الخاص بالوجبة الخامسة لأطباء الأسرة من جمعية أطباء الأسرة العراقية.',
    view_count: 2840,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'post-3',
    content_type_id: '33333333-3333-3333-3333-333333333333',
    content_type_slug: 'courses',
    content_type_name_ar: 'الدورات والورش',
    title_ar: 'البرنامج المتقدم لمنظومة التدريب والتطوير المهني المستدام (CPD-s)',
    title_en: 'Advanced Continuing Professional Development System (CPD-s)',
    slug: 'cpd-s-advanced-training-program',
    summary_ar: 'دليل ومنظومة تدريبية معيارية متكاملة تهدف إلى مأسسة التدريب التخصصي السريري والإداري والبحثي لأطباء الأسرة وفق أفضل الممارسات العالمية.',
    summary_en: 'Accredited continuing medical education program institutionalizing clinical, administrative, and research development tracks.',
    content_ar: `
      <p>نظراً للتطور الجذري في الابتكارات العلاجية، تحول التعليم الطبي المستمر إلى ضرورة استراتيجية لضمان كفاءة النظام الصحي، وتحديداً في اختصاص طب الأسرة بوصفه حجر الزاوية للرعاية الأولية.</p>
      
      <h2>أهداف منظومة CPD-s</h2>
      <p>صاغت جمعية أطباء الأسرة العراقية دليل منظومة التطوير المهني المستدام (CPD-s) ليكون إطاراً معيارياً شاملاً يهدف إلى:</p>
      <ul>
        <li>مأسسة التدريب الطبي المستمر عبر مسارات مهنية دقيقة ومحددة.</li>
        <li>تطبيق آليات تقييم حديثة ترتقي بالأداء السريري والإداري والبحثي للطبيب.</li>
        <li>ربط ساعات التدريب بالاعتماد المهني وبرامج الترقية التخصصية.</li>
        <li>تمكين الطبيب من مواكبة أحدث بروتوكولات الفحص والوقاية والتدبير العلاجي للأمراض الشائعة والمزمنة.</li>
      </ul>
      
      <p>إننا نقدم هذا العمل كعقد مهني يضمن توفير أرقى مستويات التعليم الطبي لأطبائنا الأعزاء، خدمةً للمواطن العراقي والمجتمع ككل.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    author_name: 'اللجنة العلمية للتدريب والتطوير',
    status: 'published',
    is_pinned: true,
    is_featured: true,
    published_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    metadata: {
      duration: '4 أسابيع (مكثف)',
      mode: 'حضوري وعبر المنصة التعليمية للجمعية',
      instructor: 'نخبة من استشاريي وأساتذة طب الأسرة والتعليم الطبي',
      seats: 60,
      cpd_hours: 30,
      fee: 'مجاني للأعضاء المسددين لاشتراكاتهم',
      registration_status: 'open',
      registration_url: 'https://forms.gle/ifps-cpd-registration',
      certificate_info: 'شهادة معتمدة بساعات التعليم الطبي المستمر من الجمعية والمجلس العلمي',
    },
    seo_title: 'منظومة التدريب والتطوير المهني المستدام CPD-s | جمعية أطباء الأسرة العراقية',
    seo_description: 'التسجيل في برنامج منظومة التطوير المهني المستدام CPD-s لأطباء الأسرة في العراق.',
    view_count: 3120,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'post-4',
    content_type_id: '22222222-2222-2222-2222-222222222222',
    content_type_slug: 'events',
    content_type_name_ar: 'الفعاليات والمؤتمرات',
    title_ar: 'المؤتمر الوطني السنوي لطب الأسرة: طب الأسرة حجر الزاوية للضمان الصحي',
    title_en: 'Annual National Family Medicine Conference: Corner-Stone of Health Insurance',
    slug: 'annual-national-family-medicine-conference',
    summary_ar: 'المؤتمر العلمي الوطني السنوي بمشاركة نخبة من الخبراء وممثلي وزارة الصحة وهيئة الضمان الصحي لمناقشة مستقبل الرعاية الأولية في العراق.',
    summary_en: 'The premier national scientific gathering on family medicine and healthcare system transformation in Iraq.',
    content_ar: `
      <p>تنظم جمعية أطباء الأسرة العراقية مؤتمرها العلمي الوطني السنوي، بمشاركة باحثين واستشاريين وأطباء أسرة من عموم المحافظات العراقية، وبحضور قيادات القطاع الصحي وهيئة الضمان الصحي الوطني.</p>
      
      <h2>محاور المؤتمر العلمية:</h2>
      <ol>
        <li><strong>طب الأسرة والضمان الصحي:</strong> التحول التشغيلي نحو تسجيل العوائل لدى أطباء الأسرة.</li>
        <li><strong>الكشف المبكر والوقاية:</strong> أحدث برامج المسح السكاني للأمراض غير الانتقالية والأورام.</li>
        <li><strong>التدريب الأكاديمي والسريري:</strong> التوسع في مراكز التدريب واستيعاب متطلبات المرحلة القادمة.</li>
        <li><strong>أخلاقيات الممارسة الطبية:</strong> حماية العلاقة الإنسانية بين الطبيب والمريض في عصر الرقمنة.</li>
      </ol>
      
      <p>يتخلل المؤتمر معرض طبي وورش عمل موازية، بالإضافة إلى جلسة حوارية خاصة لمناقشة احتياجات الأطباء الشباب والكوادر المقيمة.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80',
    author_name: 'لجنة المؤتمرات العلمية',
    status: 'published',
    is_pinned: true,
    is_featured: true,
    published_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    metadata: {
      event_date: '2026-11-20',
      event_time: '09:00 ص - 04:30 م',
      venue: 'بغداد - قاعة المؤتمرات الكبرى',
      organizer: 'جمعية أطباء الأسرة العراقية بالتعاون مع وزارة الصحة',
      registration_status: 'open',
      registration_url: 'https://forms.gle/ifps-conference-2026',
    },
    seo_title: 'المؤتمر الوطني السنوي لطب الأسرة 2026 | جمعية أطباء الأسرة العراقية',
    seo_description: 'تفاصيل ومحاور ورابط التسجيل في المؤتمر الوطني السنوي لطب الأسرة في بغداد.',
    view_count: 4210,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'post-5',
    content_type_id: '44444444-4444-4444-4444-444444444444',
    content_type_slug: 'opportunities',
    content_type_name_ar: 'الدراسات العليا والفرص',
    title_ar: 'إعلان امتحانات البورد العربي والمجلس العلمي لاختصاص طب الأسرة',
    title_en: 'Arab Board Family Medicine Examinations & Clinical Assessments',
    slug: 'arab-board-family-medicine-exams',
    summary_ar: 'جدول وتعليمات الامتحانات التمهيدية والسريرية والأوسكي والنظري لطلبة ومقيمي البورد العربي والمجلس العلمي لاختصاص طب الأسرة.',
    summary_en: 'Guidelines and schedule for the Arab Board in Family Medicine clinical, OSCE, and theoretical exams.',
    content_ar: `
      <p>يعلن المجلس العلمي المحلي لاختصاص طب الأسرة بالتعاون مع جمعية أطباء الأسرة العراقية عن فتح باب التسجيل وتحديد المواعيد النهائية للامتحانات السريرية والأوسكي والنظري لدورة الامتحانات التخصصية القادمة.</p>
      
      <h2>شروط وآليات التقديم:</h2>
      <ul>
        <li>إكمال متطلبات التدريب السريري المعتمد في المراكز التدريبية المعتمدة.</li>
        <li>تسليم سجل الحالات السريرية (Logbook) مصدقاً من المشرف العلمي.</li>
        <li>إتمام التسجيل المالي والإداري قبل الموعد النهائي المحدد.</li>
      </ul>
      
      <p>تتمنى الجمعية لجميع زملائنا الأطباء المتقدمين دوام التوفيق والنجاح في مسيرتهم العلمية والمهنية لخدمة الوطن.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
    author_name: 'لجنة الدراسات العليا والمجلس العلمي',
    status: 'published',
    is_pinned: true,
    is_featured: false,
    published_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    metadata: {
      deadline: '2026-11-15',
      authority: 'المجلس العلمي لاختصاص طب الأسرة & IFPS',
      exam_type: 'امتحانات سريرية وأوسكي ونظري',
      file_url: 'https://iraqifps.org/wp-content/uploads/2026/05/%D8%A7%D9%85%D8%B1-%D8%A7%D8%AF%D8%A7%D8%B1%D9%8A-%D9%88%D8%AC%D8%A8%D8%A9-%D8%AE%D8%A7%D9%85%D8%B3%D8%A9.pdf',
      file_name: 'دليل الامتحان والتعليمات الرسمية.pdf',
    },
    seo_title: 'امتحانات البورد العربي لاختصاص طب الأسرة | جمعية أطباء الأسرة العراقية',
    seo_description: 'مواعيد وتعليمات امتحانات البورد العربي في طب الأسرة والمجلس العلمي العراقي.',
    view_count: 1890,
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
];
