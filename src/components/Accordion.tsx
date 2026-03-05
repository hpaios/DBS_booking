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
    <div className="w-full">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={openIds.includes(item.id)}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </div>
  );
};

export default Accordion;