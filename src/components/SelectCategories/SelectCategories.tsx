import { useCategory } from '../../api/hooks/useCategory'

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
          className={selectedCategoriesIds.includes(employee?.id) ? 'border' : ''}
        >
          <img src={employee.avatar} alt="" /> {employee?.firstName}
        </div>
      ))}
    </div>
  );

}

export default SelectCategories
