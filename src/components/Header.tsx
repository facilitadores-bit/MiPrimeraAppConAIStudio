import React from 'react';
import { Plus, Download, Sliders, Moon, Sun, Sparkles } from 'lucide-react';
import { BrandProfile } from '../types';

interface HeaderProps {
  currentTab: 'calendario' | 'feed' | 'publicaciones' | 'plantillas' | 'marca';
  onSelectTab: (tab: 'calendario' | 'feed' | 'publicaciones' | 'plantillas' | 'marca') => void;
  brand: BrandProfile;
  onNewPost: () => void;
  onOpenExportImport: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  brand,
  onNewPost,
  onOpenExportImport,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-16">
          
          {/* Zone 1: Brand Wordmark (Single text element wordmark §2) */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => onSelectTab('calendario')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm transition-transform group-hover:scale-105"
                style={{ backgroundColor: brand.primaryColor || '#059669' }}
              >
                SH
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  SocialHarmony
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap truncate max-w-[130px] sm:max-w-[200px]">
                  {brand.name}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Single-line, unboxed, text with active state §2) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onSelectTab('calendario')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                currentTab === 'calendario'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Calendario
            </button>
            <button
              onClick={() => onSelectTab('feed')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                currentTab === 'feed'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Feed Visual 3x3
            </button>
            <button
              onClick={() => onSelectTab('publicaciones')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                currentTab === 'publicaciones'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Publicaciones
            </button>
            <button
              onClick={() => onSelectTab('plantillas')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                currentTab === 'plantillas'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Plantillas
            </button>
            <button
              onClick={() => onSelectTab('marca')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                currentTab === 'marca'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Kit de Marca
            </button>
          </nav>

          {/* Zone 3: Primary Action & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onOpenExportImport}
              title="Copia de seguridad, CSV y Ajustes"
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onNewPost}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white rounded-lg shadow-sm hover:opacity-95 active:scale-98 transition-all whitespace-nowrap shrink-0"
              style={{ backgroundColor: brand.primaryColor || '#059669' }}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Nueva Publicación</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800/80 text-xs font-medium">
          <button
            onClick={() => onSelectTab('calendario')}
            className={`px-2 py-1 rounded ${currentTab === 'calendario' ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Calendario
          </button>
          <button
            onClick={() => onSelectTab('feed')}
            className={`px-2 py-1 rounded ${currentTab === 'feed' ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Feed 3x3
          </button>
          <button
            onClick={() => onSelectTab('publicaciones')}
            className={`px-2 py-1 rounded ${currentTab === 'publicaciones' ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Posts
          </button>
          <button
            onClick={() => onSelectTab('plantillas')}
            className={`px-2 py-1 rounded ${currentTab === 'plantillas' ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Plantillas
          </button>
          <button
            onClick={() => onSelectTab('marca')}
            className={`px-2 py-1 rounded ${currentTab === 'marca' ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Kit Marca
          </button>
        </div>
      </div>
    </header>
  );
};
