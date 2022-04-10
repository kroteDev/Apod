import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Loading from '../shared/Loading'
import Apod from "./Apod"

function Apods() {
	const [apods, setApod] = useState([])
  const [loading, setLoading] = useState(true)
  const getApods = async =>{
    axios.get(`https://api.nasa.gov/planetary/apod?count=10&thumbs=true&api_key=${process.env.NODE_ENV !== 'production'? 'DEMO_KEY' : process.env.REACT_APP_APOD_KEY}`)
    .then(function (response) {
      setApod(response.data)      
    })
    .catch(function (error) {
      console.log(error)
    })
    .then(function () {			
			setTimeout(() => {
				setLoading(false)
			}, 2000);			
    })
  }

  useEffect(() => {
   getApods()    
   console.log()
  },[])
	if (loading) return <Loading />
	return (
		<>      
			{apods.map( (apod, index) => (
				<Apod key={index} apod={apod} />        
			))}      
		</>
	)
}

export default Apods