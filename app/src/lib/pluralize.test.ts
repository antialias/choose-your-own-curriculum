import { describe, it, expect } from 'vitest';
import { pluralize } from './pluralize';

describe('pluralize', () => {
  it('defaults to adding s for plural', () => {
    expect(pluralize(1, 'cat')).toBe('1 cat');
    expect(pluralize(2, 'cat')).toBe('2 cats');
  });

  it('supports custom plural forms', () => {
    expect(pluralize(0, 'child', 'children')).toBe('0 children');
    expect(pluralize(1, 'child', 'children')).toBe('1 child');
    expect(pluralize(5, 'child', 'children')).toBe('5 children');
  });
});
