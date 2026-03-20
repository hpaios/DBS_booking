import { useEffect, useRef, useState } from "react";
import ArrowLeft from '../../icons/ArrowLeft'

type AccordionItemProps = {
  item: {
    id?: string;
    title: React.ReactNode;
    content: React.ReactNode;
    isActive: boolean;
    selectedCount: number;
  };
  isOpen: boolean;
  onToggle: () => void;
  setRef?: (el: HTMLDivElement | null) => void;
};

const TOP_OFFSET = 0;

const AccordionItem = ({ item, isOpen, onToggle, setRef }: AccordionItemProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (!isOpen || !sentinelRef.current) return;

    const node = sentinelRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPinned(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: `${-TOP_OFFSET}px 0px 0px 0px`,
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isOpen]);

  const stickyEnabled = isOpen && isPinned;

  return (
    <div ref={setRef} className="mb-[var(--space-lg)]">
      <div ref={sentinelRef} className="h-px w-full" />

      <button
        onClick={onToggle}
        style={stickyEnabled ? { top: `${TOP_OFFSET}px` } : undefined}
        className={`w-full flex justify-between items-center text-left bg-[var(--color-bg-secondary)] text-[var(--color-icon)] border py-[var(--space-sm)] px-[var(--space-lg)] rounded-[var(--radius-lg)] cursor-pointer font-semibold font-sans ${
          item.isActive
            ? "border-[var(--color-icon)]"
            : "border-[var(--color-gray)]"
        } ${stickyEnabled ? "sticky z-20" : ""}`}
      >
        <span>
          {item.title} {item.selectedCount > 0 ? `(${item.selectedCount})` : ""}
        </span>

        <span
          className={`transition-transform duration-300 flex w-[40px] h-[40px] rounded-full border justify-center items-center ${
            item.isActive
              ? "border-[var(--color-icon)]"
              : "border-[var(--color-gray)]"
          }`}
        >
          <ArrowLeft
            width={16}
            height={16}
            className={`text-[var(--color-icon)] transition-transform duration-300 ${
              isOpen ? "rotate-90" : "-rotate-90"
            }`}
          />
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[calc(100vh-80px)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-h-[calc(100vh-80px)] overflow-y-auto pt-2">
          <div className="p-[var(--space-sm)]">{item.content}</div>
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
