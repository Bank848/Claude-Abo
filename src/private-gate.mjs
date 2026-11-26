// The privacy gate relies on a local pre-push hook; fail early when it is not enabled.
import { execFileSync } from 'node:child_process';

export function checkHooksPath({ root, env = process.env }) {
  if (env.CI) return [];
  let value = '';
  try {
    value = execFileSync('git', ['config', 'core.hooksPath'], { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    value = '';
  }
  if (value === '.githooks') return [];
  return [{
    file: '.githooks/pre-push', line: 1, rule: 'private-gate', severity: 'error',
    message: 'git core.hooksPath is not .githooks; run: git config core.hooksPath .githooks',
  }];
}
