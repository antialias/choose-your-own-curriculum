export interface NavItem {
  key: string;
  href: string;
  label: string;
}

export const navItems: NavItem[] = [
  { key: 'students', href: '/students', label: 'Students' },
  { key: 'curriculums', href: '/topic-dags', label: 'Curriculums' },
  { key: 'upload-work', href: '/uploaded-work', label: 'Upload Work' },
];
