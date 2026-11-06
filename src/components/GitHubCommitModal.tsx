import React, { useState } from 'react';
import { BrandProfile, PostTemplate, SocialPost } from '../types';
import { 
  GitHubConfig, 
  commitFullWorkspaceToGitHub, 
  getStoredGitHubConfig, 
  loadDataFromRepository, 
  saveGitHubConfig 
} from '../utils/githubSync';
import { 
  GitCommit, 
  GitBranch, 
  Key, 
  X, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle, 
  FileCode, 
  ShieldCheck,
  Download
} from 'lucide-react';

interface GitHubCommitModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandProfile;
  posts: SocialPost[];
  templates: PostTemplate[];
  onDataLoadedFromGit: (data: {
    brand?: BrandProfile;
    posts?: SocialPost[];
    templates?: PostTemplate[];
  }) => void;
}

export const GitHubCommitModal: React.FC<GitHubCommitModalProps> = ({
  isOpen,
  onClose,
  brand,
  posts,
  templates,
  onDataLoadedFromGit,
}) => {
  if (!isOpen) return null;

  const [config, setConfig] = useState<GitHubConfig>(() => getStoredGitHubConfig());
  const [commitMessage, setCommitMessage] = useState('chore: actualizar datos y plantillas de SocialHarmony');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfigChange = (field: keyof GitHubConfig, val: string) => {
    const updated = { ...config, [field]: val };
    setConfig(updated);
    saveGitHubConfig(updated);
  };

  const handleCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.token.trim()) {
      setErrorMessage('Por favor ingresa tu Token de Acceso Personal de GitHub (PAT) para poder hacer commits.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage('Enviando commit a GitHub...');

    try {
      const res = await commitFullWorkspaceToGitHub(
        config,
        brand,
        posts,
        templates,
        commitMessage.trim() || 'chore: actualizar datos de SocialHarmony'
      );

      setIsLoading(false);
      setIsSuccess(true);
      setStatusMessage('¡Commit realizado con éxito en GitHub! Los archivos data/*.json han sido actualizados en la rama ' + config.branch);
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (err: any) {
      setIsLoading(false);
      setIsSuccess(false);
      setErrorMessage(err.message || 'Error al conectar con la API de GitHub.');
    }
  };

  const handlePullFromGitHub = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage('Consultando últimos cambios en GitHub...');

    try {
      const data = await loadDataFromRepository(config);
      onDataLoadedFromGit(data);
      setIsLoading(false);
      setIsSuccess(true);
      setStatusMessage('Datos cargados desde GitHub con éxito.');
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'No se pudieron descargar los datos desde GitHub.');
    }
  };

  // Download files manually as alternative
  const handleDownloadJSONFiles = () => {
    const download = (filename: string, content: string) => {
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    download('brand.json', JSON.stringify(brand, null, 2));
    download('templates.json', JSON.stringify(templates, null, 2));
    download('posts.json', JSON.stringify(posts, null, 2));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold">
              <GitCommit className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Sincronizar & Commit a Git
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Guarda tus plantillas y publicaciones directamente en archivos JSON dentro de tu repositorio en GitHub.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alerts */}
        {isSuccess && statusMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 rounded-xl border border-rose-200 dark:border-rose-800 text-xs font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Files targeted for commit summary */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span>Archivos JSON que se actualizarán en Git:</span>
            <span className="text-[11px] font-mono text-slate-500">Rama: {config.branch}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-600 dark:text-slate-300">
            <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-emerald-600" />
              <span>data/templates.json</span>
            </div>
            <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-blue-600" />
              <span>data/posts.json</span>
            </div>
            <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-purple-600" />
              <span>data/brand.json</span>
            </div>
          </div>
        </div>

        {/* GitHub configuration form */}
        <form onSubmit={handleCommit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Usuario / Organización
              </label>
              <input
                type="text"
                value={config.owner}
                onChange={(e) => handleConfigChange('owner', e.target.value)}
                placeholder="facilitadores-bit"
                className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Nombre del Repositorio
              </label>
              <input
                type="text"
                value={config.repo}
                onChange={(e) => handleConfigChange('repo', e.target.value)}
                placeholder="MiPrimeraAppConAIStudio"
                className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Rama (Branch)
              </label>
              <div className="relative flex items-center">
                <GitBranch className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
                <input
                  type="text"
                  value={config.branch}
                  onChange={(e) => handleConfigChange('branch', e.target.value)}
                  placeholder="main"
                  className="w-full text-xs font-mono pl-8 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  GitHub Personal Access Token (PAT)
                </label>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo&description=SocialHarmony_Sync"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Crear Token en GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative flex items-center">
                <Key className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
                <input
                  type="password"
                  value={config.token}
                  onChange={(e) => handleConfigChange('token', e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full text-xs font-mono pl-8 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">
                Se almacena únicamente en tu navegador para realizar los commits a través de la API oficial de GitHub.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
              Mensaje del Commit
            </label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="chore: actualizar datos y plantillas"
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              required
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handlePullFromGitHub}
              disabled={isLoading}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Traer Últimos Datos de Git</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadJSONFiles}
                title="Descargar archivos .json individuales para agregarlos manualmente"
                className="p-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <GitCommit className="w-4 h-4" />
                <span>{isLoading ? 'Haciendo Commit...' : 'Hacer Commit a Git'}</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
