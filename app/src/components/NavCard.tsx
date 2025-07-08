import Link from "next/link";
import { css } from "@/styled-system/css";

export interface NavCardProps {
  href: string;
  label: string;
  count?: number;
}

export function NavCard({ href, label, count }: NavCardProps) {
  return (
    <Link
      href={href}
      className={css({
        display: "block",
        padding: "4",
        borderRadius: "lg",
        bg: { base: "blue.500", _hover: "blue.600" },
        color: "white",
        textAlign: "center",
        textDecoration: "none",
      })}
    >
      <span className={css({ fontSize: "xl", fontWeight: "bold" })}>{label}</span>
      {count !== undefined && (
        <span className={css({ display: "block", fontSize: "sm", mt: "1" })}>
          {count}
        </span>
      )}
    </Link>
  );
}
