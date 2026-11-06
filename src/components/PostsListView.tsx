import React, { useState } from 'react';
import { BrandProfile, ContentPillar, ContentPillarId, PostStatus, SocialPost } from '../types';
import { interpolateVariables } from '../utils/textParser';
import { 
  Search, 
  Plus, 
  Copy, 
  Check, 
  Edit3, 
  CopyCheck, 
  Trash2, 
  Calendar, 
  Clock, 
  Layers,
  Sparkles,
  ExternalLink 
} from 'lucide-react';

interface PostsListViewProps {
  posts: SocialPost[];
  brand: BrandProfile;
  pillars: ContentPillar[];
  onSelectPost: (post: SocialPost) => void;
  onNewPost: () => void;
  onDuplicatePost: (post: SocialPost) => void;
  onDeletePost: (postId: string) => void;
  onUpdatePostStatus: (postId: string, newStatus: PostStatus) => void;
}

export const PostsListView: React.FC<PostsListViewProps> = ({
  posts,
  brand,
  pillars,
  onSelectPost,
  onNewPost,
  onDuplicatePost,
  onDeletePost,
  onUpdatePostStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');
  const [pillarFilter, setPillarFilter] = useState<ContentPillarId | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Map variables
  const varMap: Record<string, string> = {};
  brand.variables.forEach((v) => (varMap[v.key] = v.value));

  const filteredPosts = posts.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (pillarFilter !== 'all' && p.pillarId !== pillarFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchContent = p.rawContent.toLowerCase().includes(q);
      const matchNotes = p.notes?.toLowerCase().includes(q);
      return matchTitle || matchContent || matchNotes;
    }
    return true;
  });

  const handleCopyText = (post: SocialPost) => {
    const text = interpolateVariables(post.rawContent, varMap, false);
    navigator.clipboard.writeText(text);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const statusOptions: { id: PostStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'programado', label: 'Programados' },
    { id: 'revisado', label: 'Listos / Revisados' },
    { id: 'borrador', label: 'Borradores' },
    { id: 'idea', label: 'Ideas' },
    { id: 'publicado', label: 'Publicados' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Biblioteca de Publicaciones
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestiona todo el catálogo de contenidos, revisa parámetros y copia textos listos para publicar.
          </p>
        </div>

        <button
          onClick={onNewPost}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white rounded-lg shadow-sm hover:opacity-95 active:scale-98 transition-all shrink-0"
          style={{ backgroundColor: brand.primaryColor || '#059669' }}
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Publicación</span>
        </button>
      </div>

      {/* Search and Filters toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, contenido o notas..."
            className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
          />
        </div>

        {/* Pillar filter */}
        <div className="flex items-center gap-2">
          <select
            value={pillarFilter}
            onChange={(e) => setPillarFilter(e.target.value as any)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">Todos los Pilares</option>
            {pillars.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Segmented Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-850 rounded-lg text-xs font-medium">
        {statusOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setStatusFilter(opt.id)}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              statusFilter === opt.id
                ? 'bg-white dark:bg-slate-750 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No se encontraron publicaciones con los filtros seleccionados.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPillarFilter('all');
              }}
              className="mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const pillar = pillars.find((p) => p.id === post.pillarId) || pillars[0];
            const resolvedText = interpolateVariables(post.rawContent, varMap, false);
            const isCopied = copiedId === post.id;

            return (
              <div
                key={post.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                
                {/* Left side: details & snippet */}
                <div className="flex-1 min-w-0 space-y-2">
                  
                  {/* Metadata line without pill enclosures (§1.A Zero-Pill) */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: pillar.color }}
                      />
                      {pillar.nombre}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.scheduledDate} ({post.scheduledTime})
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">
                      {post.platforms.join(', ')}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => onSelectPost(post)}
                    className="text-base font-bold text-slate-900 dark:text-white cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    {post.title}
                  </h3>

                  {/* Text preview snippet */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {resolvedText}
                  </p>

                  {/* Notes if available */}
                  {post.notes && (
                    <div className="text-[11px] text-slate-400 italic">
                      Nota de equipo: {post.notes}
                    </div>
                  )}
                </div>

                {/* Right side: Status selector & Action Buttons */}
                <div className="flex sm:flex-row md:flex-col items-center sm:items-end justify-between sm:justify-end gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  
                  {/* Status Dropdown */}
                  <select
                    value={post.status}
                    onChange={(e) => onUpdatePostStatus(post.id, e.target.value as PostStatus)}
                    className="text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="idea">💡 Idea</option>
                    <option value="borrador">📝 Borrador</option>
                    <option value="revisado">🔍 Revisado</option>
                    <option value="programado">⏰ Programado</option>
                    <option value="publicado">✅ Publicado</option>
                  </select>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyText(post)}
                      title="Copiar texto con variables resueltas"
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => onDuplicatePost(post)}
                      title="Duplicar publicación"
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                    >
                      <CopyCheck className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onSelectPost(post)}
                      title="Editar publicación"
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`¿Seguro que deseas eliminar "${post.title}"?`)) {
                          onDeletePost(post.id);
                        }
                      }}
                      title="Eliminar publicación"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
