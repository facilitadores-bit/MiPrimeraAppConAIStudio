import { BrandProfile, PostTemplate, SocialPost } from '../types';
import { DEFAULT_BRAND, DEFAULT_POSTS, DEFAULT_TEMPLATES } from '../data/initialData';

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

const GITHUB_CONFIG_STORAGE_KEY = 'socialharmony_github_config';

export function getStoredGitHubConfig(): GitHubConfig {
  try {
    const raw = localStorage.getItem(GITHUB_CONFIG_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading GitHub config from storage:', err);
  }
  return {
    owner: 'facilitadores-bit',
    repo: 'MiPrimeraAppConAIStudio',
    branch: 'main',
    token: '',
  };
}

export function saveGitHubConfig(config: GitHubConfig): void {
  try {
    localStorage.setItem(GITHUB_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving GitHub config:', err);
  }
}

// Convert string to UTF-8 base64 (supporting Unicode characters/emojis)
function utf8ToBase64(str: string): string {
  return window.btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
}

// Convert base64 to UTF-8 string
function base64ToUtf8(str: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(window.atob(str), (c: string) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
}

interface GitHubFileResponse {
  sha: string;
  content: string;
  encoding: string;
}

/**
 * Gets file content and current SHA from GitHub repository.
 */
export async function getGitHubFile(
  config: GitHubConfig,
  filePath: string
): Promise<{ sha: string | null; content: string | null }> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}?ref=${config.branch}`;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (config.token.trim()) {
    headers['Authorization'] = `Bearer ${config.token.trim()}`;
  }

  const response = await fetch(url, { headers });
  if (response.status === 404) {
    return { sha: null, content: null };
  }

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Error ${response.status} de GitHub: ${errText}`);
  }

  const data: GitHubFileResponse = await response.json();
  const decoded = base64ToUtf8(data.content.replace(/\n/g, ''));
  return { sha: data.sha, content: decoded };
}

/**
 * Creates or updates a file directly in GitHub via a Git commit.
 */
export async function commitFileToGitHub(
  config: GitHubConfig,
  filePath: string,
  contentStr: string,
  commitMessage: string
): Promise<{ success: boolean; commitUrl?: string }> {
  if (!config.token.trim()) {
    throw new Error('Se requiere un Token de Acceso Personal de GitHub (PAT) para hacer commits.');
  }

  // 1. Get current SHA if file exists
  let currentSha: string | null = null;
  try {
    const fileInfo = await getGitHubFile(config, filePath);
    currentSha = fileInfo.sha;
  } catch (err) {
    // If doesn't exist, currentSha remains null
  }

  // 2. Put file with commit
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}`;
  const payload: any = {
    message: commitMessage,
    content: utf8ToBase64(contentStr),
    branch: config.branch || 'main',
  };

  if (currentSha) {
    payload.sha = currentSha;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${config.token.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || `Error ${response.status} al realizar el commit.`);
  }

  const result = await response.json();
  return {
    success: true,
    commitUrl: result.commit?.html_url,
  };
}

/**
 * Commits all workspace data (brand.json, templates.json, posts.json) to GitHub in git commits.
 */
export async function commitFullWorkspaceToGitHub(
  config: GitHubConfig,
  brand: BrandProfile,
  posts: SocialPost[],
  templates: PostTemplate[],
  commitMessage: string = 'chore: actualizar datos y plantillas de SocialHarmony'
): Promise<{ success: boolean; details: string[] }> {
  const details: string[] = [];

  // 1. Commit templates.json
  const templatesStr = JSON.stringify(templates, null, 2);
  await commitFileToGitHub(
    config,
    'data/templates.json',
    templatesStr,
    `${commitMessage} (plantillas)`
  );
  details.push('data/templates.json guardado en Git');

  // 2. Commit posts.json
  const postsStr = JSON.stringify(posts, null, 2);
  await commitFileToGitHub(
    config,
    'data/posts.json',
    postsStr,
    `${commitMessage} (publicaciones)`
  );
  details.push('data/posts.json guardado en Git');

  // 3. Commit brand.json
  const brandStr = JSON.stringify(brand, null, 2);
  await commitFileToGitHub(
    config,
    'data/brand.json',
    brandStr,
    `${commitMessage} (marca y variables)`
  );
  details.push('data/brand.json guardado en Git');

  return { success: true, details };
}

/**
 * Loads JSON data from GitHub repository or local ./data/ fallback.
 */
export async function loadDataFromRepository(config: GitHubConfig): Promise<{
  brand?: BrandProfile;
  posts?: SocialPost[];
  templates?: PostTemplate[];
}> {
  const result: { brand?: BrandProfile; posts?: SocialPost[]; templates?: PostTemplate[] } = {};

  // Try fetching from GitHub API directly first (gets latest live commits)
  if (config.owner && config.repo) {
    try {
      const brandFile = await getGitHubFile(config, 'data/brand.json');
      if (brandFile.content) {
        result.brand = JSON.parse(brandFile.content);
      }
    } catch (e) {
      console.warn('Could not load brand.json from GitHub API:', e);
    }

    try {
      const templatesFile = await getGitHubFile(config, 'data/templates.json');
      if (templatesFile.content) {
        result.templates = JSON.parse(templatesFile.content);
      }
    } catch (e) {
      console.warn('Could not load templates.json from GitHub API:', e);
    }

    try {
      const postsFile = await getGitHubFile(config, 'data/posts.json');
      if (postsFile.content) {
        result.posts = JSON.parse(postsFile.content);
      }
    } catch (e) {
      console.warn('Could not load posts.json from GitHub API:', e);
    }
  }

  // Fallback to relative ./data/ static files if not loaded from API
  if (!result.brand) {
    try {
      const res = await fetch('./data/brand.json');
      if (res.ok) result.brand = await res.json();
    } catch (e) {}
  }
  if (!result.templates) {
    try {
      const res = await fetch('./data/templates.json');
      if (res.ok) result.templates = await res.json();
    } catch (e) {}
  }
  if (!result.posts) {
    try {
      const res = await fetch('./data/posts.json');
      if (res.ok) result.posts = await res.json();
    } catch (e) {}
  }

  return result;
}
