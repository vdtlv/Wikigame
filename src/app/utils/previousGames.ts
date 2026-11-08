import type { Language } from '../App';

export interface PreviousGame {
  start: string;
  end: string;
  language: Language;
  clicks: number;
  time: string; // formatted like the in-game timer
  won: boolean;
}

const KEY = 'wikirunner.previousGames';
const MAX_STORED = 20;
const MAX_SHOWN = 5;

export function loadPreviousGames(language: Language): PreviousGame[] {
  try {
    const games: PreviousGame[] = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    const seen = new Set<string>();
    return games.filter(g => {
      const pair = `${g.start}\n${g.end}`;
      if (g.language !== language || seen.has(pair)) return false;
      seen.add(pair);
      return true;
    }).slice(0, MAX_SHOWN);
  } catch {
    return [];
  }
}

export function savePreviousGame(game: PreviousGame) {
  try {
    const games: PreviousGame[] = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    // A replayed pair keeps only its latest result
    const others = games.filter(g => g.start !== game.start || g.end !== game.end || g.language !== game.language);
    localStorage.setItem(KEY, JSON.stringify([game, ...others].slice(0, MAX_STORED)));
  } catch {
    // storage unavailable (private mode, quota): history is optional
  }
}
