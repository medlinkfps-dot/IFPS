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
  Edit3
} from 'lucide-react';

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
  const [isRawMode, setIsRawMode] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

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
            if (onOpenMediaPicker) {
              onOpenMediaPicker();
            } else {
              const url = prompt('أدخل رابط الصورة:');
              if (url) execCommand('insertImage', url);
            }
          }}
          className="p-1.5 hover:bg-slate-200 rounded transition-colors text-medical-700"
          title="إدراج صورة"
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
    </div>
  );
};
