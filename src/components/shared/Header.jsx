import './header_footer.css'
import logo from '../../assets/imgs/apodlogo.png'
function Header() {
	return (
		<header className="main-header">
			<nav className="container">
				<div className='logo-wrapper'>
					<h1><img src={logo} alt="APOD - Logo" /></h1>
				</div>
				<div className="nav-wrapper">
					<ul>
						<li><a href="#">Calendar</a></li>
						<li><a href="https://nasa.gov/" target="_blank" rel="noreferrer">Nasa</a></li>
						<li><a href="https://apod.nasa.gov/apod" target="_blank" rel="noreferrer">Apod Official Site</a></li>
						<li><a href="/about">About</a></li>
						<li className='mode-toogle'><a href="#"><span></span></a></li>
					</ul>
				</div>
			</nav>
		</header>
	)
}

export default Header