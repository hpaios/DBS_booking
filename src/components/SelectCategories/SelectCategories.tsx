import { useCategory } from '../../api/hooks/useCategory'
import { categoryStyle } from './SelectCategories.style'

const SelectCategories = ({
  selectCategory,
  selectedCategoriesIds
}: {
  selectedCategoriesIds: number[]
  selectCategory: (id: number) => void
}) => {
  const { data, isLoading, error } = useCategory();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  
  return (
    <div>
      {data.map((employee: {id: number, firstName: string, avatar: string}) => (

        <div
          key={employee?.id}
          onClick={() => selectCategory(employee?.id)}
          className={selectedCategoriesIds.includes(employee?.id) ? `border-white ${categoryStyle}` : `border-transparent ${categoryStyle}`}
        >
          <img src={employee.avatar} alt="" className='w-[60px] h-[60px] rounded-full'/>
          <h3 className='text-[var(--font-size)]'>{employee?.firstName}</h3>
        </div>
      ))}
    </div>
  );

}

export default SelectCategories
