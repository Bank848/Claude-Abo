import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimateTokens } from '../src/tokens.mjs';

test('ascii is chars/4', () => assert.equal(estimateTokens('a'.repeat(400)), 100));
test('thai is chars/1.5', () => assert.equal(estimateTokens('ก'.repeat(30)), 20));
test('empty is 0', () => assert.equal(estimateTokens(''), 0));
test('mixed text sums both parts and rounds up', () => assert.equal(estimateTokens('a'.repeat(4) + 'ก'.repeat(3)), 3));
