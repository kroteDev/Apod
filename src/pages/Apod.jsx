import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Loading from '../components/shared/Loading'
import { useParams } from 'react-router-dom'
import './pages.css'
function Apod() {

	const [loading, setLoading] = useState(false)
	const [apod, setApod] = useState({})
	const { apodId } = useParams()	

  const getApod = async =>{
		setLoading(true)
    axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NODE_ENV !== 'production'? 'DEMO_KEY' : process.env.REACT_APP_APOD_KEY}&date=${apodId}&thumbs=true`)
    .then(function (res) {
      setApod(res.data)      
			setLoading(false)
    })
    .catch(function (error) {
      console.log(error)
    })
  }

  useEffect(() => {
		getApod()
  },[])


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
	
	if (loading) return <Loading />	
	return (
		<div className='apod-page main-content'>
			
			{media_type === "image" ?(
				<figure className="image-wrapper">
					<img src={url} alt={title} />
					<figcaption>{title} . Published: { new Date(date).toLocaleDateString() }</figcaption>
				</figure>	
			) : (
				<div className='iframe-wrapper'>
					<iframe width="1020" height="574" src={url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
					<p>{title} . Published: { new Date(date).toLocaleDateString() }</p>
				</div>
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