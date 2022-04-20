import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

//https://krotedev-apod.herokuapp.com/apod/2006-05-29 ver código