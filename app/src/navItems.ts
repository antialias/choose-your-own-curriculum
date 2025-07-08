export interface NavItem {
  href: string;
  label: string;
  countKey?: 'students' | 'curriculums';
}

export const navItems: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/students', label: 'Students', countKey: 'students' },
  { href: '/topic-dags', label: 'My Curriculums', countKey: 'curriculums' },
  { href: '/curriculum-generator', label: 'Curriculum Generator' },
  { href: '/uploaded-work', label: 'Uploaded Work' },
];
