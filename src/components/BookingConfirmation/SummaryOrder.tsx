import Time from '../../icons/Time'
import type { GroupedArray } from '../../interfaces'
import { formatDurationCsShort } from '../../utils'

interface SummaryOrderProps {
  services: GroupedArray[]
}

const SummaryOrder = ({ services }: SummaryOrderProps) => {

  const totalPrice = services
    .flatMap(group => group.services)
    .reduce((sum, service) => sum + service.price, 0)

  return (
    <>
      {services.map((group) => (
        <div key={group.label} className="mb-[var(--space-xl)]">
          <h4 className="mb-[var(--space-md)] text-[var(--color-icon)] text-[16px] font-semibold">
            {group.label}:
          </h4>

          <div className="flex flex-col gap-[var(--space-sm)]">
            {group.services.map((service) => (
              <div key={service.id} className="flex flex-col gap-2">
                <div className='text-[var(--color-icon)] text-[16px]'>
                  {service.title}
                </div>

                <div className='flex justify-between'>
                  <div className='text-[var(--color-border)] text-[14px] items-center flex gap-1'>
                    <Time />
                    {formatDurationCsShort(service.durationMinutes as number)}
                  </div>

                  <span className='text-[var(--color-icon)] text-[14px] font-semibold'>
                    {service.price} Kč
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* TOTAL */}
      <div className="flex justify-between pt-[var(--space-md)]">
        <span className="text-[var(--color-icon)] text-[16px] font-semibold">
          Celkem:
        </span>
        <span className="text-[var(--color-icon)] text-[16px] font-semibold">
          {totalPrice} Kč
        </span>
      </div>
    </>
  )
}

export default SummaryOrder