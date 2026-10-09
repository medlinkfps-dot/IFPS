import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Link as LinkIcon, 
  AlertCircle, 
  RefreshCw,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { uploadImageFile } from '../../lib/imageUtils';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  placeholder?: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'auto';
  className?: string;
  bucket?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  label = 'الصورة',
  description,
  placeholder = 'https://example.com/image.jpg',
  aspectRatio = 'video',
  className = '',
  bucket = 'media',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState(value && !value.startsWith('data:') ? value : '');

  const aspectClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[21/9]',
    auto: 'min-h-[160px] max-h-[300px]',
  }[aspectRatio];

  const handleProcessFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('يرجى اختيار ملف صورة صالح (JPEG, PNG, WebP, SVG, GIF).');
      return;
    }

    // Limit to 15MB
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('حجم الصورة كبير جداً، الحد الأقصى المسموح هو 15 ميغابايت.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const result = await uploadImageFile(file, bucket);
      onChange(result.url);
      setCustomUrl('');
    } catch (err: any) {
      setErrorMessage(err.message || 'تعذر معالجة الصورة، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleProcessFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleProcessFile(files[0]);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setCustomUrl('');
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleApplyUrl = () => {
    if (!customUrl.trim()) return;
    onChange(customUrl.trim());
    setErrorMessage(null);
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Header Label and Actions */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-navy-900 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-medical-600" />
          <span>{label}</span>
        </label>
        
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-medical-700 hover:text-medical-800 font-semibold flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'إخفاء حقل الرابط' : 'إدخال رابط مباشر (URL)'}</span>
        </button>
      </div>

      {description && (
        <p className="text-[11px] text-slate-500 leading-relaxed">{description}</p>
      )}

      {/* Direct URL Input Toggle */}
      {showUrlInput && (
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono text-left focus:ring-1 focus:ring-medical-500 focus:outline-none"
              dir="ltr"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              disabled={!customUrl.trim()}
              className="px-3 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-40"
            >
              تطبيق
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            يمكنك إدخال رابط صورة مباشرة من الإنترنت مثل صور استضافة سحابية أو Unsplash.
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* Error Message */}
      {errorMessage && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Image Preview Box if image exists */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-100 group">
          <div className={`${aspectClass} w-full flex items-center justify-center overflow-hidden`}>
            <img
              src={value}
              alt="معاينة الصورة"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
          </div>

          {/* Action Overlay */}
          <div className="p-3 bg-white/95 backdrop-blur-xs border-t border-slate-200/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">
                {value.startsWith('data:') ? 'صورة مرفوعة من جهازك بنجاح' : value}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                title="تغيير الصورة واختيار ملف آخر"
              >
                <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>استبدال</span>
              </button>

              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isProcessing}
                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                title="حذف الصورة الحالية"
              >
                <Trash2 className="w-3 h-3" />
                <span>حذف</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-medical-500 bg-medical-50/70 scale-[0.99]'
              : 'border-slate-300 hover:border-medical-400 bg-slate-50/60 hover:bg-slate-50'
          }`}
        >
          {isProcessing ? (
            <div className="py-4 flex flex-col items-center justify-center space-y-2">
              <RefreshCw className="w-8 h-8 text-medical-600 animate-spin" />
              <p className="text-xs font-bold text-navy-900">جارِ معالجة وضغط الصورة ورفعها...</p>
              <p className="text-[11px] text-slate-400">يتم تحسين الأبعاد تلقائياً للحفاظ على سرعة تصفح فائقة</p>
            </div>
          ) : (
            <div className="py-2 flex flex-col items-center justify-center space-y-2.5">
              <div className="w-12 h-12 rounded-2xl bg-medical-50 text-medical-600 flex items-center justify-center shadow-xs border border-medical-100">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-navy-900">
                  انقر لاختيار صورة من جهازك، أو اسحب وأفلت هنا
                </p>
                <p className="text-[11px] text-slate-400 mt-1 font-sans">
                  يدعم صيغ PNG, JPG, WebP, SVG حتى 15MB
                </p>
              </div>
              <button
                type="button"
                className="mt-1 px-4 py-1.5 bg-medical-600 hover:bg-medical-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                تصفح الجهاز
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
