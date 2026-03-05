import { useState } from 'react'
import { useTimeslots } from '../api/hooks/useTimeslots'
import type { Service } from '../interfaces'
import { getToday, getUniqueParentCategoryIds } from '../utils'
import Timeslots from './Timeslots'

const SelectSlot = ({selectedServices}: {
  selectedServices: Service[]
}) => {
  const uniqueParentCategoryIds = getUniqueParentCategoryIds(selectedServices)

  const { timeslots, isLoading } = useTimeslots(uniqueParentCategoryIds);

  const [selectedSlot, setSelectedSlot] = useState<string>();
  const [selectedDate, setSelectedDate] = useState(getToday());



  console.log('timeslots', timeslots);
  return (
    <div>SelectSlot
     <Timeslots
        date={selectedDate}
        selectedSlot={selectedSlot}
        onSelect={setSelectedSlot}
      />
      <p>Slot: {selectedSlot}</p>
    </div>
  )
}

export default SelectSlot