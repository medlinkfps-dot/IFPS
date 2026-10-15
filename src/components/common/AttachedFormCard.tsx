import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, ArrowLeft, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { getFormById, getFormBySlug } from '../../lib/db';
import { CustomForm } from '../../types';

interface AttachedFormCardProps {
  formId?: string;
  formSlug?: string;
}

export const AttachedFormCard: React.FC<AttachedFormCardProps> = ({ formId, formSlug }) => {
  const [form, setForm] = useState<CustomForm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!formId && !formSlug) {
      setLoading(false);
      return;
    }

    const fetchForm = async () => {
      try {
        let data: CustomForm | null = null;
        if (formId) {
          data = await getFormById(formId);
        } else if (formSlug) {
          data = await getFormBySlug(formSlug);
        }
        setForm(data);
      } catch (err) {
        console.error('Error fetching attached form:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId, formSlug]);

  if (loading || !form) return null;

  const isExpired = form.deadline && new Date(form.deadline).getTime() < Date.now();
  const isClosed = form.status === 'closed' || isExpired;

  return (
    <div className="my-8 rounded-3xl bg-gradient-to-br from-teal-900 via-navy-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-teal-500/20 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-medical-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <ClipboardList className="w-3.5 h-3.5" />
              <span>استمارة / استبيان ملحق</span>
            </span>

            {!isClosed ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                المشاركة متاحة الآن
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
                <Clock className="w-3 h-3" />
                مغلق
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
            {form.title}
          </h3>

          {form.description && (
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
              {form.description}
            </p>
          )}

          {form.deadline && !isExpired && (
            <p className="text-xs text-amber-300 flex items-center gap-1.5 font-medium pt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>
                آخر موعد للتقديم: {new Date(form.deadline).toLocaleString('ar-IQ', { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          {!isClosed ? (
            <Link
              to={`/forms/${form.slug}`}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>{form.submit_button_text ? `تعبئة ${form.submit_button_text}` : 'تعبئة الاستمارة الآن'}</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 text-slate-400 font-bold text-xs cursor-not-allowed">
              <span>انتهت فترة التسجيل</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
