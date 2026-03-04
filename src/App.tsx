import { QueryProvider } from './api/providers/QueryProvider'
import './App.css'
import ContainerWrapper from './components/ContainerWrapper'
import Booking from './containers/Booking'
// import SelectCategories from './components/SelectCategories'

function App() {
  return (
    <QueryProvider>
      <ContainerWrapper>
        <Booking />
        {/* <SelectCategories /> */}
      </ContainerWrapper>
    </QueryProvider>
  )
}

export default App