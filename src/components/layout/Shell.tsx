"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchDialog } from "@/components/ui/SearchDialog";

interface ShellProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/room", label: "Room" },
  { href: "/review", label: "Review" },
  { href: "/controls", label: "Controls" },
  { href: "/evidence", label: "Evidence" },
  { href: "/checklist", label: "Checklist" },
  { href: "/memo", label: "Memo" },
  { href: "/evals", label: "Evals" },
  { href: "/architecture", label: "Architecture" },
  { href: "/about", label: "About" },
];

export function Shell({ children }: ShellProps) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut: Cmd+K or Ctrl+K to open search
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="border-b border-rule bg-surface-elevated no-print">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-structure text-surface-elevated flex items-center justify-center text-xs md:text-sm font-medium">
              B
            </div>
            <div>
              <div className="text-xs md:text-sm font-medium text-structure">
                Beacon
              </div>
              <div className="hidden sm:block font-sans text-2xs text-structure-muted uppercase tracking-wider">
                Diligence & Compliance Analyst
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2 py-1 border border-rule hover:border-rule-strong font-sans text-2xs text-structure-muted transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              Search
              <span className="font-mono text-2xs opacity-50">⌘K</span>
            </button>
            <div className="font-sans text-2xs text-structure-muted px-2 py-1 bg-status-partial/10 text-status-partial border border-status-partial/20">
              SYNTHETIC DEMO
            </div>
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-1.5 border border-rule hover:border-rule-strong"
              aria-label="Toggle navigation"
            >
              <svg
                className="w-4 h-4 text-structure"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                {mobileNavOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 9h16.5m-16.5 6.75h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Desktop navigation */}
      <nav className="hidden md:block border-b border-rule bg-surface-elevated no-print">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname?.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2.5 font-sans text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-structure border-b-2 border-structure -mb-px"
                      : "text-structure-muted hover:text-structure-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile navigation */}
      {mobileNavOpen && (
        <div className="md:hidden border-b border-rule bg-surface-elevated no-print">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname?.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`block px-3 py-2 font-sans text-xs uppercase tracking-wider transition-colors ${
                    isActive
                      ? "text-structure bg-surface-sunken"
                      : "text-structure-muted hover:text-structure-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-rule bg-surface-sunken no-print">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="font-sans text-2xs text-structure-muted">
              Beacon — Diligence & Compliance Analyst · Synthetic Demo
            </div>
            <div className="font-sans text-2xs text-structure-muted">
              Not legal advice · Not a compliance certification
            </div>
          </div>
        </div>
      </footer>

      {/* Search dialog */}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
