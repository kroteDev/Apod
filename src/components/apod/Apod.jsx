import './apod.css'
import { Link } from "react-router-dom"

function Apod({ apod }) {
	const apodId = apod.date.slice(2).replace(/-/g, "")	
	const trim_explanation = (explanation) =>	explanation.length > 850 ? explanation.substring(0, 847) + "..." : explanation
	
	return (				
		<article className="apod" key={apodId}>
			<figure className="image-wrapper">
				<img src={apod.media_type === "image" ? apod.url : apod.thumbnail_url} alt={apod.title} />
				<figcaption>{apod.title}</figcaption>
			</figure>
			<div className="apod-info">
				{/* <h2><Link to={`/apod/${apodId}`} key={apodId} >{apod.title}</Link></h2> */}
				<h2>{apod.title}</h2>
				<p>{trim_explanation(apod.explanation)}</p>
				<div className="meta">
					<p><label>Date: </label>{ new Date(apod.date).toLocaleDateString() }</p>
					<p><label>Media Type: </label>{apod.media_type}</p>
					<p><label>Copyright: </label>{apod.copyright ? apod.copyright : 'None'}</p>
				</div>				
			</div>
			<div className="actions">
				<a href={`https://apod.nasa.gov/apod/ap${apodId}.html`} className='go-to' target="_blank" rel="noreferrer">Go To APOD</a>
				<a href={apod.hdurl} className='download' target="_blank" rel="noreferrer">Download</a>
			</div>
		</article>
	)
}

export default Apod