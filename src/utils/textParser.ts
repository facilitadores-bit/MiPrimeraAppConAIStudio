import { BrandProfile, SocialPlatform, StyleAuditResult } from '../types';

/**
 * Replaces all {variable} tokens in text with matching values from the dictionary.
 * If variable is undefined or empty, keeps the token or replaces it cleanly based on option.
 */
export function interpolateVariables(
  text: string,
  variables: Record<string, string>,
  highlightMissing = false
): string {
  if (!text) return '';
  return text.replace(/\{([a-zA-Z0-9_-]+)\}/g, (match, key) => {
    const val = variables[key];
    if (val !== undefined && val !== '') {
      return val;
    }
    return highlightMissing ? `[⚠️ {${key}}]` : match;
  });
}

/**
 * Extracts all {variable_key} tokens in a string.
 */
export function extractVariables(text: string): string[] {
  if (!text) return [];
  const regex = /\{([a-zA-Z0-9_-]+)\}/g;
  const matches = new Set<string>();
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.add(match[1]);
  }
  return Array.from(matches);
}

/**
 * Finds variables referenced in text that don't have a non-empty value in variables map.
 */
export function findMissingVariables(
  text: string,
  variables: Record<string, string>
): string[] {
  const referenced = extractVariables(text);
  return referenced.filter((key) => !variables[key] || variables[key].trim() === '');
}

/**
 * Counts emojis in a string using standard Unicode regex.
 */
export function countEmojis(text: string): number {
  if (!text) return 0;
  const emojiRegex = /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/gu;
  const matches = text.match(emojiRegex);
  return matches ? matches.length : 0;
}

/**
 * Platform character limits and recommendations.
 */
export const PLATFORM_SPECS: Record<
  SocialPlatform,
  { name: string; maxChars: number; recommendedChars: number; hashtagLimit: number }
> = {
  instagram: {
    name: 'Instagram',
    maxChars: 2200,
    recommendedChars: 300,
    hashtagLimit: 30,
  },
  linkedin: {
    name: 'LinkedIn',
    maxChars: 3000,
    recommendedChars: 800,
    hashtagLimit: 5,
  },
  twitter: {
    name: 'X (Twitter)',
    maxChars: 280,
    recommendedChars: 240,
    hashtagLimit: 3,
  },
  tiktok: {
    name: 'TikTok',
    maxChars: 2200,
    recommendedChars: 150,
    hashtagLimit: 10,
  },
  threads: {
    name: 'Threads',
    maxChars: 500,
    recommendedChars: 350,
    hashtagLimit: 5,
  },
  facebook: {
    name: 'Facebook',
    maxChars: 63206,
    recommendedChars: 250,
    hashtagLimit: 5,
  },
};

/**
 * Audits a post's content against the Brand Editorial Rules and Platform Specs.
 */
