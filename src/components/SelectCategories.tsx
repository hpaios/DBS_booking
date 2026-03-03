import { useCategory } from '../api/hooks/useCategory'

const SelectCategories = () => {
  const { data, isLoading, error } = useCategory(186414);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  
  return (
    <div>
      {data?.map((employee: {id: number, firstName: string, avatar: string}) => (

        <div key={employee?.id}><img src={employee.avatar} alt="" /> {employee?.firstName}</div>
      ))}
    </div>
  );

}

export default SelectCategories
