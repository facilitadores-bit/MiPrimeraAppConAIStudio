import React, { useState } from 'react';
import { BrandProfile, ContentPillar, ContentPillarId, PostStatus, SocialPost } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Layers,
  Sparkles 
} from 'lucide-react';

interface CalendarViewProps {
  posts: SocialPost[];
  brand: BrandProfile;
  pillars: ContentPillar[];
  onSelectPost: (post: SocialPost) => void;
  onNewPostWithDate: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  posts,
  brand,
  pillars,
  onSelectPost,
  onNewPostWithDate,
}) => {
  const [currentDate, setCurrentDate] = useState(() => {
    // start with today or the date of first scheduled post
    return new Date();
  });
  const [filterPillar, setFilterPillar] = useState<ContentPillarId | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<PostStatus | 'all'>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Month calculation
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  // Normalize so Monday is 0, Sunday is 6
  const startingDayOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weekDayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    if (filterPillar !== 'all' && p.pillarId !== filterPillar) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  // Map posts by date string "YYYY-MM-DD"
  const postsByDate: Record<string, SocialPost[]> = {};
  filteredPosts.forEach((p) => {
    if (!postsByDate[p.scheduledDate]) {
      postsByDate[p.scheduledDate] = [];
    }
    postsByDate[p.scheduledDate].push(p);
  });

  // Calculate pillar distribution for the visible month
  const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const thisMonthPosts = posts.filter((p) => p.scheduledDate.startsWith(currentMonthPrefix));

  const pillarCounts: Record<string, number> = {};
  thisMonthPosts.forEach((p) => {
    pillarCounts[p.pillarId] = (pillarCounts[p.pillarId] || 0) + 1;
  });

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Month Header and Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        
        {/* Navigation title */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white capitalize">
            {monthNames[month]} {year}
          </h1>

          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 shadow-xs">
            <button
              onClick={prevMonth}
              title="Mes anterior"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToToday}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              Hoy
            </button>
            <button
              onClick={nextMonth}
              title="Mes siguiente"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters and Counters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Pillar filter */}
          <select
            value={filterPillar}
            onChange={(e) => setFilterPillar(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">Todos los Pilares</option>
            {pillars.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">Todos los Estados</option>
            <option value="programado">Programados</option>
            <option value="revisado">Listos / Revisados</option>
            <option value="borrador">Borradores</option>
            <option value="publicado">Publicados</option>
          </select>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium pl-1">
            {thisMonthPosts.length} publicaciones este mes
          </div>
        </div>

      </div>

      {/* Content Pillar Balance Indicator Strip */}
      {thisMonthPosts.length > 0 && (
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              Equilibrio de Pilares de Contenido ({monthNames[month]})
            </span>
            <span className="text-[11px] text-slate-400">
              Regla recomendada: 40% Educativo, 25% Venta, 20% Casos/Detrás de escena, 15% Comunidad
            </span>
          </div>

          {/* Progress bar split */}
          <div className="h-2.5 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
            {pillars.map((pillar) => {
              const count = pillarCounts[pillar.id] || 0;
              if (count === 0) return null;
              const pct = (count / thisMonthPosts.length) * 100;
              return (
                <div
                  key={pillar.id}
                  style={{ width: `${pct}%`, backgroundColor: pillar.color }}
                  title={`${pillar.nombre}: ${count} posts (${Math.round(pct)}%)`}
                  className="h-full transition-all duration-300 hover:opacity-85"
                />
              );
            })}
          </div>

          {/* Legend items */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px]">
            {pillars.map((pillar) => {
              const count = pillarCounts[pillar.id] || 0;
              if (count === 0) return null;
              const pct = Math.round((count / thisMonthPosts.length) * 100);
              return (
                <div key={pillar.id} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: pillar.color }}
                  />
                  <span className="text-slate-600 dark:text-slate-400">
                    {pillar.nombre}: <strong className="font-mono text-slate-800 dark:text-slate-200">{count}</strong> ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 py-2.5">
          {weekDayNames.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800/80">
          
          {/* Empty cells before month start */}
          {Array.from({ length: startingDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[110px] bg-slate-50/30 dark:bg-slate-950/20 p-2" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayPosts = postsByDate[dateStr] || [];
            const isToday = dateStr === todayStr;

            return (
              <div
                key={dateStr}
                onClick={() => onNewPostWithDate(dateStr)}
                className={`min-h-[110px] sm:min-h-[130px] p-2 flex flex-col justify-between transition-colors cursor-pointer group hover:bg-slate-50/80 dark:hover:bg-slate-850/60 ${
                  isToday ? 'bg-emerald-50/30 dark:bg-emerald-950/15' : 'bg-white dark:bg-slate-900'
                }`}
              >
                {/* Day number bar */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center ${
                      isToday
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {dayNum}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNewPostWithDate(dateStr);
                    }}
                    title="Añadir publicación en esta fecha"
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-opacity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Day posts list */}
                <div className="space-y-1.5 flex-1 overflow-y-auto">
                  {dayPosts.map((p) => {
                    const pillar = pillars.find((pil) => pil.id === p.pillarId) || pillars[0];
                    return (
                      <div
                        key={p.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPost(p);
                        }}
                        className="p-1.5 rounded-md text-left text-[11px] leading-tight border transition-all hover:scale-[1.01] hover:shadow-xs cursor-pointer bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 group/post"
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: pillar.color }}
                            title={pillar.nombre}
                          />
                          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                            {p.scheduledTime}
                          </span>
                        </div>
                        <div className="font-medium text-slate-800 dark:text-slate-200 truncate group-hover/post:text-emerald-600 dark:group-hover/post:text-emerald-400">
                          {p.title}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
};
