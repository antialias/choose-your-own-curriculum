import Link from "next/link";
import { css } from "@/styled-system/css";

export type HomeCardProps = {
  href: string;
  label: string;
  description: string;
};

export function HomeCard({ href, label, description }: HomeCardProps) {
  return (
    <Link
      href={href}
      className={css({
        display: "block",
        bg: "gray.50",
        borderRadius: "lg",
        padding: "5",
        shadow: "sm",
        transition: "background-color 0.2s",
        _hover: { bg: "gray.100" },
      })}
    >
      <h2 className={css({ fontSize: "xl", fontWeight: "bold", mb: "2" })}>
        {label}
      </h2>
      <p className={css({ color: "gray.600" })}>{description}</p>
    </Link>
  );
}
