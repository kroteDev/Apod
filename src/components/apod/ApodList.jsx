import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Loading from '../shared/Loading'
import ApodItem from "./ApodItem"

function ApodList() {
	const [apods, setApod] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const getApods = async =>{
    axios.get(`https://api.nasa.gov/planetary/apod?count=10&thumbs=true&api_key=${process.env.NODE_ENV !== 'production'? 'DEMO_KEY' : process.env.REACT_APP_APOD_KEY}`)
    .then(function (response) {
      setApod(response.data)      
    })
    .catch(function (err) {
      setError(err.response.data)
			setLoading(false)
    })
    .then(function () {			
			setTimeout(() => {
				setLoading(false)
			}, 2000);			
    })
  }

  useEffect(() => {
		getApods()
  },[])
	if (loading) return <Loading />
  if (error)return(
    <div className='apod-page main-content error'>
      <h1>Something Went Wrong!</h1>      
      <p>
        {error.code === 400 ? `No APOD found with the given date or the content is no longer available.` : `Service unavailable. Please try again later.`}
      </p>      
    </div>
  )
	return (
		<>      
			{apods.map( (apod, index) => (
				<ApodItem key={index} apod={apod} />        
			))}      
		</>
	)
}

export default ApodList