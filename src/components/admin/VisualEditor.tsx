import React, { useRef, useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Code, 
  Table, 
  RotateCcw,
  Eye,
  Edit3,
  Upload,
  X,
  RefreshCw,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { uploadImageFile } from '../../lib/imageUtils';

interface VisualEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onOpenMediaPicker?: () => void;
}

export const VisualEditor: React.FC<VisualEditorProps> = ({
  value,
  onChange,
  placeholder = 'اكتب تفاصيل المحتوى هنا...',
  onOpenMediaPicker,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isRawMode, setIsRawMode] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  // Image Insert Modal State
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Synchronize incoming value with contentEditable on initial mount or when mode toggles
  useEffect(() => {
    if (editorRef.current && !isRawMode) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [isRawMode]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, arg: string | undefined = undefined) => {
    if (isRawMode) return;
    document.execCommand(command, false, arg);
    handleInput();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const insertHeading = (tag: 'h2' | 'h3' | 'p') => {
    execCommand('formatBlock', tag);
  };

  const insertLink = () => {
    if (linkUrl) {
      if (linkText) {
        const a = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
        execCommand('insertHTML', a);
      } else {
        execCommand('createLink', linkUrl);
      }
      setLinkUrl('');
      setLinkText('');
      setLinkModalOpen(false);
    }
  };

  const insertTable = () => {
    const tableHTML = `
      <table class="w-full border-collapse border border-slate-300 my-4">
        <thead>
          <tr class="bg-slate-100">
            <th class="border border-slate-300 p-2 text-right">المحور</th>
            <th class="border border-slate-300 p-2 text-right">التفاصيل</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-slate-300 p-2">البند الأول</td>
            <td class="border border-slate-300 p-2">تفاصيل البند</td>
          </tr>
        </tbody>
      </table>
    `;
    execCommand('insertHTML', tableHTML);
  };

  return (
    <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-medical-500 focus-within:border-transparent transition-all">
      {/* Editor Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1 text-slate-700">
        <button
          type="button"
          onClick={() => insertHeading('h2')}
          className="p-1.5 hover:bg-slate-200 rounded text-xs font-bold transition-colors flex items-center gap-1"
          title="عنوان رئيسي (H2)"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertHeading('h3')}
          className="p-1.5 hover:bg-slate-200 rounded text-xs font-bold transition-colors flex items-center gap-1"
          title="عنوان فرعي (H3)"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-1.5 hover:bg-slate-200 rounded transition-colors"
          title="عريض (Bold)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-1.5 hover:bg-slate-200 rounded transition-colors"
          title="مائل (Italic)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="p-1.5 hover:bg-slate-200 rounded transition-colors"
          title="تسطير (Underline)"
        >
          <Underline className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-1.5 hover:bg-slate-200 rounded transition-colors"
          title="قائمة نقطية"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-1.5 hover:bg-slate-200 rounded transition-colors"
          title="قائمة رقمية"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'blockquote')}
          className="p-1.5 hover:bg-slate-200 rounded transition-colors"
          title="اقتباس (Quote)"
        >
          <Quote className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => setLinkModalOpen(true)}
          className="p-1.5 hover:bg-slate-200 rounded transition-colors text-medical-700"
          title="إضافة رابط"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            setImagePreviewUrl('');
            setImageUrlInput('');
            setImageAlt('');
            setImageCaption('');
            setImageError(null);
            setImageTab('upload');
            setImageModalOpen(true);
          }}
          className="p-1.5 hover:bg-slate-200 rounded transition-colors text-medical-700"
          title="إدراج صورة من الجهاز أو رابط"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={insertTable}
          className="p-1.5 hover:bg-slate-200 rounded transition-colors"
          title="إدراج جدول"
        >
          <Table className="w-4 h-4" />
        </button>

        <div className="mr-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsRawMode(!isRawMode)}
            className={`p-1.5 rounded text-xs flex items-center gap-1 font-mono transition-colors ${
              isRawMode ? 'bg-navy-900 text-white' : 'hover:bg-slate-200 text-slate-600'
            }`}
            title="تبديل كود HTML"
          >
            <Code className="w-4 h-4" />
            <span>{isRawMode ? 'عرض بصري' : 'HTML'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {isRawMode ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={12}
          className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-900 text-slate-100 focus:outline-none resize-y"
          dir="ltr"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          className="p-4 min-h-[260px] max-h-[500px] overflow-y-auto focus:outline-none prose-arabic text-slate-800"
          dir="rtl"
          data-placeholder={placeholder}
        />
      )}

      {/* Insert Link Mini Modal */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl p-5 max-w-sm w-full border border-slate-200">
            <h4 className="font-bold text-navy-900 text-sm mb-3">إدراج رابط تشعبي</h4>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">نص الرابط (اختياري):</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="مثال: اضغط هنا للمزيد"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-medical-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">الرابط URL:</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-medical-500"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="px-4 py-1.5 text-xs bg-medical-600 hover:bg-medical-700 text-white font-semibold rounded-lg"
              >
                إدراج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insert Image from Device / URL Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-medical-600" />
                <span>إدراج صورة في المحتوى</span>
              </h4>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setImageTab('upload'); setImageError(null); }}
                className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  imageTab === 'upload' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>رفع من الجهاز</span>
              </button>
              <button
                type="button"
                onClick={() => { setImageTab('url'); setImageError(null); }}
                className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  imageTab === 'url' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>رابط خارجي (URL)</span>
              </button>
            </div>

            {imageError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {imageError}
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImageError(null);
                setIsUploadingImage(true);
                try {
                  const res = await uploadImageFile(file, 'media');
                  setImagePreviewUrl(res.url);
                  if (!imageAlt) {
                    setImageAlt(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
                  }
                } catch (err: any) {
                  setImageError(err.message || 'فشل في قراءة أو رفع الصورة');
                } finally {
                  setIsUploadingImage(false);
                  if (imageInputRef.current) imageInputRef.current.value = '';
                }
              }}
              className="hidden"
            />

            {/* Tab 1: Upload from device */}
            {imageTab === 'upload' ? (
              <div>
                {imagePreviewUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video flex items-center justify-center">
                    <img src={imagePreviewUrl} alt="معاينة" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="p-2 bg-white text-slate-800 rounded-lg text-xs font-bold hover:bg-slate-100"
                      >
                        تغيير الصورة
                      </button>
                      <button
                        type="button"
                        onClick={() => setImagePreviewUrl('')}
                        className="p-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700"
                      >
                        إزالة
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => !isUploadingImage && imageInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-medical-500 rounded-xl p-6 text-center cursor-pointer bg-slate-50/70 hover:bg-slate-50 transition-colors"
                  >
                    {isUploadingImage ? (
                      <div className="flex flex-col items-center justify-center py-2 space-y-2">
                        <RefreshCw className="w-6 h-6 text-medical-600 animate-spin" />
                        <span className="text-xs font-semibold text-slate-600">جارِ معالجة ورفع الصورة من الجهاز...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-navy-900">انقر لاختيار صورة من جهازك</p>
                        <p className="text-[11px] text-slate-400">يدعم PNG, JPG, WebP حتى 15 ميغابايت</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Tab 2: URL input */
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">رابط الصورة المباشر:</label>
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-mono text-left focus:ring-1 focus:ring-medical-500"
                  dir="ltr"
                />
              </div>
            )}

            {/* Common Image Meta: Alt & Caption */}
            <div className="space-y-3 pt-1 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">النص البديل (Alt Text - موصى به):</label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="وصف مختصر لمحتوى الصورة"
                  className="w-full text-xs p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">تعليق توضيحي أسفل الصورة (اختياري):</label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="مثال: جانب من وقائع المؤتمر السنوي"
                  className="w-full text-xs p-2 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  const finalUrl = imageTab === 'upload' ? imagePreviewUrl : imageUrlInput.trim();
                  if (!finalUrl) {
                    setImageError('يرجى اختيار صورة من جهازك أو كتابة رابط.');
                    return;
                  }

                  const htmlToInsert = `
                    <figure style="text-align: center; margin: 1.5rem 0;">
                      <img src="${finalUrl}" alt="${imageAlt || 'صورة'}" style="max-width: 100%; height: auto; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin: 0 auto; display: inline-block;" />
                      ${imageCaption ? `<figcaption style="font-size: 0.75rem; color: #64748b; margin-top: 0.5rem;">${imageCaption}</figcaption>` : ''}
                    </figure>
                    <p><br></p>
                  `;

                  execCommand('insertHTML', htmlToInsert);
                  setImageModalOpen(false);
                }}
                disabled={isUploadingImage || (imageTab === 'upload' ? !imagePreviewUrl : !imageUrlInput.trim())}
                className="px-5 py-2 text-xs bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                إدراج في المقال
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
