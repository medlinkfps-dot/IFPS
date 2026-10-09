import React, { useState } from 'react';
import { Monitor, Smartphone, X, Calendar, User, Eye } from 'lucide-react';
import { Post } from '../../types';
import { RichTextRenderer } from '../common/RichTextRenderer';
import { Badge } from '../common/Badge';

interface PostPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Partial<Post>;
}

export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({
  isOpen,
  onClose,
  post,
}) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-slate-100 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-navy-900 text-sm flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-medical-600" />
              <span>معاينة المنشور المباشرة</span>
            </span>
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${
                  device === 'desktop' ? 'bg-white text-navy-900 font-bold shadow-xs' : 'text-slate-600'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>حاسوب</span>
              </button>
              <button
                type="button"
                onClick={() => setDevice('mobile')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${
                  device === 'mobile' ? 'bg-white text-navy-900 font-bold shadow-xs' : 'text-slate-600'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>هاتف ذكي</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Frame Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center items-start">
          <div 
            className={`bg-white transition-all duration-300 shadow-lg rounded-2xl overflow-hidden border border-slate-200 ${
              device === 'mobile' 
                ? 'w-[375px] min-h-[640px] rounded-[36px] border-[10px] border-slate-800 shadow-2xl p-4' 
                : 'w-full max-w-3xl p-6 sm:p-10'
            }`}
          >
            {/* Post Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="primary" size="sm">
                  {post.content_type_name_ar || 'الأخبار'}
                </Badge>
                {post.is_pinned && (
                  <Badge variant="accent" size="sm">مثبت</Badge>
                )}
                <span className="text-xs text-slate-400 flex items-center gap-1 mr-auto">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date().toLocaleDateString('ar-IQ')}</span>
                </span>
              </div>

              <h1 className={`font-bold text-navy-900 leading-tight mb-3 ${
                device === 'mobile' ? 'text-lg' : 'text-2xl sm:text-3xl'
              }`}>
                {post.title_ar || 'عنوان المنشور الافتراضي'}
              </h1>

              {post.summary_ar && (
                <p className="text-slate-600 text-sm leading-relaxed border-r-3 border-medical-500 pr-3 my-4 bg-slate-50 p-2.5 rounded-l-lg">
                  {post.summary_ar}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <User className="w-3.5 h-3.5 text-medical-600" />
                <span>{post.author_name || 'إدارة جمعية أطباء الأسرة العراقية'}</span>
              </div>
            </div>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="mb-6 rounded-xl overflow-hidden shadow-sm">
                <img 
                  src={post.featured_image} 
                  alt={post.title_ar || 'صورة المنشور'} 
                  className="w-full h-auto max-h-[380px] object-cover"
                />
              </div>
            )}

            {/* Post Content */}
            <div className="border-t border-slate-100 pt-6">
              <RichTextRenderer content={post.content_ar || '<p>لا يوجد محتوى مكتوب بعد.</p>'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
