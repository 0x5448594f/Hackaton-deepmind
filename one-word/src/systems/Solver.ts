import type { LevelData, Pos } from '../levels/LevelData';
import type { RuleDefinition } from '../rules/RuleDefinition';
import { withReplacement } from '../rules/RuleParser';
import { DIRS } from './Pathfinding';
import { World } from './World';

// Brute-force solver shared by `npm test` and the level editor: BFS over player
// inputs (4 moves + wait) to find whether a level is solvable under a rule set.

const ACTIONS: (Pos | null)[] = [...DIRS, null];

/** Turns to reach the exit, or null if unsolvable within the search budget. */
export function solve(world: World, maxStates = 200_000): number | null {
  const seen = new Set([world.key()]);
  let frontier = [world];
  for (let depth = 1; depth < 200 && frontier.length; depth++) {
    const next: World[] = [];
    for (const w of frontier) {
      for (const a of ACTIONS) {
        const c = w.clone();
        const ev = c.step(a);
        if (!ev.length || c.s.dead) continue;
        if (c.s.won) return depth;
        const k = c.key();
        if (seen.has(k)) continue;
        seen.add(k);
        if (seen.size > maxStates) return null;
        next.push(c);
      }
    }
    frontier = next;
  }
  return null;
}

export interface WordResult {
  word: string;
  steps: number | null;
}

/** Solves the level once per allowed replacement of its editable word. */
export function solveEveryWord(level: LevelData, maxStates?: number): WordResult[] {
  const editable = level.rules.find((r) => r.editablePart);
  if (!editable) throw new Error(`level ${level.id} ${level.name} has no editable rule`);
  return (editable.allowedReplacements ?? []).map((word) => {
    const rules: RuleDefinition[] = level.rules.map((r) => (r === editable ? withReplacement(r, word) : r));
    return { word, steps: solve(new World(level, rules), maxStates) };
  });
}
