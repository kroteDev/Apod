import './App.css'
import Header from './components/shared/Header'
import Footer from './components/shared/Footer'
import Apods from './components/apod/Apods'

function App() { 

  return (
    <div className="App">
      <Header />
      <div className='container apods-container'>
        <Apods/>
      </div>
      <Footer />
    </div>
  )
}

export default App
