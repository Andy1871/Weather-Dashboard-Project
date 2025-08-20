"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HomeButton from "@/components/HomeButton";

function titleCase(slug: string) {
  return decodeURIComponent(slug)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null; // no breadcrumbs on home

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((seg, i) => ({
    href: "/" + segments.slice(0, i + 1).join("/"),
    label: titleCase(seg),
  }));

  return (
    <nav aria-label="Breadcrumb" className="text-sm mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-gray-200">
        <li className="flex items-center">
          <HomeButton />
        </li>

        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1">
            <span aria-hidden="true">/</span>
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className="font-medium text-white">
                {c.label}
              </span>
            ) : (
              <Link href={c.href} className="hover:underline">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
