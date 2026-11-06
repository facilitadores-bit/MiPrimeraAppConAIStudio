export type SocialPlatform = 'instagram' | 'linkedin' | 'twitter' | 'tiktok' | 'facebook' | 'threads';

export type ContentPillarId = 
  | 'educativo' 
  | 'promocional' 
  | 'caso_exito' 
  | 'entretenimiento' 
  | 'detras_escena' 
  | 'comunidad' 
  | 'noticia';

export interface ContentPillar {
  id: ContentPillarId;
  nombre: string;
  descripcion: string;
  color: string; // Tailwind hex or class representation
  icono: string;
}

export type PostStatus = 'idea' | 'borrador' | 'revisado' | 'programado' | 'publicado';

export interface BrandVariable {
  key: string; // e.g. "marca", "slogan", "cta_principal"
  label: string; // e.g. "Nombre de la Marca"
  value: string; // e.g. "EcoVita Snacks"
  description?: string;
  isCustom?: boolean;
}

export interface BrandEditorialRules {
  grammaticalPerson: 'tu' | 'vos' | 'usted' | 'nosotros';
  maxEmojisPerPost: number;
  requireHook: boolean;
  requireCTA: boolean;
  requireBrandHashtags: boolean;
  preferredSentenceLength: 'corta' | 'media' | 'larga';
  bannedWords: string[];
  keyBrandHashtags: string;
  notes: string;
}

export interface BrandProfile {
  id: string;
  name: string;
  tagline: string;
  handle: string;
  avatarUrl: string;
  primaryColor: string;
  secondaryColor: string;
  variables: BrandVariable[];
  rules: BrandEditorialRules;
}

export interface PostTemplate {
  id: string;
  title: string;
  pillarId: ContentPillarId;
  defaultPlatforms: SocialPlatform[];
  contentPattern: string; // Text with {variable} placeholders
  suggestedHashtags: string;
  callToActionPattern: string;
  description: string;
}

export interface SocialPost {
  id: string;
  title: string;
  rawContent: string; // Contains {tokens} or raw text
  platforms: SocialPlatform[];
  pillarId: ContentPillarId;
  status: PostStatus;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  imageUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StyleAuditResult {
  score: number; // 0 - 100
  checks: {
    id: string;
    label: string;
    passed: boolean;
    recommendation: string;
    level: 'success' | 'warning' | 'info';
  }[];
  missingVariables: string[];
  foundVariables: string[];
}
