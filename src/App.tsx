import { QueryProvider } from './api/providers/QueryProvider'
import './App.css'
import ContainerWrapper from './components/ContainerWrapper'
import ProgressBar from './components/ProgressBar/ProgressBar'
import SelectCategories from './components/SelectCategories'

function App() {
  return (
    <QueryProvider>
      <ContainerWrapper>
        <ProgressBar />
        <div className="w-full h-20 my-[var(--space-lg)]">
          DBS booking is coming...
        </div>
        <SelectCategories />
      </ContainerWrapper>
    </QueryProvider>
  )
}

export default App