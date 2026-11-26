import manifestCheck from '../checks/manifest.mjs';

export default async function validate() {
  const findings = await manifestCheck(process.cwd());
  for (const f of findings) process.stdout.write(`${f.severity} ${f.rule} ${f.message}\n`);
  return findings.some((f) => f.severity === 'error') ? 1 : 0;
}
