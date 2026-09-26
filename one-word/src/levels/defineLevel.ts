import type { RuleDefinition } from '../rules/RuleDefinition';
import { parseMap, type LevelData } from './LevelData';

export interface LevelDefinition {
  /** Shown next to the level number, e.g. `LEVEL 3 · PRESSURE`. */
  name: string;
  /**
   * ASCII map. Legend:
   *   # wall   . floor   R red   B blue   E exit   _ pressure plate
   *   P player G guard   K key   D door
   */
  map: string[];
  /** All rules of the level; exactly one has an editable word. */
  rules: RuleDefinition[];
  /** Replacement tokens that solve the level (verified by `npm test`). */
  solutions: string[];
  /** Example words shown when the player types something the world doesn't understand. */
  hintWords?: string[];
  tutorial?: boolean;
}

/** Identity helper: gives level files type-checking and autocomplete. */
export function defineLevel(definition: LevelDefinition): LevelDefinition {
  return definition;
}

export function buildLevel(definition: LevelDefinition, id: number): LevelData {
  const { map, ...rest } = definition;
  return { id, ...rest, ...parseMap(map) };
}
