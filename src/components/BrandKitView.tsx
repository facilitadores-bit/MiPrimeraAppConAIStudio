import React, { useState } from 'react';
import { BrandProfile, BrandVariable } from '../types';
import { BRAND_PRESETS } from '../data/initialData';
import { Plus, Trash2, Check, Sparkles, BookOpen, ShieldAlert, Palette, HelpCircle } from 'lucide-react';

interface BrandKitViewProps {
  brand: BrandProfile;
  onUpdateBrand: (updated: BrandProfile) => void;
}

export const BrandKitView: React.FC<BrandKitViewProps> = ({ brand, onUpdateBrand }) => {
  const [formData, setFormData] = useState<BrandProfile>({ ...brand });
  const [newVarKey, setNewVarKey] = useState('');
  const [newVarLabel, setNewVarLabel] = useState('');
  const [newVarValue, setNewVarValue] = useState('');
  const [newBannedWord, setNewBannedWord] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFieldChange = (field: keyof BrandProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRuleChange = (ruleField: keyof BrandProfile['rules'], value: any) => {
    setFormData((prev) => ({
      ...prev,
      rules: { ...prev.rules, [ruleField]: value },
    }));
  };

  const handleVariableValueChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      variables: prev.variables.map((v) => (v.key === key ? { ...v, value } : v)),
    }));
  };

  const handleAddCustomVariable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVarKey.trim() || !newVarValue.trim()) return;

    // sanitize key: only lowercase letters, numbers, and underscores
    const cleanKey = newVarKey.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    if (formData.variables.some((v) => v.key === cleanKey)) {
      alert(`La variable {${cleanKey}} ya existe.`);
      return;
    }

    const newVar: BrandVariable = {
      key: cleanKey,
      label: newVarLabel.trim() || cleanKey,
      value: newVarValue.trim(),
      isCustom: true,
    };

    setFormData((prev) => ({
      ...prev,
      variables: [...prev.variables, newVar],
    }));

    setNewVarKey('');
    setNewVarLabel('');
    setNewVarValue('');
  };

  const handleDeleteVariable = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      variables: prev.variables.filter((v) => v.key !== key),
    }));
  };

  const handleAddBannedWord = (e: React.FormEvent) => {
    e.preventDefault();
    const word = newBannedWord.trim().toLowerCase();
    if (!word) return;
    if (formData.rules.bannedWords.includes(word)) return;

    handleRuleChange('bannedWords', [...formData.rules.bannedWords, word]);
    setNewBannedWord('');
  };

  const handleRemoveBannedWord = (wordToRemove: string) => {
    handleRuleChange(
      'bannedWords',
      formData.rules.bannedWords.filter((w) => w !== wordToRemove)
    );
  };

  const handleLoadPreset = (presetId: string) => {
    const selected = BRAND_PRESETS.find((p) => p.id === presetId);
    if (selected) {
      if (window.confirm(`¿Deseas cargar la plantilla de marca para "${selected.name}"? Se actualizarán las variables y reglas.`)) {
        setFormData({ ...selected.brand });
        onUpdateBrand(selected.brand);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    }
  };

  const handleSave = () => {
    onUpdateBrand(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Kit de Marca & Parámetros Globales
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Define los valores y reglas de estilo para que todas tus publicaciones mantengan coherencia y la misma voz.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              <Check className="w-3.5 h-3.5" />
              Guardado con éxito
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-sm hover:opacity-95 active:scale-98 transition-all"
            style={{ backgroundColor: formData.primaryColor || '#059669' }}
          >
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Preset selector bar */}
      <div className="mt-6 p-4 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Cargar plantilla de demostración preconfigurada:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {BRAND_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleLoadPreset(p.id)}
              className="px-2.5 py-1 text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-xs"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Left column: Visual identity & Editorial Rules */}
        <div className="space-y-6">
          
          {/* Identity card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Palette className="w-4 h-4 text-slate-500" />
              Identidad Visual
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Nombre Comercial
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Slogan o Bajada
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleFieldChange('tagline', e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Usuario o Handle (@)
                </label>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) => handleFieldChange('handle', e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  URL de Foto de Perfil / Logo
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={formData.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=100&q=80'}
                    alt="Avatar"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <input
                    type="text"
                    value={formData.avatarUrl}
                    onChange={(e) => handleFieldChange('avatarUrl', e.target.value)}
                    placeholder="https://..."
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Color Primario
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor || '#059669'}
                      onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                      className="w-8 h-8 rounded border-0 p-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                      className="w-full text-xs font-mono px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Color Secundario
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.secondaryColor || '#d97706'}
                      onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                      className="w-8 h-8 rounded border-0 p-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                      className="w-full text-xs font-mono px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Rules */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-slate-500" />
              Reglas de Coherencia Editorial
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Tratamiento Gramatical (Voz)
                </label>
                <select
                  value={formData.rules.grammaticalPerson}
                  onChange={(e) => handleRuleChange('grammaticalPerson', e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="tu">Tuteo ("Descubre", "Tu vida", "Mira esto")</option>
                  <option value="vos">Voseo ("Descubrí", "Tu vida", "Mirá esto")</option>
                  <option value="usted">Usted formal ("Descubra", "Su bienestar")</option>
                  <option value="nosotros">Nosotros / Colectivo ("Descubrimos", "Nuestra visión")</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Máximo de Emojis por Post
                  </label>
                  <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
                    {formData.rules.maxEmojisPerPost}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={formData.rules.maxEmojisPerPost}
                  onChange={(e) => handleRuleChange('maxEmojisPerPost', Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {formData.rules.maxEmojisPerPost <= 2 ? 'Estilo sobrio / B2B' : formData.rules.maxEmojisPerPost <= 4 ? 'Equilibrado / Dinámico' : 'Informal / Festivo'}
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rules.requireCTA}
                    onChange={(e) => handleRuleChange('requireCTA', e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 border-slate-300 dark:border-slate-700 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Exigir Llamada a la Acción (CTA) en cada post
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rules.requireHook}
                    onChange={(e) => handleRuleChange('requireHook', e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 border-slate-300 dark:border-slate-700 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Exigir Gancho / Hook en primera línea
                  </span>
                </label>
              </div>

              {/* Banned words */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  Palabras Desaconsejadas / Prohibidas
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {formData.rules.bannedWords.map((word) => (
                    <span
                      key={word}
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60"
                    >
                      {word}
                      <button
                        type="button"
                        onClick={() => handleRemoveBannedWord(word)}
                        className="hover:text-rose-900 dark:hover:text-rose-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddBannedWord} className="flex gap-2">
                  <input
                    type="text"
                    value={newBannedWord}
                    onChange={(e) => setNewBannedWord(e.target.value)}
                    placeholder="Ej: milagroso, baratísimo..."
                    className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
                  >
                    Agregar
                  </button>
                </form>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Notas de Estilo Adicionales
                </label>
                <textarea
                  rows={2}
                  value={formData.rules.notes}
                  onChange={(e) => handleRuleChange('notes', e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

            </div>
          </div>

        </div>

        {/* Right 2 columns: Dynamic variables / parameters */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Variables & Parámetros de Texto
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Usa estos marcadores como <code className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{`{marca}`}</code> o <code className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{`{cta_principal}`}</code> en tus textos y plantillas. Se reemplazarán automáticamente.
                </p>
              </div>
            </div>

            {/* Variables list table */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-2">
              {formData.variables.map((variable) => (
                <div key={variable.key} className="py-3.5 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="sm:w-1/3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {`{${variable.key}}`}
                      </span>
                      {variable.isCustom && (
                        <button
                          type="button"
                          onClick={() => handleDeleteVariable(variable.key)}
                          title="Eliminar variable personalizada"
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <span className="block text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">
                      {variable.label}
                    </span>
                  </div>

                  <div className="flex-1">
                    {variable.value.length > 60 || variable.key.includes('hashtags') || variable.key.includes('cta') ? (
                      <textarea
                        rows={2}
                        value={variable.value}
                        onChange={(e) => handleVariableValueChange(variable.key, e.target.value)}
                        placeholder={`Valor para {${variable.key}}...`}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                      />
                    ) : (
                      <input
                        type="text"
                        value={variable.value}
                        onChange={(e) => handleVariableValueChange(variable.key, e.target.value)}
                        placeholder={`Valor para {${variable.key}}...`}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add custom variable form */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-3">
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                Crear Nueva Variable Personalizada
              </h3>

              <form onSubmit={handleAddCustomVariable} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Identificador (sin espacios)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-xs text-slate-400 font-mono">{`{`}</span>
                    <input
                      type="text"
                      value={newVarKey}
                      onChange={(e) => setNewVarKey(e.target.value)}
                      placeholder="mi_variable"
                      className="w-full text-xs font-mono pl-5 pr-5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                    />
                    <span className="absolute right-2.5 text-xs text-slate-400 font-mono">{`}`}</span>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Etiqueta
                  </label>
                  <input
                    type="text"
                    value={newVarLabel}
                    onChange={(e) => setNewVarLabel(e.target.value)}
                    placeholder="Ej: Descuento Flash"
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Valor
                  </label>
                  <input
                    type="text"
                    value={newVarValue}
                    onChange={(e) => setNewVarValue(e.target.value)}
                    placeholder="Ej: 20% OFF solo hoy"
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-1">
                  <button
                    type="submit"
                    disabled={!newVarKey.trim() || !newVarValue.trim()}
                    className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Educational tip box */}
          <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 text-sky-900 dark:text-sky-200 text-xs leading-relaxed flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">¿Cómo garantiza esto la coherencia de estilo?</p>
              <p className="text-sky-800/90 dark:text-sky-300">
                Al centralizar la llamada a la acción, el enlace de la bio, el tono y los hashtags oficiales, cualquier miembro del equipo que redacte una publicación o utilice una plantilla se asegura de no usar enlaces viejos, cupones caducados o un tono desconectado de la identidad de marca.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
