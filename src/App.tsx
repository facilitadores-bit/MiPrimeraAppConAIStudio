import React, { useState, useEffect } from 'react';
import { BrandProfile, ContentPillar, PostStatus, PostTemplate, SocialPost } from './types';
import { 
  loadBrandProfile, 
  loadPillars, 
  loadPosts, 
  loadTemplates, 
  saveBrandProfile, 
  savePillars, 
  savePosts, 
  saveTemplates 
} from './utils/storage';
import { Header } from './components/Header';
import { CalendarView } from './components/CalendarView';
import { InstagramFeedGrid } from './components/InstagramFeedGrid';
import { PostsListView } from './components/PostsListView';
import { TemplatesView } from './components/TemplatesView';
import { BrandKitView } from './components/BrandKitView';
import { PostEditorModal } from './components/PostEditorModal';
import { ExportImportModal } from './components/ExportImportModal';

export default function App() {
  const [brand, setBrand] = useState<BrandProfile>(() => loadBrandProfile());
  const [posts, setPosts] = useState<SocialPost[]>(() => loadPosts());
  const [templates, setTemplates] = useState<PostTemplate[]>(() => loadTemplates());
  const [pillars, setPillars] = useState<ContentPillar[]>(() => loadPillars());

  const [currentTab, setCurrentTab] = useState<'calendario' | 'feed' | 'publicaciones' | 'plantillas' | 'marca'>('calendario');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('socialharmony_theme') === 'dark';
  });

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [editorInitialDate, setEditorInitialDate] = useState<string | undefined>(undefined);

  // Backup / Export Modal State
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Sync dark mode class with <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('socialharmony_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('socialharmony_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist brand
  const handleUpdateBrand = (updatedBrand: BrandProfile) => {
    setBrand(updatedBrand);
    saveBrandProfile(updatedBrand);
    showToast('Kit de Marca guardado');
  };

  // Persist posts
  const handleSavePost = (savedPost: SocialPost) => {
    const existingIndex = posts.findIndex((p) => p.id === savedPost.id);
    let updated: SocialPost[];
    if (existingIndex >= 0) {
      updated = [...posts];
      updated[existingIndex] = savedPost;
    } else {
      updated = [savedPost, ...posts];
    }
    setPosts(updated);
    savePosts(updated);
    setIsEditorOpen(false);
    setEditingPost(null);
    showToast(existingIndex >= 0 ? 'Publicación actualizada' : 'Nueva publicación creada');
  };

  const handleDeletePost = (postId: string) => {
    const updated = posts.filter((p) => p.id !== postId);
    setPosts(updated);
    savePosts(updated);
    showToast('Publicación eliminada');
  };

  const handleDuplicatePost = (postToDuplicate: SocialPost) => {
    const duplicated: SocialPost = {
      ...postToDuplicate,
      id: `post-${Date.now()}`,
      title: `${postToDuplicate.title} (Copia)`,
      status: 'borrador',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [duplicated, ...posts];
    setPosts(updated);
    savePosts(updated);
    showToast('Publicación duplicada');
  };

  const handleUpdatePostStatus = (postId: string, newStatus: PostStatus) => {
    const updated = posts.map((p) => (p.id === postId ? { ...p, status: newStatus } : p));
    setPosts(updated);
    savePosts(updated);
    showToast('Estado actualizado');
  };

  // Persist templates
  const handleSaveTemplate = (tpl: PostTemplate) => {
    const existingIndex = templates.findIndex((t) => t.id === tpl.id);
    let updated: PostTemplate[];
    if (existingIndex >= 0) {
      updated = [...templates];
      updated[existingIndex] = tpl;
    } else {
      updated = [tpl, ...templates];
    }
    setTemplates(updated);
    saveTemplates(updated);
    showToast('Plantilla guardada');
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updated = templates.filter((t) => t.id !== templateId);
    setTemplates(updated);
    saveTemplates(updated);
    showToast('Plantilla eliminada');
  };

  const handleUseTemplate = (template: PostTemplate) => {
    // Create new post draft initialized with this template
    setEditingPost({
      id: `post-${Date.now()}`,
      title: template.title,
      rawContent: template.contentPattern,
      platforms: template.defaultPlatforms || ['instagram', 'linkedin'],
      pillarId: template.pillarId,
      status: 'borrador',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '11:00',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setEditorInitialDate(undefined);
    setIsEditorOpen(true);
  };

  const handleOpenNewPost = (dateStr?: string) => {
    setEditingPost(null);
    setEditorInitialDate(dateStr || new Date().toISOString().split('T')[0]);
    setIsEditorOpen(true);
  };

  const handleOpenEditPost = (post: SocialPost) => {
    setEditingPost(post);
    setEditorInitialDate(undefined);
    setIsEditorOpen(true);
  };

  const handleImportWorkspace = (data: {
    brand?: BrandProfile;
    posts?: SocialPost[];
    templates?: PostTemplate[];
    pillars?: ContentPillar[];
  }) => {
    if (data.brand) {
      setBrand(data.brand);
      saveBrandProfile(data.brand);
    }
    if (data.posts && Array.isArray(data.posts)) {
      setPosts(data.posts);
      savePosts(data.posts);
    }
    if (data.templates && Array.isArray(data.templates)) {
      setTemplates(data.templates);
      saveTemplates(data.templates);
    }
    if (data.pillars && Array.isArray(data.pillars)) {
      setPillars(data.pillars);
      savePillars(data.pillars);
    }
    showToast('Espacio de trabajo restaurado');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Header Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        brand={brand}
        onNewPost={() => handleOpenNewPost()}
        onOpenExportImport={() => setIsExportImportOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main View Port */}
      <main className="flex-1">
        {currentTab === 'calendario' && (
          <CalendarView
            posts={posts}
            brand={brand}
            pillars={pillars}
            onSelectPost={handleOpenEditPost}
            onNewPostWithDate={(dateStr) => handleOpenNewPost(dateStr)}
          />
        )}

        {currentTab === 'feed' && (
          <InstagramFeedGrid
            posts={posts}
            brand={brand}
            pillars={pillars}
            onSelectPost={handleOpenEditPost}
            onNewPost={() => handleOpenNewPost()}
          />
        )}

        {currentTab === 'publicaciones' && (
          <PostsListView
            posts={posts}
            brand={brand}
            pillars={pillars}
            onSelectPost={handleOpenEditPost}
            onNewPost={() => handleOpenNewPost()}
            onDuplicatePost={handleDuplicatePost}
            onDeletePost={handleDeletePost}
            onUpdatePostStatus={handleUpdatePostStatus}
          />
        )}

        {currentTab === 'plantillas' && (
          <TemplatesView
            templates={templates}
            brand={brand}
            pillars={pillars}
            onUseTemplate={handleUseTemplate}
            onSaveTemplate={handleSaveTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        )}

        {currentTab === 'marca' && (
          <BrandKitView
            brand={brand}
            onUpdateBrand={handleUpdateBrand}
          />
        )}
      </main>

      {/* Quiet Footer with GitHub Pages & Offline info */}
      <footer className="py-6 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">SocialHarmony</span>
            <span aria-hidden="true">·</span>
            <span>Organizador de Coherencia de Marca</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% Client-Side para GitHub Pages</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setCurrentTab('marca')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Configurar Variables
            </button>
            <button
              onClick={() => setIsExportImportOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Exportar CSV / JSON
            </button>
          </div>
        </div>
      </footer>

      {/* Editor Modal */}
      <PostEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingPost(null);
        }}
        post={editingPost}
        onSave={handleSavePost}
        brand={brand}
        pillars={pillars}
        templates={templates}
        initialDate={editorInitialDate}
      />

      {/* Export / Import & Backup Modal */}
      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
        brand={brand}
        posts={posts}
        templates={templates}
        pillars={pillars}
        onImportWorkspace={handleImportWorkspace}
      />

      {/* Toast alert popup */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
