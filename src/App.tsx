import { QueryProvider } from './api/providers/QueryProvider'
import './App.css'
import ContainerWrapper from './components/ContainerWrapper/ContainerWrapper'
import Booking from './containers/Booking'

function App() {
  return (
    <QueryProvider>
      <ContainerWrapper>
        <Booking />
      </ContainerWrapper>
    </QueryProvider>
  )
}

export default App