import React, { useState, useRef } from 'react';
import { 
  BrandProfile, 
  ContentPillar, 
  PostStatus, 
  PostTemplate, 
  SocialPlatform, 
  SocialPost 
} from '../types';
import { auditPostCoherence, interpolateVariables, PLATFORM_SPECS } from '../utils/textParser';
import { PlatformPreview } from './PlatformPreview';
import { 
  X, 
  Check, 
  Sparkles, 
  Image as ImageIcon, 
  AlertTriangle, 
  Eye, 
  Edit3, 
  Upload, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';

interface PostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: SocialPost | null; // null if creating a new post
  onSave: (post: SocialPost) => void;
  brand: BrandProfile;
  pillars: ContentPillar[];
  templates: PostTemplate[];
  initialDate?: string;
}

const SAMPLE_IMAGES = [
  { label: 'Bienestar / Fruta', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pack / Snack', url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80' },
  { label: 'Oficina / Trabajo', url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Taller / Cocina', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Minimalista', url: 'https://images.unsplash.com/photo-1505253758473-96b3d5fe926c?auto=format&fit=crop&w=800&q=80' },
];

export const PostEditorModal: React.FC<PostEditorModalProps> = ({
  isOpen,
  onClose,
  post,
  onSave,
  brand,
  pillars,
  templates,
  initialDate,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(post?.title || '');
  const [rawContent, setRawContent] = useState(post?.rawContent || '');
  const [pillarId, setPillarId] = useState(post?.pillarId || 'educativo');
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(
    post?.platforms && post.platforms.length > 0 ? post.platforms : ['instagram', 'linkedin']
  );
  const [status, setStatus] = useState<PostStatus>(post?.status || 'borrador');
  const [scheduledDate, setScheduledDate] = useState(
    post?.scheduledDate || initialDate || new Date().toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState(post?.scheduledTime || '11:00');
  const [imageUrl, setImageUrl] = useState(post?.imageUrl || '');
  const [notes, setNotes] = useState(post?.notes || '');
  
  const [activeTab, setActiveTab] = useState<'editor' | 'coherencia'>('editor');
  const [previewMode, setPreviewMode] = useState(false); // toggle edit with variables vs preview substituted
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Map of variables
  const varMap: Record<string, string> = {};
  brand.variables.forEach((v) => (varMap[v.key] = v.value));

  // Primary platform for auditing
  const primaryPlatform = platforms[0] || 'instagram';
  const auditResult = auditPostCoherence(rawContent, brand, primaryPlatform);
  const spec = PLATFORM_SPECS[primaryPlatform] || PLATFORM_SPECS.instagram;
  const currentChars = interpolateVariables(rawContent, varMap).length;

  const handlePlatformToggle = (p: SocialPlatform) => {
    if (platforms.includes(p)) {
      if (platforms.length === 1) return; // keep at least one
      setPlatforms(platforms.filter((item) => item !== p));
    } else {
      setPlatforms([...platforms, p]);
    }
  };

  const insertVariable = (key: string) => {
    const token = `{${key}}`;
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = rawContent;
      const newText = text.substring(0, start) + token + text.substring(end);
      setRawContent(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + token.length, start + token.length);
      }, 0);
    } else {
      setRawContent((prev) => prev + token);
    }
  };

  const handleApplyTemplate = (templateId: string) => {
    const tpl = templates.find((t) => t.id === templateId);
    if (!tpl) return;
    if (rawContent.trim() && !window.confirm('¿Deseas reemplazar el texto actual con la plantilla seleccionada?')) {
      return;
    }
    setRawContent(tpl.contentPattern);
    setPillarId(tpl.pillarId);
    if (tpl.defaultPlatforms && tpl.defaultPlatforms.length > 0) {
      setPlatforms(tpl.defaultPlatforms);
    }
    if (!title) {
      setTitle(tpl.title);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor añade un título a la publicación.');
      return;
    }

    const updatedPost: SocialPost = {
      id: post?.id || `post-${Date.now()}`,
      title: title.trim(),
      rawContent,
      platforms,
      pillarId,
      status,
      scheduledDate,
      scheduledTime,
      imageUrl: imageUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: post?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedPost);
  };

  const currentPillar = pillars.find((p) => p.id === pillarId) || pillars[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-850/50">
          <div className="flex items-center gap-3">
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0"
              style={{ backgroundColor: currentPillar.color }}
              title={`Pilar: ${currentPillar.nombre}`}
            />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {post ? 'Editar Publicación' : 'Crear Nueva Publicación'}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Pilar activo: {currentPillar.nombre}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Coherencia: {auditResult.score}%</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content - 2 Columns */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Form & Editor (7 cols) */}
          <div className="lg:col-span-7 p-6 overflow-y-auto space-y-5 border-r border-slate-200 dark:border-slate-800">
            
            {/* Title & Quick Template */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Título o Idea Central
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: 3 Hábitos para no quedarte sin energía a las 4 PM"
                  className="w-full text-sm font-semibold px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  required
                />
              </div>

              {/* Template selector */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Cargar Plantilla con Parámetros:
                </span>
                <select
                  onChange={(e) => handleApplyTemplate(e.target.value)}
                  defaultValue=""
                  className="text-xs px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="" disabled>Selecciona una plantilla...</option>
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pillar & Status & Dates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Pilar de Contenido
                </label>
                <select
                  value={pillarId}
                  onChange={(e) => setPillarId(e.target.value as any)}
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
                  Estado
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PostStatus)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="idea">💡 Idea</option>
                  <option value="borrador">📝 Borrador</option>
                  <option value="revisado">🔍 Revisado / Listo</option>
                  <option value="programado">⏰ Programado</option>
                  <option value="publicado">✅ Publicado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Fecha Programada
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Hora Sugerida
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Target Social Platforms */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                Redes Sociales Destino
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {(['instagram', 'linkedin', 'twitter', 'tiktok', 'facebook', 'threads'] as SocialPlatform[]).map((p) => {
                  const isSelected = platforms.includes(p);
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => handlePlatformToggle(p)}
                      className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
                        isSelected
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {p === 'twitter' ? 'X (Twitter)' : p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Parameter Pills Toolbar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Insertar Variable de Marca en el cursor:
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  {previewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{previewMode ? 'Volver a Editar Variables' : 'Ver Texto Resuelto'}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 max-h-24 overflow-y-auto">
                {brand.variables.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => insertVariable(v.key)}
                    title={`Valor actual: "${v.value}"`}
                    className="px-2 py-0.5 text-[11px] font-mono bg-white dark:bg-slate-750 text-slate-700 dark:text-slate-200 rounded border border-slate-200 dark:border-slate-650 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 hover:text-emerald-700 transition-colors shadow-2xs"
                  >
                    +{`{${v.key}}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Editor Box */}
            <div>
              <div className="relative">
                {previewMode ? (
                  <div className="w-full min-h-[220px] p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white text-xs leading-relaxed whitespace-pre-line font-sans">
                    {interpolateVariables(rawContent, varMap, true)}
                  </div>
                ) : (
                  <textarea
                    ref={textareaRef}
                    rows={8}
                    value={rawContent}
                    onChange={(e) => setRawContent(e.target.value)}
                    placeholder="Escribe el texto aquí. Puedes usar variables como {marca}, {cta_principal}, etc..."
                    className="w-full text-xs font-sans leading-relaxed p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                )}
              </div>

              {/* Character Limit and Metrics Bar */}
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <span>
                    Caracteres ({spec.name}):{' '}
                    <strong className={currentChars > spec.maxChars ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                      {currentChars} / {spec.maxChars}
                    </strong>
                  </span>
                  <span>·</span>
                  <span>Líneas: {rawContent.split('\n').length}</span>
                </div>

                {auditResult.missingVariables.length > 0 && (
                  <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="w-3 h-3" />
                    {auditResult.missingVariables.length} variable(s) sin valor
                  </span>
                )}
              </div>
            </div>

            {/* Media Attachment */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                Imagen o Portada Visual
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL de imagen (https://...)"
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Foto Local</span>
                </button>
              </div>

              {/* Sample image quick pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                <span className="text-[11px] text-slate-400 shrink-0">Ejemplos:</span>
                {SAMPLE_IMAGES.map((img) => (
                  <button
                    key={img.label}
                    type="button"
                    onClick={() => setImageUrl(img.url)}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white whitespace-nowrap"
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Coherence Audit checklist accordion */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Auditoría de Coherencia de Marca</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">{auditResult.score}% Cumplimiento</span>
              </span>

              <div className="space-y-1.5 pt-1">
                {auditResult.checks.map((chk) => (
                  <div key={chk.id} className="text-xs flex items-start gap-2">
                    {chk.passed ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className={`font-medium ${chk.passed ? 'text-slate-700 dark:text-slate-300' : 'text-amber-700 dark:text-amber-400'}`}>
                        {chk.label}:
                      </span>{' '}
                      <span className="text-slate-500 dark:text-slate-400">{chk.recommendation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Live Mockup Preview (5 cols) */}
          <div className="lg:col-span-5 p-4 sm:p-6 bg-slate-100/60 dark:bg-slate-950/60 flex flex-col justify-between overflow-hidden">
            <div className="mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Simulación Multired en Vivo
              </span>
            </div>

            <div className="flex-1 overflow-y-auto">
              <PlatformPreview
                post={{
                  title,
                  rawContent,
                  imageUrl,
                  platforms,
                  pillarId,
                  status,
                  scheduledDate,
                  scheduledTime,
                }}
                brand={brand}
                initialPlatform={primaryPlatform}
              />
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-white rounded-lg shadow-sm hover:opacity-95 active:scale-98 transition-all"
            style={{ backgroundColor: brand.primaryColor || '#059669' }}
          >
            {post ? 'Guardar Cambios' : 'Crear Publicación'}
          </button>
        </div>

      </div>
    </div>
  );
};
