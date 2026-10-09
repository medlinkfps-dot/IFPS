import React, { useState, useEffect } from 'react';
import { History, Shield, User, Clock, Search, Filter } from 'lucide-react';
import { getAuditLogs } from '../../lib/db';
import { AuditLog } from '../../types';
import { SEO } from '../../components/common/SEO';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadLogs() {
      try {
        const data = await getAuditLogs();
        setLogs(data);
      } catch (e) {
        console.error('Error loading audit logs:', e);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const getActionBadgeVariant = (action: AuditLog['action']) => {
    switch (action) {
      case 'CREATE': return 'success';
      case 'UPDATE': return 'primary';
      case 'DELETE': return 'danger';
      case 'PUBLISH': return 'secondary';
      default: return 'neutral';
    }
  };

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.entity_type.toLowerCase().includes(search.toLowerCase()) ||
    l.admin_email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SEO title="سجل العمليات الإدارية | IFPS CMS" />

      <div>
        <h1 className="text-2xl font-bold text-navy-900">سجل العمليات الإدارية (Audit Logs)</h1>
        <p className="text-xs text-slate-500">
          توثيق آلي لجميع عمليات الإنشاء والتعديل والحذف وتغيير الإعدادات لضمان أمن ونزاهة المحتوى
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في السجلات..."
            className="w-full pl-4 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-medical-500"
          />
        </div>
        <span className="text-xs text-slate-400">إجمالي العمليات: {filteredLogs.length}</span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" label="جارِ تحميل سجل العمليات..." />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            لا توجد سجلات مسجلة بعد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold">
                <tr>
                  <th className="py-3.5 pr-6">نوع العملية</th>
                  <th className="py-3.5 px-4">نوع العنصر</th>
                  <th className="py-3.5 px-4">معرف العنصر / التفاصيل</th>
                  <th className="py-3.5 px-4">المستخدم المسؤول</th>
                  <th className="py-3.5 pl-6 text-left">التاريخ والتوقيت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 pr-6">
                      <Badge variant={getActionBadgeVariant(log.action)} size="sm">
                        {log.action}
                      </Badge>
                    </td>

                    <td className="py-4 px-4 font-bold text-navy-900 font-mono text-[11px]">
                      {log.entity_type}
                    </td>

                    <td className="py-4 px-4 text-slate-600 max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : log.entity_id || '—'}
                    </td>

                    <td className="py-4 px-4 text-slate-700">
                      <div className="flex items-center gap-1.5 font-sans">
                        <User className="w-3.5 h-3.5 text-medical-600" />
                        <span>{log.admin_email}</span>
                      </div>
                    </td>

                    <td className="py-4 pl-6 text-left text-slate-400 font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleString('ar-IQ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
