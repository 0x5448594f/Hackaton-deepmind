import type { LevelDefinition } from './defineLevel';

// Turns an edited level back into the source of a `definitions/NN-slug.ts` file.
// Shared by the in-browser level editor and the dev server that writes the file.

export function slugify(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return slug || 'level';
}

export function levelFileName(rank: number, name: string): string {
  return `${String(rank).padStart(2, '0')}-${slugify(name)}.ts`;
}

/** `definitions/NN-slug.ts` — the only names the dev server will write. */
export const LEVEL_FILE_NAME = /^\d{1,3}-[a-z0-9-]+\.ts$/;

/** Dev-server route that writes a level file (see tools/levelWriterPlugin.ts). */
export const SAVE_ENDPOINT = '/__level-editor/save';

const quote = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const list = (items: string[]) => `[${items.map(quote).join(', ')}]`;

export function levelFileSource(def: LevelDefinition): string {
  const lines: string[] = [
    "import { defineLevel } from '../defineLevel';",
    '',
    'export default defineLevel({',
    `  name: ${quote(def.name)},`,
    '  map: [',
    ...def.map.map((row) => `    ${quote(row)},`),
    '  ],',
    '  rules: [',
  ];

  for (const rule of def.rules) {
    const fields = [`subject: ${quote(rule.subject)}`, `verb: ${quote(rule.verb)}`];
    if (rule.object) fields.push(`object: ${quote(rule.object)}`);
    if (rule.condition) fields.push(`condition: ${quote(rule.condition)}`);
    lines.push('    {');
    lines.push(`      ${fields.join(', ')},`);
    if (rule.editablePart) {
      lines.push(`      editablePart: ${quote(rule.editablePart)}, allowedReplacements: ${list(rule.allowedReplacements ?? [])},`);
    }
    lines.push('    },');
  }

  lines.push('  ],');
  lines.push(`  solutions: ${list(def.solutions)},`);
  if (def.hintWords?.length) lines.push(`  hintWords: ${list(def.hintWords)},`);
  if (def.tutorial) lines.push('  tutorial: true,');
  lines.push('});');
  return lines.join('\n') + '\n';
}
