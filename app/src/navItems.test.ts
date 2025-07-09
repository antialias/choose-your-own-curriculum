import { describe, it, expect } from 'vitest';
import { navItems } from './navItems';

describe('navItems', () => {
  it('contains expected navigation links', () => {
    expect(navItems).toHaveLength(3);
    expect(navItems[0]).toEqual({ key: 'students', href: '/students', label: 'students' });
    expect(navItems[1]).toEqual({ key: 'curriculums', href: '/topic-dags', label: 'curriculums' });
    expect(navItems[2]).toEqual({ key: 'upload-work', href: '/uploaded-work', label: 'uploadWork' });
  });
});
