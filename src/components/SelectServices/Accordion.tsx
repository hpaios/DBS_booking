import {
  useState,
  type ReactNode
} from "react";
import AccordionItem from './AccordionItem'

type AccordionItemType = {
  id: string;
  title: ReactNode;
  content: ReactNode;
  isActive: boolean;
  selectedCount: number;
};

type AccordionProps = {
  items: AccordionItemType[];
  defaultOpenIds?: string[];
};

const Accordion = ({ items, defaultOpenIds = [] }: AccordionProps) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  return (
    <>
    <div className='text-[var(--color-icon)] text-[14px] mb-[var(--space-md)]'>👉 Můžete vybrat více služeb</div>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={openIds.includes(item.id)}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </>
  );
};

export default Accordion;