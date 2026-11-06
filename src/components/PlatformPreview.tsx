import React, { useState } from 'react';
import { BrandProfile, SocialPlatform, SocialPost } from '../types';
import { interpolateVariables } from '../utils/textParser';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Repeat2, 
  Share2, 
  ThumbsUp, 
  Check, 
  Copy, 
  MoreHorizontal,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface PlatformPreviewProps {
  post: Partial<SocialPost>;
  brand: BrandProfile;
  initialPlatform?: SocialPlatform;
}

export const PlatformPreview: React.FC<PlatformPreviewProps> = ({
  post,
  brand,
  initialPlatform = 'instagram',
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>(
    post.platforms && post.platforms.length > 0 ? post.platforms[0] : initialPlatform
  );
  const [copied, setCopied] = useState(false);

  // Map of variables
  const varMap: Record<string, string> = {};
  brand.variables.forEach((v) => (varMap[v.key] = v.value));

  const resolvedText = interpolateVariables(post.rawContent || '', varMap, false);

  const handleCopy = () => {
    navigator.clipboard.writeText(resolvedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const platformsList: { id: SocialPlatform; label: string }[] = [
    { id: 'instagram', label: 'Instagram' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'twitter', label: 'X (Twitter)' },
    { id: 'tiktok', label: 'TikTok' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      
      {/* Top selector bar */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {platformsList.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedPlatform === p.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-xs shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar Texto</span>
            </>
          )}
        </button>
      </div>

      {/* Main preview body */}
      <div className="flex-1 p-4 overflow-y-auto flex items-start justify-center">
        
        {/* INSTAGRAM MOCKUP */}
        {selectedPlatform === 'instagram' && (
          <div className="w-full max-w-[390px] bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-slate-900 dark:text-white text-xs">
            {/* Header */}
            <div className="flex items-center justify-between px-3.5 py-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <img
                  src={brand.avatarUrl}
                  alt={brand.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-xs leading-none">
                    {brand.handle.replace('@', '')}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Audio original
                  </span>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>

            {/* Media image */}
            {post.imageUrl ? (
              <div className="relative aspect-square bg-slate-100 dark:bg-slate-850 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt="Post preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div 
                className="aspect-square flex flex-col items-center justify-center p-6 text-center text-white"
                style={{ backgroundColor: brand.primaryColor || '#059669' }}
              >
                <Sparkles className="w-8 h-8 mb-2 opacity-80" />
                <span className="font-bold text-sm tracking-tight">{brand.name}</span>
                <span className="text-xs opacity-90 mt-1 max-w-[220px]">{post.title || brand.tagline}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="px-3.5 pt-3 pb-2">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-3.5">
                  <Heart className="w-5 h-5 text-slate-700 dark:text-slate-200 cursor-pointer hover:text-rose-500 transition-colors" />
                  <MessageCircle className="w-5 h-5 text-slate-700 dark:text-slate-200 cursor-pointer" />
                  <Send className="w-5 h-5 text-slate-700 dark:text-slate-200 cursor-pointer" />
                </div>
                <Bookmark className="w-5 h-5 text-slate-700 dark:text-slate-200 cursor-pointer" />
              </div>

              {/* Likes */}
              <div className="font-semibold text-[11px] mb-1.5">
                128 Me gusta
              </div>

              {/* Caption */}
              <div className="space-y-1.5 leading-relaxed text-slate-800 dark:text-slate-200">
                <span className="font-semibold mr-1.5 text-slate-900 dark:text-white">
                  {brand.handle.replace('@', '')}
                </span>
                <span className="whitespace-pre-line text-xs">
                  {resolvedText || 'Escribe el contenido de tu publicación para ver cómo se verá aquí...'}
                </span>
              </div>

              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-wide">
                Hace 2 horas · Ver traducción
              </div>
            </div>
          </div>
        )}

        {/* LINKEDIN MOCKUP */}
        {selectedPlatform === 'linkedin' && (
          <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 text-xs text-slate-900 dark:text-slate-100">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={brand.avatarUrl}
                  alt={brand.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                    {brand.name}
                    <span className="text-[11px] text-slate-400 font-normal">· 1.er</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {brand.tagline}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <span>1 h</span>
                    <span>·</span>
                    <span>🌐</span>
                  </div>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>

            {/* Post text */}
            <div className="whitespace-pre-line leading-relaxed text-slate-800 dark:text-slate-200 mb-3 text-xs">
              {resolvedText || 'Escribe el contenido de tu publicación...'}
            </div>

            {/* Post image */}
            {post.imageUrl && (
              <div className="rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 mb-3 max-h-[260px] bg-slate-50">
                <img
                  src={post.imageUrl}
                  alt="Post preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Reaction counts */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 py-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1">
                <span className="flex -space-x-1">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">👍</span>
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px]">👏</span>
                  <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px]">❤️</span>
                </span>
                <span className="ml-1">84</span>
              </div>
              <div>12 comentarios · 4 veces compartido</div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-4 gap-1 pt-2 text-[11px] font-medium text-slate-600 dark:text-slate-300 text-center">
              <button className="py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded flex items-center justify-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5" /> Reaccionar
              </button>
              <button className="py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded flex items-center justify-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" /> Comentar
              </button>
              <button className="py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded flex items-center justify-center gap-1">
                <Repeat2 className="w-3.5 h-3.5" /> Republicar
              </button>
              <button className="py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded flex items-center justify-center gap-1">
                <Send className="w-3.5 h-3.5" /> Enviar
              </button>
            </div>
          </div>
        )}

        {/* X / TWITTER MOCKUP */}
        {selectedPlatform === 'twitter' && (
          <div className="w-full max-w-[420px] bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 text-xs text-slate-900 dark:text-white">
            <div className="flex items-start gap-3">
              <img
                src={brand.avatarUrl}
                alt={brand.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white truncate">
                    {brand.name}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 truncate">
                    {brand.handle}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 dark:text-slate-400">3h</span>
                </div>

                <div className="mt-1.5 whitespace-pre-line leading-relaxed text-slate-800 dark:text-slate-200">
                  {resolvedText || 'Escribe tu tweet o publicación...'}
                </div>

                {post.imageUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[220px]">
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Twitter footer actions */}
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mt-3 pt-2 text-[11px] max-w-[320px]">
                  <span className="flex items-center gap-1 hover:text-sky-500 cursor-pointer">
                    <MessageCircle className="w-3.5 h-3.5" /> 18
                  </span>
                  <span className="flex items-center gap-1 hover:text-emerald-500 cursor-pointer">
                    <Repeat2 className="w-3.5 h-3.5" /> 6
                  </span>
                  <span className="flex items-center gap-1 hover:text-rose-500 cursor-pointer">
                    <Heart className="w-3.5 h-3.5" /> 74
                  </span>
                  <span className="flex items-center gap-1 hover:text-sky-500 cursor-pointer">
                    <Bookmark className="w-3.5 h-3.5" /> 9
                  </span>
                  <span className="flex items-center gap-1 hover:text-sky-500 cursor-pointer">
                    <Share2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TIKTOK / REELS SCRIPT MOCKUP */}
        {selectedPlatform === 'tiktok' && (
          <div className="w-full max-w-[360px] bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-sm p-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-semibold text-emerald-400">Guion & Pie de Video (Reels / TikTok)</span>
              <span className="text-[10px] text-slate-400">{brand.handle}</span>
            </div>

            <div className="mt-3 space-y-3">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Gancho de inicio (primeros 3 segundos)
                </span>
                <p className="italic text-slate-200">
                  {resolvedText.split('\n')[0] || 'Tu gancho audiovisual aquí...'}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Descripción / Caption del video:
                </span>
                <div className="p-3 bg-slate-900/60 rounded-lg text-slate-300 leading-relaxed whitespace-pre-line">
                  {resolvedText}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
