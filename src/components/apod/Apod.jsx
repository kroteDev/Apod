import React, {useState, useEffect} from 'react'
import axios from 'axios'
import '../../pages/pages.css'
import Loading from '../shared/Loading'

function Apod() {	
	const [apod, setApod] = useState({})	
	const [loading, setLoading] = useState(false)
  const getApod = async =>{		
		setLoading(true)
    axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NODE_ENV !== 'production'? 'DEMO_KEY' : process.env.REACT_APP_APOD_KEY}&thumbs=true`)
    .then(function (res) {
      setApod(res.data)      
    })
    .catch(function (error) {
      console.log(error)
    })
    .then(function () {						
			setLoading(false)			
    })
  }
	const {
		copyright,
		date,
		explanation,
		hdurl,
		media_type,
		title,
		url		
	} = apod
	const apodDateId = date !== undefined ? date.slice(2).replace(/-/g, "") : null	

  useEffect(() => {
		getApod()
  },[])
	if( loading ) return <Loading />
	return (
		
		<div className='apod-page main-content'>
			{media_type === "image" ?(
				<figure className="image-wrapper">
					<img src={url} alt={title} />
					<figcaption>{title} . Published: { new Date(date).toLocaleDateString() }</figcaption>
				</figure>	
			) : (
				<iframe width="960" height="540" src={url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
			)}			
			<div className='apod-info'>
				<h1 className="title">{title}</h1>
				<p className="explanation">{explanation}</p>
				<div className="meta">
					<p><label>Date: </label>{ new Date(date).toLocaleDateString() }</p>
					<p><label>Media Type: </label>{media_type}</p>
					<p><label>Copyright: </label>{copyright ? copyright : 'None'}</p>
				</div>							
				<div className="actions">
					<a href={`https://apod.nasa.gov/apod/ap${apodDateId}.html`} className='go-to' target="_blank" rel="noreferrer">Go To APOD</a>
					<a href={hdurl} className='download' target="_blank" rel="noreferrer">Download</a>
				</div>
			</div>
		</div>
	)
}

export default Apod