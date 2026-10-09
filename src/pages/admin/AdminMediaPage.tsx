import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  FileText, 
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { MediaItem } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const MEDIA_STORAGE_KEY = 'ifps_media_library';

export const AdminMediaPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = async () => {
    setLoading(true);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          setMediaList(data);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error('Error fetching Supabase media:', e);
      }
    }

    // Fallback store with seed assets
    const stored = localStorage.getItem(MEDIA_STORAGE_KEY);
    if (stored) {
      setMediaList(JSON.parse(stored));
    } else {
      const initial: MediaItem[] = [
        {
          id: 'm-1',
          file_name: 'شعار الجمعية الرسمي fps.png',
          file_path: 'fps.png',
          public_url: '/fps.png',
          file_size: 907200,
          mime_type: 'image/png',
          alt_text: 'شعار جمعية أطباء الأسرة العراقية المعتمد',
          created_at: new Date().toISOString(),
        },
        {
          id: 'm-2',
          file_name: 'الختم الرسمي الدائري fps.png',
          file_path: 'fps.png',
          public_url: '/fps.png',
          file_size: 907200,
          mime_type: 'image/png',
          alt_text: 'ختم جمعية أطباء الأسرة العراقية الرسمي',
          created_at: new Date().toISOString(),
        },
        {
          id: 'm-3',
          file_name: 'الأمر الإداري الوجبة الخامسة.pdf',
          file_path: 'uploads/batch-5-order.pdf',
          public_url: 'https://iraqifps.org/wp-content/uploads/2026/05/%D8%A7%D9%85%D8%B1-%D8%A7%D8%AF%D8%A7%D8%B1%D9%8A-%D9%88%D8%AC%D8%A8%D8%A9-%D8%AE%D8%A7%D9%85%D8%B3%D8%A9.pdf',
          file_size: 245000,
          mime_type: 'application/pdf',
          alt_text: 'ملف الأمر الإداري المعتمد',
          created_at: new Date().toISOString(),
        },
      ];
      setMediaList(initial);
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(initial));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const file = files[0];

    // File validation: Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert('الحد الأقصى لحجم الملف هو 10 ميغابايت.');
      setUploading(false);
      return;
    }

    try {
      let publicUrl = '';
      const filePath = `uploads/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

      if (isSupabaseConfigured) {
        // Upload to Supabase Storage bucket 'media'
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath);
          publicUrl = urlData.publicUrl;

          // Record in media table
          await supabase.from('media').insert({
            file_name: file.name,
            file_path: filePath,
            public_url: publicUrl,
            file_size: file.size,
            mime_type: file.type,
          });
        }
      }

      // If offline or storage direct preview
      if (!publicUrl) {
        // Create local object URL for preview
        publicUrl = URL.createObjectURL(file);
      }

      const newItem: MediaItem = {
        id: `media-${Date.now()}`,
        file_name: file.name,
        file_path: filePath,
        public_url: publicUrl,
        file_size: file.size,
        mime_type: file.type,
        created_at: new Date().toISOString(),
      };

      const updated = [newItem, ...mediaList];
      setMediaList(updated);
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopy = (item: MediaItem) => {
    navigator.clipboard.writeText(item.public_url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (isSupabaseConfigured) {
        await supabase.from('media').delete().eq('id', itemToDelete.id);
        await supabase.storage.from('media').remove([itemToDelete.file_path]);
      }
      const updated = mediaList.filter(m => m.id !== itemToDelete.id);
      setMediaList(updated);
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(updated));
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filtered = mediaList.filter(m => 
    m.file_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SEO title="مكتبة الوسائط والملفات | IFPS CMS" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">مكتبة الوسائط والملفات</h1>
          <p className="text-xs text-slate-500">رفع وإدارة صور المنشورات، الشعارات، وملفات الـ PDF الرسمية</p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,application/pdf"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-5 py-2.5 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{uploading ? 'جارِ الرفع...' : 'رفع ملف جديد'}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في الملفات والوسائط..."
            className="w-full pl-4 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-medical-500"
          />
        </div>
        <span className="text-xs text-slate-400">إجمالي الملفات: {filtered.length}</span>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="lg" label="جارِ تحميل مكتبة الوسائط..." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200">
          لا توجد ملفات مرفوعة حالياً. انقر على "رفع ملف جديد" لإضافة صور أو مستندات.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((item) => {
            const isImage = item.mime_type.startsWith('image/');
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden group flex flex-col justify-between"
              >
                <div className="relative aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    <img 
                      src={item.public_url} 
                      alt={item.file_name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <FileText className="w-12 h-12 text-medical-600" />
                  )}

                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => handleCopy(item)}
                      className="p-2 bg-white/90 hover:bg-white text-navy-900 rounded-lg shadow-sm"
                      title="نسخ الرابط"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a
                      href={item.public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/90 hover:bg-white text-navy-900 rounded-lg shadow-sm"
                      title="فتح في نافذة جديدة"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => {
                        setItemToDelete(item);
                        setDeleteModalOpen(true);
                      }}
                      className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-2.5 text-[11px]">
                  <p className="font-bold text-navy-900 truncate mb-0.5" title={item.file_name}>
                    {item.file_name}
                  </p>
                  <span className="text-slate-400 block text-[10px]">
                    {(item.file_size / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="تأكيد حذف الملف"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-xs font-semibold">هل أنت متأكد من حذف هذا الملف من الخادم؟</p>
          </div>
          <p className="text-xs text-slate-600 truncate">
            اسم الملف: <strong className="text-navy-900">{itemToDelete?.file_name}</strong>
          </p>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
            >
              حذف نهائي
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
