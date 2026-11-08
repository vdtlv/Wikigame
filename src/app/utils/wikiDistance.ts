// Shortest click distance between Wikipedia articles, via the public API.

type Dir = 'links' | 'linkshere';
type Options = {
  only?: string[]; // keep only links pointing into this set
  via?: boolean; // look at the links of the pages that `titles` link to (one hop further)
  limit?: number; // stop paginating once this many titles are found
};
export type Fetcher = (titles: string[], dir: Dir, signal: AbortSignal, options?: Options) => Promise<string[]>;

const BATCH = 50; // API max titles per request
const BACK_CAP = 1000; // targets with more backlinks are hubs
const TIME_BUDGET_MS = 10000;

const chunks = <T,>(items: T[], size: number) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, i * size + size));

export function wikiNeighbours(language: string): Fetcher {
  return async (titles, dir, signal, { only, via, limit = Infinity } = {}) => {
    const out = new Set<string>();
    const p = dir === 'links' ? 'pl' : 'lh';
    // Requests run one after another: parallel bursts get HTTP 429 from Wikimedia.
    for (const t of chunks(titles, BATCH)) {
      for (const o of only ? chunks(only, BATCH) : [undefined]) {
        let cont: Record<string, string> = {};
        do {
          const params = new URLSearchParams({
            action: 'query', format: 'json', formatversion: '2', origin: '*', redirects: '1',
            prop: dir, titles: t.join('|'), [`${p}namespace`]: '0', [`${p}limit`]: 'max',
            ...(via && { generator: 'links', gplnamespace: '0', gpllimit: 'max' }),
            ...(o && { pltitles: o.join('|') }),
            ...(dir === 'linkshere' && { lhshow: '!redirect' }),
            ...cont,
          });
          const res = await fetch(`https://${language}.wikipedia.org/w/api.php?${params}`, { signal });
          const data = await res.json();
          if (!res.ok || data.error) throw new Error(data.error?.info ?? `Wikipedia API ${res.status}`);
          for (const page of data.query?.pages ?? []) for (const l of page[dir] ?? []) out.add(l.title);
          cont = data.continue ?? {};
          if (out.size >= limit) return [...out];
        } while (cont.continue);
      }
    }
    return [...out];
  };
}

// shortcut: answers only up to 3 clicks (2 for hub targets), null beyond; upgrade to a precomputed graph (e.g. WikiGameSolver) for exact long paths.
// shortcut: redirects to the target and navbox links the game strips are not special-cased, so the answer can be off by one.
export function createDistanceFinder(target: string, fetchNeighbours: Fetcher, backCap = BACK_CAP) {
  let backlinks: Set<string> | null | undefined; // pages linking to the target; null when the target is a hub

  async function search(start: string, signal: AbortSignal): Promise<number | null> {
    if (start === target) return 0;
    const hasLink = async (only: string[], via: boolean) =>
      (await fetchNeighbours([start], 'links', signal, { only, via, limit: 1 })).length > 0;

    if (backlinks === undefined) {
      const found = await fetchNeighbours([target], 'linkshere', signal, { limit: backCap });
      backlinks = found.length < backCap ? new Set(found) : null;
    }
    if (!backlinks) {
      if (await hasLink([target], false)) return 1;
      return (await hasLink([target], true)) ? 2 : null;
    }
    if (backlinks.has(start)) return 1;
    if ((await fetchNeighbours([start], 'links', signal)).some(t => backlinks!.has(t))) return 2;
    return backlinks.size && (await hasLink([...backlinks], true)) ? 3 : null;
  }

  // Queries run one at a time so the backlinks fetch is shared; null on abort, timeout or error.
  let last: Promise<unknown> = Promise.resolve();
  return (start: string, signal: AbortSignal): Promise<number | null> => {
    const run = last.then(() => search(start, AbortSignal.any([signal, AbortSignal.timeout(TIME_BUDGET_MS)]))).catch(() => null);
    last = run;
    return run;
  };
}
