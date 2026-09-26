// Brute-force solver: for every level and every allowed replacement word,
// BFS over player inputs (4 moves + wait) to find whether the level is
// solvable. Fails if the result differs from the level's declared solutions.
//
//   npm test

import { loadLevels } from './loadLevels';
import { solveEveryWord } from '../src/systems/Solver';

let failed = false;
for (const level of await loadLevels()) {
  const results = solveEveryWord(level);
  const found = results.filter((r) => r.steps !== null).map((r) => r.word);
  const expected = [...level.solutions].sort().join(',');
  const got = [...found].sort().join(',');
  const ok = expected === got;
  if (!ok) failed = true;
  console.log(`${ok ? 'PASS' : 'FAIL'} Level ${level.id} ${level.name}: expected [${expected}] got [${got}]`);
  console.log(results.map((r) => `   ${r.word.padEnd(7)} ${r.steps === null ? 'unsolvable' : `solved in ${r.steps} turns`}`).join('\n'));
}
process.exit(failed ? 1 : 0);
