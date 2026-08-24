import { useTranslation } from 'react-i18next'
import Time from '../../icons/Time'
import type { GroupedArray } from '../../interfaces'
import { formatDurationShort } from '../../utils'

interface SummaryOrderProps {
  services: GroupedArray[]
}

const SummaryOrder = ({ services }: SummaryOrderProps) => {
  const { t, i18n } = useTranslation()

  // const totalPrice = services
  //   .flatMap(group => group.services)
  //   .reduce((sum, service) => sum + service.price, 0)

  return (
    <>
      {services.map((group) => (
        <div key={group.label} className="mb-[var(--space-xl)]">
          <h4 className="mb-[var(--space-md)] text-[var(--color-icon)] text-[16px] font-semibold">
            {t(`select_services.${group.services[0].parentCategoryId}`)}:
          </h4>

          <div className="flex flex-col gap-[var(--space-sm)]">
            {group.services.map((service) => (
              <div key={service.id} className="flex flex-col gap-2">
                <div className='text-[var(--color-icon)] text-[16px]'>
                  {t(`select_services.${service.id}.title`)}
                </div>

                <div className='flex justify-between'>
                  <div className='text-[var(--color-border)] text-[14px] items-center flex gap-1'>
                    <Time />
                    {formatDurationShort(service.durationMinutes as number, i18n.language)}
                  </div>

                  {/* <span className='text-[var(--color-icon)] text-[14px] font-semibold'>
                    {service.price} Kč
                  </span> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* TOTAL
      <div className="flex justify-between pt-[var(--space-md)]">
        <span className="text-[var(--color-icon)] text-[16px] font-semibold">
          {t('common.total')}:
        </span>
        <span className="text-[var(--color-icon)] text-[16px] font-semibold">
          {totalPrice} Kč
        </span>
      </div> */}
    </>
  )
}

export default SummaryOrder