import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Loading from '../shared/Loading'
import Apod from "./Apod"

function Apods() {
	const [apods, setApod] = useState([])
  const [loading, setLoading] = useState(true)
  const getApods = async =>{
    axios.get('https://api.nasa.gov/planetary/apod?count=10&thumbs=true&api_key=DEMO_KEY')
    .then(function (response) {
      setApod(response.data)      
    })
    .catch(function (error) {
      console.log(error)
    })
    .then(function () {      
			
			setTimeout(() => {
				setLoading(false)
			}, 1500);
			
    })
  }

  useEffect(() => {
   getApods()
  },[])
	if (loading) return <Loading />
	return (
		<>
			{apods.map(apod => (
				<Apod key={apod.date} apod={apod} />
			))}
		</>
	)
}

export default Apods