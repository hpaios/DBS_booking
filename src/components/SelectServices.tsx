import { useMemo } from "react";
import { useGroupedServices } from '../hooks/useGroupedServices'
import Accordion from './Accordion'

const SelectServices = ({categoriesIds}: {
  categoriesIds: number[]
}) => {
  const { groupedServices, isLoading } = useGroupedServices(categoriesIds);

 const accordionItems = useMemo(() => {
  return groupedServices
    .filter((category) => category.services.length > 0)
    .map((category) => ({
      id: category.label,
      title: category.label,
      content: (
        <div className="flex flex-col gap-2">
          {category.services.map((service) => (
            <div
              key={service.id}
              className="flex justify-between border rounded p-[var(--space-sm)] mb-[var(--space-sm)] cursor-pointer"
            >
              <span>{service.title}</span>
              <span>{service.price} Kč</span>
            </div>
          ))}
        </div>
      ),
    }));
}, [groupedServices]);

  return (
    <div>
      <Accordion
        items={accordionItems}
      />
    </div>
  )
}

export default SelectServices
