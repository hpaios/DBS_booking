import type { ReactNode } from "react";
import ArrowLeft from '../../icons/ArrowLeft'


type AccordionItemProps = {
  item: {
    id: string;
    title: ReactNode;
    content: ReactNode;
    isActive: boolean;
  };
  isOpen: boolean;
  onToggle: () => void;
};

const AccordionItem = ({ item, isOpen, onToggle }: AccordionItemProps) => {
  return (
    <div className={`rounded mb-[var(--space-lg)] transition`}
        >
      <button
        onClick={onToggle}
        className={`w-full flex justify-between items-center p-4 text-left bg-[var(--color-bg-secondary)] text-[var(--color-icon)] border-[var(--color-border)] border-1 p-[var(--space-sm)] rounded-[var(--radius-sm)] cursor-pointer ${
            item.isActive
              ? "border-[var(--color-primary)]"
              : "border-[var(--color-border)]"
          }`}
      >
        <span>{item.title}</span>
        <span
          className={`transition-transform duration-300 flex w-[40px] rounded-full h-[40px] border border-[var(--color-border)] justify-center items-center cursor-pointer`}
        >
          <ArrowLeft width={16} height={16} className={`text-[var(--color-icon)] ${
            isOpen ? "rotate-90" : "-rotate-90"
          }`} />
        </span>
      </button>

      <div
        className={`
          grid transition-all duration-300 ease-in-out
          ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="overflow-hidden">
          <div className="p-4 p-[var(--space-sm)]">
            <span className="p-[var(--space-sm)]">{item.content}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;