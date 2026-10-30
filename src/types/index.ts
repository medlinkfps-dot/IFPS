export type UserRole = 'admin' | 'editor';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface ContentType {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  description?: string;
  icon?: string;
  is_in_nav: boolean;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Category {
  id: string;
  content_type_id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description?: string;
}

export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface PostMetadata {
  // Event specific
  event_date?: string;
  event_time?: string;
  venue?: string;
  organizer?: string;
  registration_status?: 'open' | 'closed' | 'archived' | '';
  registration_deadline?: string;
  registration_url?: string;

  // Course specific
  duration?: string;
  mode?: string;
  instructor?: string;
  seats?: number;
  cpd_hours?: number;
  fee?: string;
  certificate_info?: string;
  brochure_url?: string;

  // Opportunity specific
  deadline?: string;
  authority?: string;
  exam_type?: string;
  requirements_pdf?: string;
  file_url?: string;
  file_name?: string;

  // Gallery specific
  gallery_images?: string[];
  slider_interval?: number;

  // News / General
  read_time?: string;
  source?: string;
  // Attached Survey / Form (DTform)
  attached_form_id?: string;
  attached_form_slug?: string;

  // Custom Action Button / External Link
  custom_button_text?: string;
  custom_button_url?: string;

  additional_sections?: string[]; // IDs or Slugs of other sections to appear in
  [key: string]: any;
}

export interface Post {
  id: string;
  content_type_id: string;
  content_type_slug?: string;
  content_type_name_ar?: string;
  title_ar: string;
  title_en?: string;
  slug: string;
  summary_ar: string;
  summary_en?: string;
  content_ar: string;
  content_en?: string;
  featured_image?: string;
  author_id?: string;
  author_name?: string;
  status: PostStatus;
  is_pinned: boolean;
  is_featured: boolean;
  sort_order?: number;
  published_at?: string;
  scheduled_for?: string;
  metadata: PostMetadata;
  seo_title?: string;
  seo_description?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  categories?: Category[];
}

export interface MediaItem {
  id: string;
  file_name: string;
  file_path: string;
  public_url: string;
  file_size: number;
  mime_type: string;
  alt_text?: string;
  uploader_id?: string;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value_ar: string;
  value_en?: string;
  value_json?: any;
  description?: string;
  category?: string;
  is_public: boolean;
  updated_at?: string;
}

export interface NavigationItem {
  id: string;
  label_ar: string;
  label_en: string;
  path: string;
  is_external: boolean;
  sort_order: number;
  is_active: boolean;
  parent_id?: string;
}

export interface AuditLog {
  id: string;
  admin_id?: string;
  admin_email: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'ARCHIVE' | 'LOGIN' | 'SETTINGS_UPDATE';
  entity_type: 'post' | 'setting' | 'category' | 'user' | 'section' | 'media' | 'message' | 'document' | 'form';
  entity_id?: string;
  details?: any;
  ip_address?: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  notes?: string;
  created_at: string;
}

export interface PDFDocument {
  id: string;
  title: string;
  description?: string;
  category: string;
  file_url: string;
  file_name: string;
  file_size?: string;
  published_date?: string;
  downloads_count?: number;
  sort_order?: number;
  is_active: boolean;
  created_at: string;
}

export type FormFieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'email' 
  | 'phone' 
  | 'radio' 
  | 'checkbox' 
  | 'select' 
  | 'file';

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: string[];
  allowedFileTypes?: string[];
  maxFileSizeMB?: number;
}

export interface CustomForm {
  id: string;
  title: string;
  slug: string;
  description?: string;
  fields: FormField[];
  status: 'open' | 'closed';
  deadline?: string;
  submit_button_text?: string;
  success_message?: string;
  allow_multiple_submissions?: boolean;
  view_count?: number;
  submission_count?: number;
  section_id?: string;
  section_slug?: string;
  category_id?: string;
  category_slug?: string;
  created_at: string;
  updated_at: string;
}

export interface FormSubmissionFile {
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  form_slug: string;
  answers: Record<string, any>;
  ip_address?: string;
  submitted_at: string;
}

