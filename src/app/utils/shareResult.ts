import type { Language } from '../App';
import { clicksLabel, getTranslation, pointsLabel } from '../translations';
import type { PreviousGame } from './previousGames';
import logoPaths from '../imports/svg-3h6239ug75';

export const SCORE_COLOR = '#fbbf24';

// Titles with non-ASCII letters (Cyrillic, …) go into links as base64url under `start64`/`end64`
const encodeTitle = (title: string) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(title))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const decodeTitle = (value: string) => {
  try {
    const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'));
    return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
  } catch {
    return '';
  }
};

const titleParam = (key: 'start' | 'end', title: string) =>
  /^[\x20-\x7e]*$/.test(title) ? `${key}=${encodeURIComponent(title)}` : `${key}64=${encodeTitle(title)}`;

export const readTitle = (params: URLSearchParams, key: 'start' | 'end') => {
  const encoded = params.get(`${key}64`);
  return encoded !== null ? decodeTitle(encoded) : params.get(key) || '';
};

export const titleParams = (start: string, end: string) => `${titleParam('start', start)}&${titleParam('end', end)}`;

// Shareable link: #/game?start=…&end=…&lang=… (or start64/end64)
export const gamePath = (start: string, end: string, language: Language) =>
  `/game?${titleParams(start, end)}&lang=${language}`;

const SIZE = 1000;
const LEFT = 100;
const MAX_WIDTH = SIZE - 2 * LEFT;
const LOGO_WIDTH = 256; // Logo.tsx draws the same path in an 80×40 box
const LOGO_HEIGHT = 128;
const MUTED = '#a0a0a0';
const font = (size: number, weight: number) => `${weight} ${size}px Inter, system-ui, -apple-system, "Segoe UI", sans-serif`;

// Cuts text to maxWidth with a trailing ellipsis (uses the current ctx.font)
function ellipsize(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let cut = text;
  while (cut && ctx.measureText(`${cut}…`).width > maxWidth) cut = cut.slice(0, -1);
  return `${cut.trimEnd()}…`;
}

// Result card as a square PNG: from start to goal, then score, time and clicks
function drawResult(game: PreviousGame): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.resolve(null);
  const lang = game.language;

  // Draws segments of one line left to right
  const line = (y: number, size: number, weight: number, segments: [string, string][]) => {
    ctx.font = font(size, weight);
    let x = LEFT;
    for (const [text, color] of segments) {
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      x += ctx.measureText(text).width;
    }
  };
  const title = (text: string, y: number) => {
    ctx.font = font(72, 700);
    line(y, 72, 700, [[ellipsize(ctx, text, MAX_WIDTH), '#fff']]);
  };

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, SIZE, SIZE);

  ctx.save();
  ctx.translate(LEFT - 4, 90);
  ctx.scale(LOGO_WIDTH / 80, LOGO_HEIGHT / 40);
  ctx.fillStyle = '#fff';
  ctx.fill(new Path2D(logoPaths.p29e44d00), 'evenodd');
  ctx.restore();

  ctx.textAlign = 'left';
  line(295, 44, 400, [[getTranslation(lang, 'shareFrom'), MUTED]]);
  title(game.start, 375);
  line(480, 44, 400, [[getTranslation(lang, 'shareTo'), MUTED]]);
  title(game.end, 560);

  const stats = `${game.time}  ·  ${clicksLabel(lang, game.clicks)}`;
  line(665, 44, 600, game.score !== undefined
    ? [[pointsLabel(lang, game.score), SCORE_COLOR], [`  ·  ${stats}`, '#fff']]
    : [[stats, '#fff']]);

  line(885, 44, 400, [[`${getTranslation(lang, 'shareBeat')} `, MUTED], ['wikirunner.ru', '#fff']]);

  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}

// Shares the result card and a challenge link; copies the text where sharing is unavailable
export async function shareResult(game: PreviousGame, language: Language): Promise<'shared' | 'copied' | 'cancelled'> {
  const url = `${location.origin}${location.pathname}#${gamePath(game.start, game.end, game.language)}`;
  const text = `${getTranslation(language, 'shareText')} ${url}`;
  const blob = await drawResult(game);
  const files = blob ? [new File([blob], 'wikirunner.png', { type: 'image/png' })] : [];

  try {
    if (files.length && navigator.canShare?.({ files })) {
      await navigator.share({ files, text });
      return 'shared';
    }
    if (navigator.share) {
      await navigator.share({ text });
      return 'shared';
    }
  } catch (error) {
    if ((error as Error).name === 'AbortError') return 'cancelled'; // user closed the share sheet
  }

  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'cancelled';
  }
}
