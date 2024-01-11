import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()
    const [restaurant, setRestaurant] = useState([])

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/restaurants`)
                console.log(res)
                setRestaurant(res.data)

            }catch(err) {
                console.log(err)
            }
        }
        fetch()
    },[])


    return (
        <>
        <div>Home</div>
        {restaurant.map((res) => (
            <div onClick = {() => navigate(`/restaurant/${res._id}`)}>{res.name}</div>
        ))}
        </>
    )
}

export default Home