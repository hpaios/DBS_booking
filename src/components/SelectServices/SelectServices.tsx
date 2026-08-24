// import Accordion from "./Accordion";
import type { MappedCategory, Service } from "../../interfaces";
import Loader from '../Loader'
import ErrorIcon from '../../icons/Error'
import { useTranslation } from 'react-i18next'

const SelectServices = ({
  servicesList,
  selectedServices,
  notes,
  setNotes,
  // handleSelectedService,
  isLoading,
  error
}: {
  servicesList: MappedCategory[];
  selectedServices: Service[];
  // handleSelectedService: (service: Service) => void
  notes: string
  setNotes: (value: string) => void
  isLoading: boolean
  error: Error | null | undefined
}) => {
  const { t } = useTranslation()
  // const selectedIds = new Set(selectedServices.map((s) => s.id));

  // const accordionItems = () => {
  // return servicesList
  //   .filter((category) => category.services.length > 0)
  //   .map((category) => {
  //     const hasSelected = category.services.some((s) =>
  //       selectedIds.has(s.id)
  //     );

  //     const selectedCount = category.services.filter((s) =>
  //       selectedIds.has(s.id)
  //     ).length;

  //     return {
  //       id: category.label,
  //       title: category.label,
  //       isActive: hasSelected,
  //       selectedCount: selectedCount,
  //       content: (
  //         <div className="flex flex-col gap-2">
  //           {category.services.map((service) => {
  //             const isSelected = selectedIds.has(service.id);

  //             return (
  //               <div
  //                 key={service.id}
  //                 onClick={() => handleSelectedService(service)}
  //                 className={`rounded-[var(--radius-xl)] p-[var(--space-lg)] mb-[var(--space-sm)] cursor-pointer border
  //                 ${
  //                   isSelected
  //                     ? "border-[var(--color-icon)]"
  //                     : "border-[var(--color-gray)]"
  //                 }`}
  //               >
  //                 <h5 className=''>{t(`select_services.${service.id}.title`)}</h5>
  //                 <ExpandableText text={t(`select_services.${service.id}.description`)} />
  //                 <div className='flex justify-between'>
  //                   <div className='text-[var(--color-border)] text-[14px] items-center flex gap-1'><Time/>{formatDurationShort(service.durationMinutes as unknown as number, i18n.language)}</div>
  //                   <span className='text-[var(--color-icon)] text-[14px] font-semibold'>{service.price} Kč</span>
  //                 </div>
  //               </div>
  //             );
  //           })}
  //         </div>
  //       ),
  //     };
  //   });
  // };

  if (!servicesList.length) return null;

  if (isLoading) return <Loader />
  if (error) return <div className='flex items-center justify-center gap-2 text-center text-[var(--color-icon)] border border-red-500 p-[var(--space-sm)] rounded-[var(--radius-sm)] w-[300px] my-[var(--space-lg)] mx-auto font-sans'>
    <ErrorIcon />
    <span>Error</span>
  </div>

  return (
    <div className={selectedServices.length ? 'pb-[100px]' : 'pb-1'}>
      <p className='text-[var(--color-icon)] text-[14px]'>👉 {t('select_services.textarea')}</p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        maxLength={500}
        placeholder={t('select_services.placeholder')}
        aria-label="Service notes"
        className="w-full min-h-[120px] mt-[1rem] p-3 rounded-[var(--radius-sm)] border border-[var(--color-gray)] bg-[var(--color-bg)] text-[var(--color-icon)]outline-none focus:border-[var(--color-icon)] focus:ring-1 focus:ring-[var(--color-icon)] transition-colors resize-none focus:outline-none"
      />
      <div className="text-right text-[12px] text-[var(--color-disabled-text)] mt-2">
        {notes.length}/500
      </div>
      {/* <Accordion items={accordionItems()} /> */}
    </div>
  );
};

export default SelectServices;
