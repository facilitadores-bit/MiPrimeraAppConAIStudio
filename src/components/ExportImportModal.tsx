import React, { useRef, useState } from 'react';
import { BrandProfile, ContentPillar, PostTemplate, SocialPost } from '../types';
import { exportFullWorkspace, exportPostsToCSV } from '../utils/storage';
import { BRAND_PRESETS, DEFAULT_POSTS, DEFAULT_TEMPLATES } from '../data/initialData';
import { 
  X, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  Check, 
  RefreshCw, 
  Globe, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandProfile;
  posts: SocialPost[];
  templates: PostTemplate[];
  pillars: ContentPillar[];
  onImportWorkspace: (data: {
    brand?: BrandProfile;
    posts?: SocialPost[];
    templates?: PostTemplate[];
    pillars?: ContentPillar[];
  }) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  brand,
  posts,
  templates,
  pillars,
  onImportWorkspace,
}) => {
  if (!isOpen) return null;

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    exportFullWorkspace(brand, posts, templates, pillars);
  };

  const handleExportCSV = () => {
    exportPostsToCSV(posts, brand);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.brand || parsed.posts) {
          onImportWorkspace(parsed);
          setImportStatus('¡Datos importados con éxito!');
          setTimeout(() => {
            setImportStatus(null);
            onClose();
          }, 1500);
        } else {
          alert('El archivo no tiene el formato de respaldo de SocialHarmony válido.');
        }
      } catch (err) {
        console.error(err);
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDemo = (presetId: string) => {
    const selected = BRAND_PRESETS.find((p) => p.id === presetId);
    if (!selected) return;

    if (window.confirm(`¿Deseas restablecer el espacio con los datos de ejemplo de "${selected.name}"?`)) {
      onImportWorkspace({
        brand: selected.brand,
        posts: DEFAULT_POSTS,
        templates: DEFAULT_TEMPLATES,
      });
      setImportStatus('¡Datos de demostración cargados!');
      setTimeout(() => {
        setImportStatus(null);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Respaldo & Compatibilidad GitHub Pages
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {importStatus && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            {importStatus}
          </div>
        )}

        {/* Info card */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% Client-Side & Sin APIs Externas
          </div>
          Toda la información se guarda de forma segura y privada en el almacenamiento local de tu navegador (<code className="font-mono text-emerald-600">localStorage</code>). Puedes exportar copias de seguridad para transferir entre dispositivos o sincronizar con tu equipo.
        </div>

        {/* Export options */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Exportar Datos
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleExportJSON}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left flex items-start gap-3 shadow-2xs"
            >
              <Download className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-900 dark:text-white">
                  Copia de Seguridad JSON
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Marca, parámetros, publicaciones y plantillas.
                </span>
              </div>
            </button>

            <button
              onClick={handleExportCSV}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left flex items-start gap-3 shadow-2xs"
            >
              <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-900 dark:text-white">
                  Calendario en CSV
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Para abrir en Microsoft Excel o Google Sheets.
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Import section */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Importar Respaldo
          </h3>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Seleccionar archivo .JSON para restaurar</span>
          </button>
        </div>

        {/* Load Preset demos */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Cargar Ejemplos Preconfigurados
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {BRAND_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleResetToDemo(p.id)}
                className="p-2 text-xs text-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
              >
                {p.name.split('/')[0]}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
