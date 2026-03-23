import { useState } from 'react'
import { QueryProvider } from './api/providers/QueryProvider'
import './App.css'
import ContainerWrapper from './components/ContainerWrapper/ContainerWrapper'
import Booking from './containers/Booking'

function App() {
  const [isErrorSubmit, setIsErrorSubmit] = useState(false)

  return (
    <QueryProvider>
      <ContainerWrapper isErrorSubmit={isErrorSubmit}>
        <Booking handleIsErrorSubmit={setIsErrorSubmit} />
      </ContainerWrapper>
    </QueryProvider>
  )
}

export default App