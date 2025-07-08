import Link from 'next/link';
import { css } from '@/styled-system/css';

export type HomeCardProps = {
  href: string;
  label: string;
};

export function HomeCard({ href, label }: HomeCardProps) {
  return (
    <Link
      href={href}
      className={css({
        display: 'block',
        padding: '4',
        borderRadius: 'lg',
        background: 'blue.50',
        color: 'blue.900',
        textDecoration: 'none',
        fontWeight: 'medium',
        shadow: 'sm',
        _hover: { background: 'blue.100' },
      })}
    >
      {label}
    </Link>
  );
}
