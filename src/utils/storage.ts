import { BrandProfile, ContentPillar, PostTemplate, SocialPost } from '../types';
import { CONTENT_PILLARS, DEFAULT_BRAND, DEFAULT_POSTS, DEFAULT_TEMPLATES } from '../data/initialData';

const STORAGE_KEYS = {
  BRAND: 'socialharmony_brand_profile',
  POSTS: 'socialharmony_posts',
  TEMPLATES: 'socialharmony_templates',
  PILLARS: 'socialharmony_pillars',
};

export function loadBrandProfile(): BrandProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BRAND);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading brand profile from storage:', err);
  }
  return DEFAULT_BRAND;
}

export function saveBrandProfile(brand: BrandProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BRAND, JSON.stringify(brand));
  } catch (err) {
    console.error('Error saving brand profile:', err);
  }
}

export function loadPosts(): SocialPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading posts from storage:', err);
  }
  return DEFAULT_POSTS;
}

export function savePosts(posts: SocialPost[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  } catch (err) {
    console.error('Error saving posts:', err);
  }
}

export function loadTemplates(): PostTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading templates:', err);
  }
  return DEFAULT_TEMPLATES;
}

export function saveTemplates(templates: PostTemplate[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  } catch (err) {
    console.error('Error saving templates:', err);
  }
}

export function loadPillars(): ContentPillar[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PILLARS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading pillars:', err);
  }
  return CONTENT_PILLARS;
}

export function savePillars(pillars: ContentPillar[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PILLARS, JSON.stringify(pillars));
  } catch (err) {
    console.error('Error saving pillars:', err);
  }
}

export interface WorkspaceExport {
  version: string;
  exportedAt: string;
  brand: BrandProfile;
  posts: SocialPost[];
  templates: PostTemplate[];
  pillars: ContentPillar[];
}

export function exportFullWorkspace(
  brand: BrandProfile,
  posts: SocialPost[],
  templates: PostTemplate[],
  pillars: ContentPillar[]
): void {
  const data: WorkspaceExport = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    brand,
    posts,
    templates,
    pillars,
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `socialharmony_${brand.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportPostsToCSV(posts: SocialPost[], brand: BrandProfile): void {
  const varMap: Record<string, string> = {};
  brand.variables.forEach((v) => (varMap[v.key] = v.value));

  // CSV headers
  const headers = ['ID', 'Titulo', 'Fecha', 'Hora', 'Pilar', 'Redes', 'Estado', 'Texto_Con_Variables', 'Texto_Resuelto'];
  const rows = posts.map((p) => {
    // Replace variables
    const resolved = p.rawContent.replace(/\{([a-zA-Z0-9_-]+)\}/g, (_, k) => varMap[k] || `{${k}}`);
    
    // Clean string for CSV escaping
    const escapeCsv = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;

    return [
      escapeCsv(p.id),
      escapeCsv(p.title),
      escapeCsv(p.scheduledDate),
      escapeCsv(p.scheduledTime),
      escapeCsv(p.pillarId),
      escapeCsv(p.platforms.join(', ')),
      escapeCsv(p.status),
      escapeCsv(p.rawContent),
      escapeCsv(resolved),
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `calendario_publicaciones_${brand.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
