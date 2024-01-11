import React,{useState,useEffect} from 'react'
import Navigation from '../../Components/Navbar/Navigation'
import './OrderDetails.css'
// import OrderSuccessComponent from '../../Components/OrderSuccess/OrderSuccessComponent'
import OrderSuccessBody from '../../Components/OrderSuccess/OrderSuccessBody'
import OrderSuccessHeader from '../../Components/OrderSuccess/OrderSuccessHeader'
import axios from 'axios'
import { useCart } from '../../CartContext'
import {useParams} from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import base_url from '../../config/config'


const OrderDetails = () => {
  const [cart,setCart] = useState([])
  const [loading, setLoading] = useState(true)
    const [restaurant,setRestaurant] = useState([])
    const [address,setAddress] = useState({})
    const [date,setDate] = useState('')
   const [total,setTotal] = useState(0)
   const [orderInfo, setOrderInfo] = useState([])
   const {id} = useParams()

   const location = useLocation()

  //  const base_url = `https://zomato-clone-fmmd.onrender.com`

  

  // useEffect(() => {
  //   const token = localStorage.getItem('token')
  //   const getCart = async () => {
  //     try {
  //       const res = await axios.get('http://localhost:3000/api/cart',{
  //         headers:{
  //           Authorization : token
  //         }
  //       })
  //       console.log(res.data)

  
  // setCart(res.data.cart)
  // setRestaurant(res.data.restaurant)
  // setTotal(res.data.totalCost)
  // console.log(cart)
  //     }catch(err) {
  // console.log(err)
  //     }
  //   }
  //   getCart()
  //  },[])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const fetchOrder  = async() => {
      setLoading(true)
      try {
        const res = await axios.get(`${base_url}/api/order/${id}`,{
          headers:{
            Authorization: token
          }
        })

        console.log(res)
        setCart(res.data.cart)
        setRestaurant(res.data.restaurant.restaurantName)
        setTotal(res.data.total)
        setAddress(res.data.address)
        setDate(res.data.date)
        console.log(orderInfo)
      }catch(err) {
console.log(err)
      }finally {
        setLoading(false)
      }
    }
    fetchOrder()
  },[])


  const dateObj = new Date(date);
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
  
  const formattedDateTime = `${formattedDate} ${formattedTime}`;
  
  return (
    <div className='zomato'>
            <Navigation />
            <div className='main-container' style={{ display: "flex", maxWidth: "800px", height: "100vh",marginTop:"120px",flexDirection:"column",alignItems:"center"}}>

          {loading ? <p>Loading...</p> : (
  <div className='order-details-main-container' style={{display:"flex",flexDirection:"column",width:"100%",padding:"20px 20px" }}>
  <OrderSuccessHeader restaurant = {restaurant} address={address} date = {formattedDateTime}/>
<div style={{padding: "20px 20px"}}>

<OrderSuccessBody cart={cart} total={total} />
</div>
</div>
          )}
              
  
      
              
            </div>
        </div>
  )
}

export default OrderDetails