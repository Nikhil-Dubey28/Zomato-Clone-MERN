import React,{useState,useEffect} from 'react'
import Navigation from '../../Components/Navbar/Navigation'
import './OrderSuccess.css'
// import OrderSuccessComponent from '../../Components/OrderSuccess/OrderSuccessComponent'
import OrderSuccessBody from '../../Components/OrderSuccess/OrderSuccessBody'
import OrderSuccessHeader from '../../Components/OrderSuccess/OrderSuccessHeader'
import axios from 'axios'
import { useCart } from '../../CartContext'
import {useParams} from 'react-router-dom'
import base_url from '../../config/config'


const OrderSuccess = () => {
  const [cart,setCart] = useState([])
    const [restaurant,setRestaurant] = useState([])
    const [paymentMode,setPaymentMode] = useState('')
    const [address,setAddress] = useState({})
    const [date,setDate] = useState('')
   const [total,setTotal] = useState(0)
   const [orderInfo, setOrderInfo] = useState([])
   const {id} = useParams()

const [loading,setLoading] = useState(true)


  

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
        setAddress(res.data.address)
        setPaymentMode(res.data.paymentMode)
        setTotal(res.data.total)
        setDate(res.data.date)
        console.log(address)
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

              {loading ? <p style={{fontSize: "36px",marginTop: "60px"}}>Loading...</p> : (
                <div className='order-success-main-container' style={{display:"flex",flexDirection:"column",width:"100%",padding:"20px 20px" }}>
                <OrderSuccessHeader restaurant = {restaurant} address={address} date={formattedDateTime}/>
              <div style={{padding: "20px 20px"}}>
          
                <OrderSuccessBody cart={cart} total={total} paymentMode = {paymentMode} />
              </div>
              </div>
              )}
              
    
      
              
            </div>
        </div>
  )
}

export default OrderSuccess