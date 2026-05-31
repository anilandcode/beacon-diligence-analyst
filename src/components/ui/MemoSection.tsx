import type { Evidence } from "@/lib/domain/types";
import { CitationRef } from "./CitationRef";

interface MemoSectionProps {
  title: string;
  content: string;
  evidenceMap: Map<string, { evidence: Evidence; index: number }>;
}

export function MemoSection({ title, content, evidenceMap }: MemoSectionProps) {
  // Parse content for citation markers like [1], [2], etc.
  // and replace them with CitationRef components
  const renderContent = () => {
    const parts = content.split(/(\[\d+\])/g);

    return parts.map((part, i) => {
      const match = part.match(/^\[(\d+)\]$/);
      if (match) {
        const index = parseInt(match[1], 10);
        // Find evidence by index
        const entry = Array.from(evidenceMap.values()).find(
          (e) => e.index === index
        );
        if (entry) {
          return <CitationRef key={i} index={index} evidence={entry.evidence} />;
        }
        // Fallback for unmatched citations
        return (
          <sup key={i} className="font-sans text-2xs text-structure-muted">
            [{index}]
          </sup>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <section className="mb-8">
      <h2 className="text-lg font-medium text-structure mb-4 pb-2 border-b border-rule">
        {title}
      </h2>
      <div className="text-sm text-structure-secondary leading-relaxed space-y-4">
        {renderContent()}
      </div>
    </section>
  );
}
