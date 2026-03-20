import type { ReactNode } from "react";
import ArrowLeft from '../../icons/ArrowLeft'


type AccordionItemProps = {
  item: {
    id: string;
    title: ReactNode;
    content: ReactNode;
    isActive: boolean;
    selectedCount: number;
  };
  isOpen: boolean;
  onToggle: () => void;
};

// const AccordionItem = ({ item, isOpen, onToggle }: AccordionItemProps) => {
//   return (
//     <div className={`rounded mb-[var(--space-lg)] transition`}
//         >
//       <button
//         onClick={onToggle}
//         className={`w-full flex justify-between items-center text-left bg-[var(--color-bg-secondary)] text-[var(--color-icon)] border-[var(--color-border)] border-1 py-[var(--space-sm)] px-[var(--space-lg)] rounded-[var(--radius-lg)] cursor-pointer font-semibold font-sans ${
//             item.isActive
//               ? "border-[var(--color-icon)]"
//               : "border-[var(--color-gray)]"
//           } ${isOpen ? "sticky top-0 z-10" : ""}`}
//       >
//         <span>
//           {item.title} {item.selectedCount > 0 ? `(${item.selectedCount})` : ''}</span>
//         <span
//           className={`transition-transform duration-300 flex w-[40px] rounded-full h-[40px] border justify-center items-center cursor-pointer ${
//             item.isActive
//               ? "border-[var(--color-icon)]"
//               : "border-[var(--color-gray)]"
//           }`}
//         >
//           <ArrowLeft width={16} height={16} className={`text-[var(--color-icon)] ${
//             isOpen ? "rotate-90" : "-rotate-90"
//           }`} />
//         </span>
//       </button>

//       <div
//         className={`
//           grid transition-all duration-300 ease-in-out
//           ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
//         `}
//       >
//         <div className="overflow-hidden">
//           <span className="p-[var(--space-sm)]">{item.content}</span>
//         </div>
//       </div>
//     </div>
//   );
// };
const AccordionItem = ({ item, isOpen, onToggle }: AccordionItemProps) => {
  return (
    <div className="rounded mb-[var(--space-lg)] transition">
      <button
        onClick={onToggle}
        className={`w-full flex justify-between items-center text-left bg-[var(--color-bg-secondary)] text-[var(--color-icon)] border-1 py-[var(--space-sm)] px-[var(--space-lg)] rounded-[var(--radius-lg)] cursor-pointer font-semibold font-sans ${
          item.isActive
            ? "border-[var(--color-icon)]"
            : "border-[var(--color-gray)]"
        } ${isOpen ? "sticky top-0 z-10" : ""}`}
      >
        <span>
          {item.title} {item.selectedCount > 0 ? `(${item.selectedCount})` : ""}
        </span>

        <span
          className={`transition-transform duration-300 flex w-[40px] rounded-full h-[40px] border justify-center items-center cursor-pointer ${
            item.isActive
              ? "border-[var(--color-icon)]"
              : "border-[var(--color-gray)]"
          }`}
        >
          <ArrowLeft
            width={16}
            height={16}
            className={`text-[var(--color-icon)] ${
              isOpen ? "rotate-90" : "-rotate-90"
            }`}
          />
        </span>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[calc(100vh-80px)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="overflow-y-auto max-h-[calc(100vh-80px)] pt-2">
          <div className="p-[var(--space-sm)]">{item.content}</div>
        </div>
      </div>
    </div>
  );
};
// const AccordionItem = ({ item, isOpen, onToggle }: AccordionItemProps) => {
//   return (
//     <div className="mb-[var(--space-lg)]">
//       <div
//         className={`rounded-[var(--radius-lg)] ${
//           item.isActive
//             ? "border border-[var(--color-icon)]"
//             : "border border-[var(--color-gray)]"
//         } bg-[var(--color-bg-secondary)]`}
//       >
//         <button
//           onClick={onToggle}
//           className={`w-full flex justify-between items-center text-left text-[var(--color-icon)] py-[var(--space-sm)] px-[var(--space-lg)] cursor-pointer font-semibold font-sans bg-[var(--color-bg-secondary)] ${
//             isOpen
//               ? "sticky top-0 z-20 rounded-t-[var(--radius-lg)]"
//               : "rounded-[var(--radius-lg)]"
//           }`}
//         >
//           <span>
//             {item.title} {item.selectedCount > 0 ? `(${item.selectedCount})` : ""}
//           </span>

//           <span
//             className={`transition-transform duration-300 flex w-[40px] rounded-full h-[40px] border justify-center items-center cursor-pointer ${
//               item.isActive
//                 ? "border-[var(--color-icon)]"
//                 : "border-[var(--color-gray)]"
//             }`}
//           >
//             <ArrowLeft
//               width={16}
//               height={16}
//               className={`text-[var(--color-icon)] ${
//                 isOpen ? "rotate-90" : "-rotate-90"
//               }`}
//             />
//           </span>
//         </button>

//         <div
//           className={`transition-all duration-300 ease-in-out overflow-hidden ${
//             isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
//           }`}
//         >
//           <div className="overflow-y-auto max-h-[420px] p-[var(--space-sm)]">
//             {item.content}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export default AccordionItem;