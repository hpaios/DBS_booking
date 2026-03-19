import { useCategory } from '../../api/hooks/useCategory'
import Loader from '../Loader'
import { categoryStyle } from './SelectCategories.style'

const SelectCategories = ({
  selectCategory,
  selectedCategoriesIds
}: {
  selectedCategoriesIds: number[]
  selectCategory: (id: number) => void
}) => {
  const { data, isLoading, error } = useCategory();

  if (isLoading) return <Loader />
  if (error) return <div>Error</div>;
  
  return (
    <div className={`${selectedCategoriesIds.length ? 'pb-[100px]' : 'pb-1'}`}>
      <p className='text-[var(--color-icon)] text-[14px]'>👉 Můžete vybrat více kategorií</p>
      {data.map((employee: {id: number, firstName: string, avatar: string, position: string }) => (

        <div
          key={employee?.id}
          onClick={() => selectCategory(employee?.id)}
          className={selectedCategoriesIds.includes(employee?.id) ? `border-white ${categoryStyle}` : `border-[var(--color-gray)] ${categoryStyle}`}
        >
          <img src={employee.avatar} alt={employee?.firstName} className='w-[60px] h-[60px] rounded-full'/>
          <div>
            <h4 className='text-[length:var(--font-size)] text-[color:var(--color-icon)] font-sans'>{employee?.firstName}</h4>
            <p className='text-[color:var(--color-disabled-text)] m-0 font-sans'>{employee?.position}</p>
          </div>
        </div>
      ))}
    </div>
  );

}

export default SelectCategories
