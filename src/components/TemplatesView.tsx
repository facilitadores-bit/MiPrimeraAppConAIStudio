import React, { useState } from 'react';
import { BrandProfile, ContentPillar, ContentPillarId, PostTemplate } from '../types';
import { interpolateVariables } from '../utils/textParser';
import { Sparkles, Plus, Copy, Check, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface TemplatesViewProps {
  templates: PostTemplate[];
  brand: BrandProfile;
  pillars: ContentPillar[];
  onUseTemplate: (template: PostTemplate) => void;
  onSaveTemplate: (template: PostTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  templates,
  brand,
  pillars,
  onUseTemplate,
  onSaveTemplate,
  onDeleteTemplate,
}) => {
  const [selectedPillar, setSelectedPillar] = useState<ContentPillarId | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New template modal state
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPillarId, setNewPillarId] = useState<ContentPillarId>('educativo');
  const [newContent, setNewContent] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Map variables
  const varMap: Record<string, string> = {};
  brand.variables.forEach((v) => (varMap[v.key] = v.value));

  const filteredTemplates = templates.filter((tpl) => {
    if (selectedPillar !== 'all' && tpl.pillarId !== selectedPillar) return false;
    return true;
  });

  const handleCopyRaw = (tpl: PostTemplate) => {
    navigator.clipboard.writeText(tpl.contentPattern);
    setCopiedId(tpl.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tpl: PostTemplate = {
      id: `tpl-custom-${Date.now()}`,
      title: newTitle.trim(),
      pillarId: newPillarId,
      defaultPlatforms: ['instagram', 'linkedin'],
      contentPattern: newContent,
      suggestedHashtags: '{hashtags_oficiales}',
      callToActionPattern: '{cta_principal}',
      description: newDescription.trim() || 'Plantilla personalizada del equipo.',
    };

    onSaveTemplate(tpl);
    setIsCreating(false);
    setNewTitle('');
    setNewContent('');
    setNewDescription('');
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Biblioteca de Plantillas Parametrizables
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Estructuras probadas por pilar de contenido. Escribe una vez y adapta automáticamente con las variables de tu marca.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white rounded-lg shadow-sm hover:opacity-95 active:scale-98 transition-all shrink-0"
          style={{ backgroundColor: brand.primaryColor || '#059669' }}
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nueva Plantilla</span>
        </button>
      </div>

      {/* Pillar filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        <button
          onClick={() => setSelectedPillar('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
            selectedPillar === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
          }`}
        >
          Todos ({templates.length})
        </button>
        {pillars.map((pillar) => {
          const count = templates.filter((t) => t.pillarId === pillar.id).length;
          return (
            <button
              key={pillar.id}
              onClick={() => setSelectedPillar(pillar.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedPillar === pillar.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: pillar.color }}
              />
              <span>{pillar.nombre}</span>
              <span className="text-[10px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((tpl) => {
          const pillar = pillars.find((p) => p.id === tpl.pillarId) || pillars[0];
          const resolvedSample = interpolateVariables(tpl.contentPattern, varMap, false);
          const isCopied = copiedId === tpl.id;

          return (
            <div
              key={tpl.id}
              className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Header of card */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: pillar.color }}
                    />
                    <span className="text-slate-800 dark:text-slate-200">{pillar.nombre}</span>
                  </div>

                  <button
                    onClick={() => handleCopyRaw(tpl)}
                    title="Copiar texto de la plantilla"
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {tpl.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  {tpl.description}
                </p>

                {/* Live Preview Box */}
                <div className="p-3 rounded-lg bg-slate-50/80 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto font-sans">
                  {resolvedSample}
                </div>
              </div>

              {/* Action footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Variables: {tpl.contentPattern.match(/\{([a-zA-Z0-9_-]+)\}/g)?.length || 0}
                </span>

                <button
                  onClick={() => onUseTemplate(tpl)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg shadow-2xs hover:opacity-95 transition-opacity"
                  style={{ backgroundColor: brand.primaryColor || '#059669' }}
                >
                  <span>Usar en Publicación</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Template Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Crear Nueva Plantilla Parametrizable
            </h2>

            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Título de la Plantilla
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: 5 Herramientas que me ahorran 10 horas semanales"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Pilar de Contenido
                </label>
                <select
                  value={newPillarId}
                  onChange={(e) => setNewPillarId(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  {pillars.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Descripción o Propósito
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Ej: Ideal para generar autoridad y guardados en Instagram."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Estructura con Parámetros (usa marcadores como {`{marca}`}, {`{cta_principal}`}, etc.)
                </label>
                <textarea
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder={`Gancho inicial con {propuesta_valor}...

1. Punto uno
2. Punto dos

En {marca} te ayudamos a lograrlo.

👉 {cta_principal}
{hashtags_oficiales}`}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg shadow-sm"
                >
                  Guardar Plantilla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
