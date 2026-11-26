// Fails if a private local file is tracked by git.
import { execFileSync } from 'node:child_process';

const PRIVATE = [/^\.public-denylist\.txt$/, /^\.abo-local\.json$/, /^\.claude-[^/]*-journal\.md$/];

export default async function noPrivateFiles(root) {
  let tracked = [];
  try {
    tracked = execFileSync('git', ['ls-files', '--cached'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
  } catch {
    return [];
  }
  return tracked
    .filter((f) => PRIVATE.some((re) => re.test(f)))
    .map((f) => ({ file: f, line: 1, rule: 'no-private-files', severity: 'error', message: 'private local file is tracked by git' }));
}
