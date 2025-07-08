export interface NavItem {
  key: string;
  href: string;
  label: string;
}

export const navItems: NavItem[] = [
  { key: 'students', href: '/students', label: 'students' },
  { key: 'curriculums', href: '/topic-dags', label: 'curriculums' },
  { key: 'upload-work', href: '/uploaded-work', label: 'uploadWork' },
];
