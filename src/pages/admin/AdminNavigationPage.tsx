import React, { useState, useEffect } from 'react';
import { Menu, ArrowUp, ArrowDown, Plus, Trash2, Check, X, Save } from 'lucide-react';
import { getNavigationItems, saveNavigationItems } from '../../lib/db';
import { NavigationItem } from '../../types';
import { SEO } from '../../components/common/SEO';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminNavigationPage: React.FC = () => {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    async function loadNav() {
      try {
        const data = await getNavigationItems();
        setItems(data.sort((a, b) => a.sort_order - b.sort_order));
      } catch (e) {
        console.error('Error loading navigation:', e);
      } finally {
        setLoading(false);
      }
    }
    loadNav();
  }, []);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Re-assign sort_order
    newItems.forEach((item, idx) => {
      item.sort_order = idx + 1;
    });

    setItems(newItems);
  };

  const toggleActive = (id: string) => {
    setItems(items.map(it => it.id === id ? { ...it, is_active: !it.is_active } : it));
  };

  const handleSave = async () => {
    try {
      await saveNavigationItems(items);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2500);
    } catch (e) {
      console.error('Error saving navigation:', e);
    }
  };

  const handleAddItem = () => {
    const newItem: NavigationItem = {
      id: `nav-${Date.now()}`,
      label_ar: 'عنصر جديد',
      label_en: 'New Link',
      path: '/new-page',
      is_external: false,
      sort_order: items.length + 1,
      is_active: true,
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(it => it.id !== id));
  };

  return (
    <div className="space-y-6">
      <SEO title="إدارة عناصر القائمة والتنقل | IFPS CMS" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">إدارة القائمة والتنقل الرئيسي</h1>
          <p className="text-xs text-slate-500">إعادة ترتيب، تعديل تسميات، أو إخفاء عناصر القائمة العلوية</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة رابط</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95"
            title="تطبيق الترتيب فوراً على قائمة الموقع الرئيسية"
          >
            <Save className="w-4 h-4" />
            <span>تطبيق التعديلات على الموقع</span>
          </button>
        </div>
      </div>

      {savedMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>تم تطبيق تعديلات القائمة على الموقع بنجاح!</span>
        </div>
      )}

      {loading ? (
        <LoadingSpinner size="lg" label="جارِ تحميل القائمة..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-4 sm:p-6 space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <button
                    disabled={index === 0}
                    onClick={() => moveItem(index, 'up')}
                    className="p-1 rounded text-slate-400 hover:text-navy-900 disabled:opacity-20"
                    title="تحريك لأعلى"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(index, 'down')}
                    className="p-1 rounded text-slate-400 hover:text-navy-900 disabled:opacity-20"
                    title="تحريك لأسفل"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={item.label_ar}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[index].label_ar = e.target.value;
                      setItems(updated);
                    }}
                    className="text-xs font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg w-36"
                  />
                  <input
                    type="text"
                    value={item.path}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[index].path = e.target.value;
                      setItems(updated);
                    }}
                    className="text-xs font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-lg w-40 text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleActive(item.id)}
                  className={`text-xs px-3 py-1 rounded-full font-bold transition-colors ${
                    item.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {item.is_active ? 'مفعل' : 'معطل'}
                </button>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
