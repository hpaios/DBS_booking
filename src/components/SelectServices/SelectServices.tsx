import Accordion from "./Accordion";
import type { MappedCategory, Service } from "../../interfaces";

const SelectServices = ({
  servicesList,
  selectedServices,
  handleSelectedService,
}: {
  servicesList: MappedCategory[];
  selectedServices: Service[];
  handleSelectedService: (service: Service) => void
}) => {

  const selectedIds = new Set(selectedServices.map((s) => s.id));

  const accordionItems = () => {
  return servicesList
    .filter((category) => category.services.length > 0)
    .map((category) => {
      const hasSelected = category.services.some((s) =>
        selectedIds.has(s.id)
      );

      return {
        id: category.label,
        title: category.label,
        isActive: hasSelected,
        content: (
          <div className="flex flex-col gap-2">
            {category.services.map((service) => {
              const isSelected = selectedIds.has(service.id);

              return (
                <div
                  key={service.id}
                  onClick={() => handleSelectedService(service)}
                  className={`flex justify-between rounded p-[var(--space-sm)] mb-[var(--space-sm)] cursor-pointer border
                  ${
                    isSelected
                      ? "border-[var(--color-primary)]"
                      : "border-[var(--color-border)]"
                  }`}
                >
                  <span>{service.title}</span>
                  <span>{service.price} Kč</span>
                </div>
              );
            })}
          </div>
        ),
      };
    });
  };

  if (!servicesList.length) return null;

  return (
    <div>
      <Accordion items={accordionItems()} />
    </div>
  );
};

export default SelectServices;
