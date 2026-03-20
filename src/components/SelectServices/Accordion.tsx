import {
  useEffect,
  useRef,
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
  defaultOpenIds?: string;
};

const TOP_OFFSET = 0;

const Accordion = ({ items, defaultOpenIds = '' }: AccordionProps) => {
  const [openId, setOpenId] = useState<string | null>(defaultOpenIds);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (!openId) return;

    const node = itemRefs.current[openId];
    if (!node) return;

    const timer = window.setTimeout(() => {
      const top = node.getBoundingClientRect().top + window.scrollY - TOP_OFFSET;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }, 200);

    return () => window.clearTimeout(timer);
  }, [openId]);

  return (
    <>
    <div className='text-[var(--color-icon)] text-[14px] mb-[var(--space-md)]'>👉 Můžete vybrat více služeb</div>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() => toggle(item.id)}
          setRef={(el) => {
            itemRefs.current[item.id] = el;
          }}
        />
      ))}
    </>
  );
};

export default Accordion;