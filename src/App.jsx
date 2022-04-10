import { Routes ,Route } from 'react-router-dom'
import Header from './components/shared/Header'
import Footer from './components/shared/Footer'
import ApodsList from './components/apod/Apods'
import About from './pages/About'
import Apod from './pages/Apod'
import './App.css'
function App() { 

  return (    
    <div className="App">
      <Header />
      <nav className='container apods-container'>
        <Routes>          
          <Route path="/" element={<ApodsList />} />
          <Route path="/about" element={<About />} />
          <Route path="/apod/:apodId" element={<Apod />} />
        </Routes>       
      </nav>
      <Footer />
    </div>    
  )
}

export default App
