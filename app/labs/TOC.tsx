"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TOC() {
  const pathname = usePathname();
  return (
    <nav className="nav nav-pills flex-column">
      <Link
        href="/labs"
        id="wd-home-link"
        className={`nav-link ${pathname === "/labs" ? "active" : ""}`}
      >
        Home
      </Link>
      <Link
        href="/labs/lab1"
        id="wd-lab1-link"
        className={`nav-link ${pathname.includes("lab1") ? "active" : ""}`}
      >
        Lab 1
      </Link>
      <Link
        href="/labs/lab2"
        id="wd-lab2-link"
        className={`nav-link ${pathname === "/labs/lab2" ? "active" : ""}`}
      >
        Lab 2
      </Link>
      <Link
        href="/labs/lab2/tailwind"
        id="wd-lab2-tailwind-link"
        className={`nav-link ${pathname.includes("tailwind") ? "active" : ""}`}
      >
        Lab 2 Tailwind
      </Link>
      <Link
        href="/labs/lab3"
        id="wd-lab3-link"
        className={`nav-link ${pathname.includes("lab3") ? "active" : ""}`}
      >
        Lab 3
      </Link>
      <Link
        href="/labs/lab4"
        id="wd-lab4-link"
        className={`nav-link ${pathname.includes("lab4") ? "active" : ""}`}
      >
        Lab 4
      </Link>
      <Link
        href="/labs/lab5"
        id="wd-lab5-link"
        className={`nav-link ${pathname.includes("lab5") ? "active" : ""}`}
      >
        Lab 5
      </Link>
      <Link href="/" id="wd-kambaz-link" className="nav-link">
        Kambaz
      </Link>
      <a
        href="https://github.com/shubhthorat/kambaz-next-js"
        id="wd-github-link"
        className="nav-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub Repository
      </a>
    </nav>
  );
}
