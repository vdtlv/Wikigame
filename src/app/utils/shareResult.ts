import type { Language } from '../App';
import { clicksLabel, getTranslation } from '../translations';
import type { PreviousGame } from './previousGames';
import logoPaths from '../imports/svg-3h6239ug75';

export const SCORE_COLOR = '#fbbf24';

// Shareable link: #/game?start=…&end=…&lang=…
export const gamePath = (start: string, end: string, language: Language) =>
  `/game?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&lang=${language}`;

const WIDTH = 1200;
const HEIGHT = 630;
const LOGO_WIDTH = 72; // Logo.tsx draws the same path in an 80×40 box
const LOGO_HEIGHT = 36;
const font = (size: number, weight: number) => `${weight} ${size}px Inter, system-ui, -apple-system, "Segoe UI", sans-serif`;

// Result card as a PNG: start → goal, score, clicks and time
function drawResult(game: PreviousGame, language: Language): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.resolve(null);

  const line = (text: string, y: number, size: number, color: string, weight = 600) => {
    // Shrink long article titles to fit, then let fillText squeeze the rest
    while (size > 28 && (ctx.font = font(size, weight), ctx.measureText(text).width > WIDTH - 160)) size -= 4;
    ctx.font = font(size, weight);
    ctx.fillStyle = color;
    ctx.fillText(text, WIDTH / 2, y, WIDTH - 160);
  };

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Header: the logo alone, centred
  ctx.save();
  ctx.translate((WIDTH - LOGO_WIDTH) / 2, 68);
  ctx.scale(LOGO_WIDTH / 80, LOGO_HEIGHT / 40);
  ctx.fillStyle = '#fff';
  ctx.fill(new Path2D(logoPaths.p29e44d00), 'evenodd');
  ctx.restore();

  ctx.textAlign = 'center';
  line(game.start, 200, 60, '#fff');
  line('↓', 265, 40, '#5a5a5a', 400);
  line(game.end, 340, 60, '#fff');
  if (game.score !== undefined) line(`${getTranslation(language, 'score')}: ${game.score}`, 440, 60, SCORE_COLOR);
  line(`${clicksLabel(language, game.clicks)} · ${game.time}`, 505, 34, '#bdbdbd', 400);

  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}

// Shares the result card and a challenge link; copies the text where sharing is unavailable
export async function shareResult(game: PreviousGame, language: Language): Promise<'shared' | 'copied' | 'cancelled'> {
  const url = `${location.origin}${location.pathname}#${gamePath(game.start, game.end, game.language)}`;
  const text = `${getTranslation(language, 'shareText')} ${url}`;
  const blob = await drawResult(game, language);
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
