import nasaWorm from '../../assets/imgs/nasaworm.png'
function Footer() {
	return (
		<footer className="main-footer">
			<div className="container">
				<div className='footer-item logo-wrapper'>
					<img src={nasaWorm} alt="Nasa Logo" />
				</div>
				<div className='footer-item about-me'>
					<h2>Follow me</h2>
					<ul>
						<li><a href="https://www.facebook.com/krotedev" target="_blank" rel="noreferrer">Facebook</a></li>
						<li><a href="https://www.instagram.com/krotedev/" target="_blank" rel="noreferrer">Instagram</a></li>
						<li><a href="https://www.linkedin.com/in/bolliveira/" target="_blank" rel="noreferrer">LinkedIn</a></li>
					</ul>
				</div>
				<div className='footer-item about-nasa'>
					<h2>More About NASA</h2>
					<ul>
						<li><a href="https://www.nasa.gov/" target="_blank" rel="noreferrer">NASA</a></li>
						<li><a href="https://apod.nasa.gov/apod/" target="_blank" rel="noreferrer">APOD</a></li>
						<li><a href="https://www.nasa.gov/offices/odeo/no-fear-act" target="_blank" rel="noreferrer">No Fear Act</a></li>
					</ul>
				</div>
				<div className="copyright">
					Made with love by <a href="https://www.krotedev.com.br" target="_blank" rel="noreferrer">KröteDev</a>
				</div>
			</div>			
		</footer>
	)
}

export default Footer