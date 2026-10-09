import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Search, 
  Calendar, 
  HardDrive, 
  Eye, 
  Filter, 
  CheckCircle2,
  FileCheck,
  ArrowDownToLine
} from 'lucide-react';
import { getPDFDocuments, incrementDocumentDownload } from '../../lib/db';
import { PDFDocument } from '../../types';
import { SEO } from '../../components/common/SEO';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<PDFDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadDocs() {
      try {
        setIsLoading(true);
        const data = await getPDFDocuments();
        setDocuments(data.filter(d => d.is_active));
      } catch (err) {
        console.error('Failed to load documents:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDocs();
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    documents.forEach(d => {
      if (d.category) cats.add(d.category);
    });
    return Array.from(cats);
  }, [documents]);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [documents, searchQuery, selectedCategory]);

  const handleDownload = async (doc: PDFDocument) => {
    try {
      setDownloadingId(doc.id);
      await incrementDocumentDownload(doc.id);
      
      // Update local state count
      setDocuments(prev => prev.map(d => 
        d.id === doc.id ? { ...d, downloads_count: (d.downloads_count || 0) + 1 } : d
      ));

      // Trigger download
      const link = document.createElement('a');
      link.href = doc.file_url;
      link.target = '_blank';
      link.download = doc.file_name || `${doc.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Download error:', e);
      window.open(doc.file_url, '_blank');
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <SEO 
        title="الوثائق والاستمارات الرسمية" 
        description="مكتبة الوثائق الرسمية، الاستمارات، الأوامر الإدارية، والأدلة السريرية المعتمدة لجمعية أطباء الأسرة العراقية بصيغة PDF قابلة للتحميل المباشر."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-medical-50 text-medical-700 text-xs font-bold border border-medical-100">
            <FileCheck className="w-4 h-4 text-medical-500" />
            <span>المكتبة الرقمية والوثائق المعتمدة</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 leading-tight">
            الوثائق والاستمارات الرسمية
          </h1>

          <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
            تحميل مباشر للأوامر الإدارية، نماذج الاستمارات، والأدلة الإرشادية واللوائح الصادرة عن جمعية أطباء الأسرة العراقية بصيغة PDF عالية الدقة.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-soft space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الوثيقة، رقم الأمر، أو الكلمات المفتاحية..."
              className="w-full pr-12 pl-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-medical-500 focus:ring-2 focus:ring-medical-500/20 text-sm font-medium transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/60 px-2 py-1 rounded-lg"
              >
                مسح
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1 ml-2">
              <Filter className="w-3.5 h-3.5" />
              <span>التصنيف:</span>
            </span>

            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              جميع الوثائق ({documents.length})
            </button>

            {categories.map((cat) => {
              const count = documents.filter(d => d.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-medical-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" label="جارِ جلب الوثائق والملفات الرسمية..." />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-navy-900">لم يتم العثور على أي وثيقة مطابقة</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              جرب تغيير عبارة البحث أو اختيار تصنيف آخر لعرض الملفات المتاحة.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-2 px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              إعادة ضبط البحث
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-2 font-medium">
              <span>عرض {filteredDocuments.length} من أصل {documents.length} وثيقة</span>
              <span>صيغة الملفات: PDF</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredDocuments.map((doc) => (
                <div 
                  key={doc.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  {/* Left (RTL: Right) File Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* PDF Badge Icon */}
                    <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-rose-50 border border-rose-100 flex flex-col items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6 text-rose-600" />
                      <span className="text-[10px] font-black text-rose-700 tracking-wider font-sans mt-0.5 uppercase">
                        PDF
                      </span>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold text-medical-700 bg-medical-50 px-2.5 py-0.5 rounded-full border border-medical-100">
                          {doc.category}
                        </span>
                        {doc.published_date && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-sans">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{doc.published_date}</span>
                          </span>
                        )}
                        {doc.file_size && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-sans">
                            <HardDrive className="w-3 h-3 text-slate-400" />
                            <span>{doc.file_size}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-navy-900 group-hover:text-medical-600 transition-colors leading-snug">
                        {doc.title}
                      </h3>

                      {doc.description && (
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                          {doc.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 font-sans">
                        <span>مرات التحميل: <strong className="text-slate-600 font-semibold">{doc.downloads_count || 0}</strong></span>
                        <span>•</span>
                        <span className="truncate text-slate-400 font-mono text-[10px]">{doc.file_name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
                      title="معاينة الملف في علامة تبويب جديدة"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>معاينة</span>
                    </a>

                    <button
                      onClick={() => handleDownload(doc)}
                      disabled={downloadingId === doc.id}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-medical-500 hover:bg-medical-600 active:scale-95 text-white text-xs font-bold shadow-xs hover:shadow transition-all"
                    >
                      {downloadingId === doc.id ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 animate-bounce" />
                          <span>جارِ الفتح...</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownToLine className="w-4 h-4" />
                          <span>تحميل الملف (PDF)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notice Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 text-center space-y-2">
          <h4 className="font-bold text-navy-900 text-sm">
            هل تحتاج إلى وثيقة رسمية أو استمارة غير مدرجة؟
          </h4>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            يمكنك التواصل المباشر مع الأمانة العامة لجمعية أطباء الأسرة العراقية لطلب النسخ المعتمدة أو الاستفسار عن الأوامر الوزارية.
          </p>
          <div className="pt-2">
            <a 
              href="/contact" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-medical-600 hover:text-medical-700 hover:underline"
            >
              <span>الانتقال لصفحة الاتصال بنا والمقر العام</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
export default DocumentsPage;
