import React, { useState, useEffect } from 'react';
import { Mail, Check, Trash2, Clock, Phone, User, Inbox, AlertTriangle } from 'lucide-react';
import { getContactMessages, markContactMessageRead, deleteContactMessage } from '../../lib/db';
import { ContactMessage } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState<ContactMessage | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (e) {
      console.error('Error loading messages:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleOpenMessage = async (msg: ContactMessage) => {
    setActiveMessage(msg);
    if (!msg.is_read) {
      await markContactMessageRead(msg.id, true);
      setMessages(messages.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteContactMessage(toDelete.id);
      setDeleteModalOpen(false);
      setToDelete(null);
      if (activeMessage?.id === toDelete.id) setActiveMessage(null);
      loadMessages();
    } catch (e) {
      console.error('Error deleting message:', e);
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="صندوق الرسائل والاستفسارات | IFPS CMS" />

      <div>
        <h1 className="text-2xl font-bold text-navy-900">الرسائل والاستفسارات الواردة</h1>
        <p className="text-xs text-slate-500">متابعة رسائل نموذج التواصل والرد على استفسارات الأطباء والمراجعين</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <span className="text-xs font-bold text-navy-900">صندوق الوارد</span>
            <span className="text-[11px] text-slate-400">إجمالي الرسائل: {messages.length}</span>
          </div>

          {loading ? (
            <div className="py-20">
              <LoadingSpinner size="md" label="جارِ جلب الرسائل..." />
            </div>
          ) : messages.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-xs">
              لا توجد رسائل واردة حالياً.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {messages.map((msg) => {
                const isSelected = activeMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    className={`p-4 cursor-pointer transition-colors text-xs ${
                      isSelected 
                        ? 'bg-medical-50/70 border-r-4 border-medical-500' 
                        : !msg.is_read 
                          ? 'bg-slate-50/80 font-bold hover:bg-slate-100' 
                          : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-navy-900 truncate">{msg.full_name}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.created_at).toLocaleDateString('ar-IQ')}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800 truncate mb-1">{msg.subject}</p>
                    <p className="text-slate-500 line-clamp-2 text-[11px] font-normal">{msg.message}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Message Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 min-h-[400px]">
          {activeMessage ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-navy-900 mb-1">{activeMessage.subject}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <User className="w-3.5 h-3.5 text-medical-600" />
                      <span>{activeMessage.full_name}</span>
                    </span>
                    <span className="text-medical-700 font-sans">{activeMessage.email}</span>
                    {activeMessage.phone && (
                      <span className="flex items-center gap-1 font-sans">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{activeMessage.phone}</span>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setToDelete(activeMessage);
                    setDeleteModalOpen(true);
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50"
                  title="حذف الرسالة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Message Content */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {activeMessage.message}
              </div>

              {/* Reply Action */}
              <div className="pt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  تاريخ الاستلام: {new Date(activeMessage.created_at).toLocaleString('ar-IQ')}
                </span>

                <a
                  href={`mailto:${activeMessage.email}?subject=رد:%20${encodeURIComponent(activeMessage.subject)}`}
                  className="px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  الرد عبر البريد الإلكتروني
                </a>
              </div>
            </div>
          ) : (
            <div className="py-32 text-center text-slate-400 text-xs">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <span>اختر رسالة من القائمة لعرض تفاصيلها.</span>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="تأكيد حذف الرسالة"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-xs font-semibold">هل ترغب بحذف هذه الرسالة نهائياً؟</p>
          </div>
          <p className="text-xs text-slate-600">
            المرسل: <strong className="text-navy-900">{toDelete?.full_name}</strong>
          </p>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              إلغاء
            </button>
            <button
              onClick={confirmDelete}
              className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
            >
              حذف
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
