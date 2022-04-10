import './header_footer.css'
import logo from '../../assets/imgs/apodlogo.png'
import { Link } from "react-router-dom"
import React, {useState} from 'react'


function Header() {
	const [sitemode, setMode] = useState(false)
	const change_mode = event =>{
		// setMode(!sitemode)
		if(sitemode){
			setMode(false)			
			document.querySelector('body').classList.remove('nightmode')
		}else{
			setMode(true)
			document.querySelector('body').classList.add('nightmode')
		}
	}
	return (
		<header className="main-header">
			<nav className="container">
				<div className='logo-wrapper'>
					<h1><Link to="/"><img src={logo} alt="APOD - Logo" /></Link></h1>
				</div>
				<div className="nav-wrapper">
					<ul>
						{/* <li><Link to='/'>Calendar</Link></li> */}
						<li><a href='https://nasa.gov/' target="_blank" rel="noreferrer">Nasa</a></li>
						<li><a href='https://apod.nasa.gov/apod' target="_blank" rel="noreferrer">Apod Official Site</a></li>
						<li><Link to="/about">About</Link></li>
						<li className='mode-toogle'><div onClick={change_mode} className={sitemode ? 'active': null} ><span></span></div></li>
					</ul>
				</div>
			</nav>
		</header>
	)
}

export default Header