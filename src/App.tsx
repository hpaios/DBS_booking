import './App.css'
import ContainerWrapper from './components/ContainerWrapper'
import ProgressBar from './components/ProgressBar/ProgressBar'

function App() {
  return (
    <>
      <ContainerWrapper>
        <ProgressBar />
        <div className="bg-gray-300 w-full h-20">
          DBS booking is coming...
        </div>
      </ContainerWrapper>
    </>
  )
}

export default App
