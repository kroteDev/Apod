import nasaWorm from '../../assets/imgs/nasaworm.png'
function Footer() {
	return (
		<footer className="main-footer">
			<div className="container">
				<div className='logo-wrapper'>
					<img src={nasaWorm} alt="Nasa Logo" />
				</div>
			</div>			
		</footer>
	)
}

export default Footer