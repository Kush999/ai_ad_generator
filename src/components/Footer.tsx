"use client";

import Link from "next/link";
import { useMemo } from "react";

export default function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-secondary)]/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            © {year} AdCraft Studio. All rights reserved.
          </p>
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/" className="text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors">
              Dashboard
            </Link>
            <Link href="/" className="text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors">
              Privacy
            </Link>
            <Link href="/" className="text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
