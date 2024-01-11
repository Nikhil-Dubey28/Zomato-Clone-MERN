import React, { useState,useEffect } from 'react'

import './MyOrders.css'
import Navigation from '../Navbar/Navigation'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import base_url from '../../config/config'

const MyOrders = () => {
  
  // const base_url = `https://zomato-clone-fmmd.onrender.com`

  const navigate = useNavigate()
    const [order,setOrder] = useState([])

    useEffect(() =>{
const fetchOrders = async() => {
  const token = localStorage.getItem('token')

  try {
    const res = await axios.get(`${base_url}/api/order`,{
      headers :{
        Authorization : token
      }
    })
    console.log(res.data)
    setOrder(res.data)
  }catch(err) {
console.log(err)
  }

}


fetchOrders()
    },[])

   // Function to format date and time
   const formatDateTime = (dateTimeString) => {
    const dateObj = new Date(dateTimeString);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const formattedTime = dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return `${formattedDate} ${formattedTime}`;
  };



  return (
    <div className = 'zomato'>
        <Navigation />
        <h1 style={{fontSize: "28px", fontWeight:"500",marginTop:"120px"}}>Past Orders</h1>
    {order.map((item) => (
        <div className="main-container-order">
      <div className="first-container">
        <div className="image-container">
          {/* Add your image here */}
          <img src={item.restaurant.restaurantImage} alt="" style={{width:"60px",height:"60px"}}/>
        </div>
        <div className="details-container">
          <div className="heading">
            <div>{item.restaurant.restaurantName}</div>
            <div className="order-details">
              ORDER #{item._id} | {formatDateTime(item.date)}
            </div>
            <div  onClick = {()=>navigate(`/order-details/${item._id}`)} style={{marginTop:"20px",color:"#fc8019",fontSize:"14px",cursor:"pointer"}}>VIEW DETAILS</div>
          </div>
          <div className="tick-icon">
            {/* Add your green tick icon here */}
          </div>
        </div>
      </div>
      <div className="second-container">
        <div>
        {item.cart.map((food) => (
        
        <div className="items-details">

      {food.foodItemName} x {food.quantity}
         </div>
        
        ))}
        </div>
        <div className="total-paid">
          Total Paid: {item.total + 53}
        </div>
      </div>
    </div>
    ))}
       
    </div>
  )
}

export default MyOrders