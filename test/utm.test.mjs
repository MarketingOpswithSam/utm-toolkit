import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const run = (...args) => spawnSync('node', ['utm.mjs', ...args], { encoding: 'utf8' });

test('build lowercases and hyphenates', () => {
  const r = run('build', '--url', 'https://example.com/x', '--source', 'LinkedIn', '--medium', 'social', '--campaign', '2026 10 launch');
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), 'https://example.com/x?utm_source=linkedin&utm_medium=social&utm_campaign=2026-10-launch');
});

test('build refuses a medium outside the approved list', () => {
  const r = run('build', '--url', 'https://example.com/x', '--source', 'a', '--medium', 'banana', '--campaign', 'c');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /approved list/);
});

test('check flags capitals and missing params', () => {
  const r = run('check', 'https://example.com/?utm_source=Email');
  assert.equal(r.status, 1);
  assert.match(r.stdout, /capitals/);
  assert.match(r.stdout, /utm_medium is missing/);
});

test('check passes a clean link', () => {
  const r = run('check', 'https://example.com/?utm_source=newsletter&utm_medium=email&utm_campaign=2026-10-digest');
  assert.equal(r.status, 0);
});
