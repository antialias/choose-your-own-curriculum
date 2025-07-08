export interface NavItem {
  key: string;
  href: string;
  label: string;
  description: string;
}

export const navItems: NavItem[] = [
  {
    key: "students",
    href: "/students",
    label: "Students",
    description: "Manage your students",
  },
  {
    key: "curriculums",
    href: "/topic-dags",
    label: "Curriculums",
    description: "Design and browse curriculums",
  },
  {
    key: "upload-work",
    href: "/uploaded-work",
    label: "Upload Work",
    description: "Add assignments and notes",
  },
];