export function auditPostCoherence(
  rawContent: string,
  brand: BrandProfile,
  platform: SocialPlatform = 'instagram'
): StyleAuditResult {
  const varMap: Record<string, string> = {};
  brand.variables.forEach((v) => {
    varMap[v.key] = v.value;
  });

  const parsed = interpolateVariables(rawContent, varMap, false);
  const foundVars = extractVariables(rawContent);
  const missingVars = findMissingVariables(rawContent, varMap);

  const checks: StyleAuditResult['checks'] = [];
  let scorePoints = 0;
  const maxPoints = 5;

  // 1. Missing parameters check
  if (missingVars.length === 0) {
    scorePoints++;
    checks.push({
      id: 'variables',
      label: 'Parámetros del texto',
      passed: true,
      recommendation: foundVars.length > 0 
        ? `Excelente: se detectaron ${foundVars.length} variables de marca y todas están completas.`
        : 'Texto limpio. Puedes usar variables como {marca} o {cta_principal} para mantener coherencia.',
      level: 'success',
    });
  } else {
    checks.push({
      id: 'variables',
      label: 'Parámetros sin definir',
      passed: false,
      recommendation: `Faltan valores para: ${missingVars.map((v) => `{${v}}`).join(', ')}. Defínelos en el Kit de Marca o edítalos.`,
      level: 'warning',
    });
  }

  // 2. Platform character limit check
  const spec = PLATFORM_SPECS[platform] || PLATFORM_SPECS.instagram;
  const charCount = parsed.length;
  if (charCount <= spec.maxChars && charCount > 15) {
    scorePoints++;
    checks.push({
      id: 'length',
      label: `Longitud para ${spec.name}`,
      passed: true,
      recommendation: `${charCount} caracteres (máx. permitido: ${spec.maxChars}). Longitud óptima.`,
      level: 'success',
    });
  } else if (charCount > spec.maxChars) {
    checks.push({
      id: 'length',
      label: `Excede límite de ${spec.name}`,
      passed: false,
      recommendation: `El texto tiene ${charCount} caracteres y excede el límite de ${spec.maxChars} por ${charCount - spec.maxChars} caracteres.`,
      level: 'warning',
    });
  } else {
    checks.push({
      id: 'length',
      label: 'Contenido muy breve',
      passed: false,
      recommendation: 'El texto es muy corto para generar impacto. Considera desarrollar más la idea o usar una plantilla.',
      level: 'info',
    });
  }

  // 3. CTA check
  const ctaVal = varMap['cta_principal']?.toLowerCase() || '';
  const ctaPresent =
    parsed.toLowerCase().includes('link') ||
    parsed.toLowerCase().includes('bio') ||
    parsed.toLowerCase().includes('coment') ||
    parsed.toLowerCase().includes('escrib') ||
    parsed.toLowerCase().includes('visit') ||
    parsed.toLowerCase().includes('descubr') ||
    parsed.toLowerCase().includes('guard') ||
    parsed.toLowerCase().includes('compart') ||
    (ctaVal && parsed.toLowerCase().includes(ctaVal.slice(0, 10)));

  if (brand.rules.requireCTA) {
    if (ctaPresent) {
      scorePoints++;
      checks.push({
        id: 'cta',
        label: 'Llamada a la acción (CTA)',
        passed: true,
        recommendation: 'Contiene una invitación clara a interactuar o visitar el enlace.',
        level: 'success',
      });
    } else {
      checks.push({
        id: 'cta',
        label: 'Falta Llamada a la Acción (CTA)',
        passed: false,
        recommendation: 'Tu regla de marca exige un CTA claro al final del post para guiar a tu audiencia.',
        level: 'warning',
      });
    }
  } else {
    scorePoints++;
  }

  // 4. Emoji discipline check
  const emojis = countEmojis(parsed);
  if (emojis <= brand.rules.maxEmojisPerPost) {
    scorePoints++;
    checks.push({
      id: 'emojis',
      label: 'Disciplina de emojis',
      passed: true,
      recommendation: `Usa ${emojis} emojis (máximo sugerido: ${brand.rules.maxEmojisPerPost}). Mantiene sobriedad y legibilidad.`,
      level: 'success',
    });
  } else {
    checks.push({
      id: 'emojis',
      label: 'Exceso de emojis',
      passed: false,
      recommendation: `Contiene ${emojis} emojis (la guía de estilo recomienda un máximo de ${brand.rules.maxEmojisPerPost} para no saturar).`,
      level: 'warning',
    });
  }

  // 5. Banned words check
  const lowerParsed = parsed.toLowerCase();
  const foundBanned = (brand.rules.bannedWords || []).filter(
    (w) => w.trim() && lowerParsed.includes(w.trim().toLowerCase())
  );

  if (foundBanned.length === 0) {
    scorePoints++;
    checks.push({
      id: 'banned_words',
      label: 'Vocabulario alineado a la marca',
      passed: true,
      recommendation: 'No contiene términos restringidos o prohibidos en tu manual editorial.',
      level: 'success',
    });
  } else {
    checks.push({
      id: 'banned_words',
      label: 'Término no deseado detectado',
      passed: false,
      recommendation: `Se detectaron palabras que tu manual de estilo desaconseja: "${foundBanned.join(', ')}".`,
      level: 'warning',
    });
  }

  const score = Math.round((scorePoints / maxPoints) * 100);

  return {
    score,
    checks,
    missingVariables: missingVars,
    foundVariables: foundVars,
  };
}
