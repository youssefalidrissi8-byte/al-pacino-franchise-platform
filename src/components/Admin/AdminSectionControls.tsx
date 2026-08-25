import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SectionConfig } from '../../types';
import { Eye, EyeOff, Save, ArrowUp, ArrowDown } from 'lucide-react';

export const AdminSectionControls: React.FC = () => {
  const { lang, sections, updateSectionsRemote, showToast } = useApp();

  const [sectionsList, setSectionsList] = useState<SectionConfig[]>(
    JSON.parse(JSON.stringify(sections || []))
  );
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    setSectionsList(JSON.parse(JSON.stringify(sections || [])));
  }, [sections]);

  const handleToggle = (id: string) => {
    setSectionsList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...sectionsList];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    // update order numbers
    updated.forEach((s, idx) => {
      s.order = idx + 1;
    });
    setSectionsList(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === sectionsList.length - 1) return;
    const updated = [...sectionsList];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    // update order numbers
    updated.forEach((s, idx) => {
      s.order = idx + 1;
    });
    setSectionsList(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateSectionsRemote(sectionsList);
    setIsSaving(false);
    if (success) {
      showToast(lang === 'ar' ? 'تم حفظ ترتيب وإعدادات ظهور الأقسام' : 'Section ordering saved', 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">
            {lang === 'ar' ? 'التحكم بالأقسام والترتيب (Section Controls)' : 'Section Visibility & Ordering'}
          </h2>
          <p className="text-sm text-gray-400">
            {lang === 'ar'
              ? 'إظهار وإخفاء أي قسم من الصفحة الرئيسية وإعادة ترتيب الأقسام.'
              : 'Toggle visibility and re-order landing page sections.'}
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl font-black text-sm text-black bg-gradient-to-r from-[#D4AF37] to-[#E5BE48] hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? (lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ إعدادات الأقسام' : 'Save Sections')}</span>
        </button>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {sectionsList.map((sec, index) => (
          <div
            key={sec.id}
            className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
              sec.visible
                ? 'bg-[#161222] border-[#2B2338]'
                : 'bg-[#100D18] border-[#1E172B] opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#241E30] flex items-center justify-center text-xs font-mono font-bold text-gray-400">
                {index + 1}
              </span>
              <div>
                <h4 className="font-bold text-white text-sm">
                  {lang === 'ar' ? sec.name : (sec.nameEn || sec.name)}
                </h4>
                <span className="text-[11px] text-gray-400 font-mono">#{sec.id}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Move Up */}
              <button
                type="button"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                className="p-2 rounded-xl bg-[#231B34] hover:bg-[#32264C] text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title={lang === 'ar' ? 'تحريك للأعلى' : 'Move up'}
              >
                <ArrowUp className="w-4 h-4" />
              </button>

              {/* Move Down */}
              <button
                type="button"
                onClick={() => handleMoveDown(index)}
                disabled={index === sectionsList.length - 1}
                className="p-2 rounded-xl bg-[#231B34] hover:bg-[#32264C] text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title={lang === 'ar' ? 'تحريك للأسفل' : 'Move down'}
              >
                <ArrowDown className="w-4 h-4" />
              </button>

              {/* Toggle Enable/Disable */}
              <button
                type="button"
                onClick={() => handleToggle(sec.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  sec.visible
                    ? 'bg-green-950/80 text-green-400 border border-green-500/30'
                    : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}
              >
                {sec.visible ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'ظاهر' : 'Enabled'}</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'مخفي' : 'Hidden'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
