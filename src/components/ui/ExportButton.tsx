"use client";

interface ExportButtonProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ExportButton({
  label = "Export Memo",
  onClick,
  disabled,
}: ExportButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.print();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-sans font-medium uppercase tracking-wider border border-structure text-structure hover:bg-structure hover:text-surface-elevated transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
      {label}
    </button>
  );
}
