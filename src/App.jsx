import { Routes ,Route } from 'react-router-dom'
import Header from './components/shared/Header'
import Footer from './components/shared/Footer'
import ApodsList from './components/apod/ApodList'
import ApodofToday from './components/apod/Apod'
import About from './pages/About'
import ApodPage from './pages/Apod'
import './App.css'
function App() { 

  return (    
    <div className="App">
      <Header />
      <div className='container main-content-container'>
        <Routes>          
          <Route path="/" element={
            <> 
              <ApodofToday />
              <header className='other-entries'>
                <h2>One of these days</h2>
              </header>
              <ApodsList />
            </>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/apod/:apodId" element={<ApodPage />} />
        </Routes>       
      </div>
      <Footer />
    </div>    
  )
}

export default App
