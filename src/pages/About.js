import React from 'react'
import './pages.css'

function About() {
	return (
		<div className='about-page main-content'>
			<h1>ABOUT</h1>
			<p className='about-me'>Hello Everyone , my name is Bruno(<a href="https://www.krotedev.com.br" target="_blank" rel="noreferrer">kröteDev</a>), I'Am a developer
			who does design on free time and loves bacon 🥓. </p>
			<p><b>Astronomy Picture of the Day</b> or APOD is One of the most popular websites at NASA.
				Is a Work Supported by nasa under ward No. 80NSSC17M0076</p>
			<p>I do not own the images you see here. This Website was build using one of the NASA Api's the APOD Api. 
				You can find more about <a href="https://api.nasa.gov/" target="_blank" rel="noreferrer">here</a>. </p>
			<p>To know more about APOD and Nasa please <a href="https://apod.nasa.gov/apod/lib/about_apod.html" target="_blank" rel="noreferrer">click here</a></p>
		</div>
	)
}

export default About