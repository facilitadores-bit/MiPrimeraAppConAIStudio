import React, { useState } from 'react';
import { BrandProfile, ContentPillar, SocialPost } from '../types';
import { interpolateVariables } from '../utils/textParser';
import { Grid, Eye, Edit2, Calendar, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface InstagramFeedGridProps {
  posts: SocialPost[];
  brand: BrandProfile;
  pillars: ContentPillar[];
  onSelectPost: (post: SocialPost) => void;
  onNewPost: () => void;
}

export const InstagramFeedGrid: React.FC<InstagramFeedGridProps> = ({
  posts,
  brand,
  pillars,
  onSelectPost,
  onNewPost,
}) => {
  // Sort posts chronologically or reverse-chronological (as on Instagram feed, newest first)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter posts that are for Instagram or general
  const igPosts = posts.filter((p) => p.platforms.includes('instagram') || p.platforms.length === 0);

  const sortedPosts = [...igPosts].sort((a, b) => {
    const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime || '00:00'}`).getTime();
    const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime || '00:00'}`).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // Calculate visual harmony check: are there two promotional posts adjacent?
  const hasConsecutivePromos = sortedPosts.some((p, idx) => {
    if (idx === 0) return false;
    return p.pillarId === 'promocional' && sortedPosts[idx - 1].pillarId === 'promocional';
  });

  // Map variables
  const varMap: Record<string, string> = {};
  brand.variables.forEach((v) => (varMap[v.key] = v.value));

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Grid className="w-5 h-5 text-slate-500" />
            Armonía del Feed Visual 3x3
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Revisa la cuadrícula para asegurar que los colores de portadas, temas y pilares se alternen de forma estética sin cansar a la audiencia.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="desc">Más recientes primero (Feed IG)</option>
            <option value="asc">Orden cronológico ascendente</option>
          </select>
        </div>
      </div>

      {/* Visual Harmony Audit Notification */}
      <div className="p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          {hasConsecutivePromos ? (
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          )}
          <span className="text-slate-700 dark:text-slate-300">
            {hasConsecutivePromos ? (
              <>
                <strong className="text-amber-600 dark:text-amber-400 font-semibold">Alerta de Coherencia:</strong> Hay 2 publicaciones promocionales consecutivas en el feed. Considera intercalar una educativa o de comunidad.
              </>
            ) : (
              <>
                <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Distribución Armónica:</strong> Buen ritmo entre contenido educativo, de valor y llamados a la compra.
              </>
            )}
          </span>
        </div>

        <button
          onClick={onNewPost}
          className="px-3 py-1 text-xs font-semibold rounded-md text-white shrink-0 hover:opacity-95"
          style={{ backgroundColor: brand.primaryColor || '#059669' }}
        >
          + Agregar al Feed
        </button>
      </div>

      {/* Profile Header Simulation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-4 sm:gap-6">
          <img
            src={brand.avatarUrl}
            alt={brand.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {brand.handle.replace('@', '')}
            </h2>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">
              {brand.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
              {brand.tagline}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <span><strong className="text-slate-900 dark:text-white">{sortedPosts.length}</strong> posts</span>
              <span><strong className="text-slate-900 dark:text-white">1.8k</strong> seguidores</span>
              <span><strong className="text-slate-900 dark:text-white">340</strong> seguidos</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3x3 Grid of Instagram Posts */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3 bg-white dark:bg-slate-900 p-2 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {sortedPosts.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-slate-400 dark:text-slate-500 text-xs">
            No hay publicaciones programadas para Instagram todavía.
            <div className="mt-3">
              <button
                onClick={onNewPost}
                className="px-3.5 py-2 text-xs font-semibold text-white rounded-lg shadow-sm"
                style={{ backgroundColor: brand.primaryColor || '#059669' }}
              >
                Crear Primera Publicación
              </button>
            </div>
          </div>
        ) : (
          sortedPosts.map((post) => {
            const pillar = pillars.find((p) => p.id === post.pillarId) || pillars[0];
            const resolvedText = interpolateVariables(post.rawContent, varMap);

            return (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 cursor-pointer group shadow-2xs"
              >
                {/* Visual Media */}
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-4 text-center text-white"
                    style={{ backgroundColor: pillar.color }}
                  >
                    <Sparkles className="w-5 h-5 mb-1 opacity-70" />
                    <span className="font-bold text-xs sm:text-sm line-clamp-2 leading-tight">
                      {post.title}
                    </span>
                    <span className="text-[10px] opacity-80 mt-1 uppercase font-semibold">
                      {pillar.nombre}
                    </span>
                  </div>
                )}

                {/* Pillar Tag Indicator on Top Corner */}
                <div className="absolute top-2 left-2 z-10 pointer-events-none">
                  <span
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full block border-2 border-white shadow-xs"
                    style={{ backgroundColor: pillar.color }}
                    title={`Pilar: ${pillar.nombre}`}
                  />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-slate-950/75 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 z-20">
                  <div className="flex items-center justify-between text-[10px] text-slate-300">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.scheduledDate}
                    </span>
                    <span className="capitalize">{post.status}</span>
                  </div>

                  <div className="my-auto text-center">
                    <p className="font-semibold text-xs line-clamp-2 mb-1">
                      {post.title}
                    </p>
                    <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                      "{resolvedText.slice(0, 80)}..."
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-300">
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar Post</span>
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
