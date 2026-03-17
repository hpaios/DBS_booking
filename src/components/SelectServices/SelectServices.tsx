import Accordion from "./Accordion";
import type { MappedCategory, Service } from "../../interfaces";
import { ExpandableText } from '../ExpandableText'
import Time from '../../icons/Time'
import { formatDurationCsShort } from '../../utils'

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
                  className={`rounded-[var(--radius-xl)] p-[var(--space-lg)] mb-[var(--space-sm)] cursor-pointer border
                  ${
                    isSelected
                      ? "border-[var(--color-icon)]"
                      : "border-[var(--color-gray)]"
                  }`}
                >
                  <h5 className=''>{service.title}</h5>
                  <ExpandableText text={service.description} />
                  <div className='flex justify-between'>
                    <div className='text-[var(--color-border)] text-[14px] items-center flex gap-1'><Time/>{formatDurationCsShort(service.durationMinutes as unknown as number)}</div>
                    <span className='text-[var(--color-icon)] text-[14px] font-semibold'>{service.price} Kč</span>
                  </div>
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
    <div className={selectedServices.length ? 'pb-[100px]' : 'pb-1'}>
      <Accordion items={accordionItems()} />
    </div>
  );
};

export default SelectServices;
