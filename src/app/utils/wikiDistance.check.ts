// Self-check: node src/app/utils/wikiDistance.check.ts
import assert from 'node:assert/strict';
import { createDistanceFinder, type Fetcher } from './wikiDistance.ts';

const graph: Record<string, string[]> = {
  S: ['A', 'B'], A: ['C'], B: ['D'], C: ['T'], D: ['E'], E: ['T'], T: ['S'], X: [], F: ['S'],
};

const links = (t: string) => graph[t] ?? [];
const fake: Fetcher = async (titles, dir, signal, { only, via, limit = Infinity } = {}) => {
  signal.throwIfAborted();
  const from = via ? titles.flatMap(links) : titles;
  const out = dir === 'links'
    ? from.flatMap(links)
    : Object.keys(graph).filter(p => titles.some(t => links(p).includes(t)));
  return [...new Set(out)].filter(x => !only || only.includes(x)).slice(0, limit);
};

const signal = new AbortController().signal;
const cases: [number, Record<string, number | null>][] = [
  [5000, { T: 0, C: 1, E: 1, A: 2, D: 2, S: 3, B: 3, F: null, X: null }],
  [1, { T: 0, C: 1, E: 1, A: 2, D: 2, S: null, X: null }], // hub target: only up to 2 clicks
];
for (const [backCap, expected] of cases) {
  const distanceFrom = createDistanceFinder('T', fake, backCap);
  for (const [start, d] of Object.entries(expected)) {
    assert.equal(await distanceFrom(start, signal), d, `${start} -> T (backCap ${backCap})`);
  }
}

const aborted = new AbortController();
aborted.abort();
assert.equal(await createDistanceFinder('T', fake)('S', aborted.signal), null, 'aborted search gives null');

console.log('wikiDistance: ok');
