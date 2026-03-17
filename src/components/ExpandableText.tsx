import { useState } from "react";
import ArrowLeft from '../icons/ArrowLeft'

export const ExpandableText = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex items-start gap-2 my-[var(--space-sm)]">
      <p
        className={`m-0 flex-1 text-[var(--color-border)] text-[14px] ${
          expanded ? "whitespace-normal" : "truncate whitespace-nowrap"
        }`}
      >
        {text}
      </p>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setExpanded(prev => !prev)
        }}
        className="shrink-0 cursor-pointer text-[var(--color-icon)]"
        aria-label={expanded ? "Hide" : "Show"}
      >
         <ArrowLeft width={16} height={16} className={`text-[var(--color-border)] ${
            expanded ? "rotate-90" : "-rotate-90"
          }`} />
      </button>
    </div>
  );
};