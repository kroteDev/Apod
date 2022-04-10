import React from 'react'
import loading from '../../assets/imgs/nasa-logo.gif'

function Loading() {
	return(
		<div className="loading">
			<img src={loading} alt="Loading..." />
		</div>
	)
}
export default Loading