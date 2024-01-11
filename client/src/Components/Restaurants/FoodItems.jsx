import React, { useState, useEffect,useRef } from 'react'

import { Tabs, Tab, Container, Row, Col, Button } from 'react-bootstrap';
import './Restaurants.css'; // Your CSS file for additional styling


import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom';

import '../OrderOnline/OrderOnline.css';
import { useCart } from '../../CartContext.jsx'
import base_url from '../../config/config.js';


const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  };
};

const FoodItems = (props) => {
    const { setCartCount } = useCart()
    const { id } = useParams()

    const user = JSON.parse(localStorage.getItem('user'))
    const item = props.item


   
    const [quantity, setQuantity] = useState(null)
    var quantityRef = useRef(quantity);
    const [debounceQuantity, setDebounceQuantity] = useState(quantity)
  
    const [pendingChanges, setPendingChanges] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0)
    const [cartItem, setCartItem] = useState([])
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [isRemovingFromCart, setIsRemovingFromCart] = useState(false)
    var token = localStorage.getItem('token')

    let timeoutId = useRef(null)
    // const base_url = `https://zomato-clone-fmmd.onrender.com`

    useEffect(() => {
      console.log('quantityRef:', quantityRef.current)
    },[quantityRef.current])

    useEffect(() => {

        const getItemQuantity = async (id) => {
            try {


                const res = await axios.get(`${base_url}/api/cart/quantity/${id}`, {
                    headers: {
                        Authorization: token
                    }
                })
                console.log(res)
                if (res.data.quantity === undefined) {
                    setQuantity(0);
                    quantityRef.current = 0
                } else {
                    setQuantity(res.data.quantity);
                    quantityRef.current = res.data.quantity

                }
                console.log(res.data.quantity)
                return res.data.quantity
            } catch (err) {
                console.log(err)
            }
        }
        getItemQuantity(item._id)
    }, [])



 



  

  const handleAdd = async (foodId) => {
    if (!user) {
        alert('Please login to continue');
        return;
    }
    var updatedQuantity = quantity + 1;
    setQuantity(updatedQuantity);
    quantityRef.current = quantityRef.current + 1
    setCartCount((prev) => prev + 1);
  

    let currentQuantity = quantityRef.current
    if (timeoutId.current) {
        clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(async () => {
        try {
            const token = localStorage.getItem('token');
           
           
            setIsAddingToCart(true);
            console.log(quantityRef.current)
            const res = await axios.post(
                `${base_url}/api/cart/add/${foodId}/${id}`,
                {
                    userId: user.id,
                    quantity: currentQuantity,
                    price: item.price,
                    
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            setCartItem(res.data);
            console.log(cartItem)
            console.log(res);
            
        } catch (err) {
            console.log(err);
        } finally {
            setIsAddingToCart(false);
            setPendingChanges([]);
        }
    }, 800); // Adjust the delay as needed
};


const handleRemove = async (foodId) => {
  var updatedQuantity = quantity - 1;
  setQuantity(updatedQuantity);
  quantityRef.current = quantityRef.current - 1
  setCartCount((prev) => prev - 1);


  let currentQuantity = quantityRef.current
  if (timeoutId.current) {
      clearTimeout(timeoutId.current);
  }

  timeoutId.current = setTimeout(async () => {
      try {
          const token = localStorage.getItem('token');
          if (!user) {
              alert('Please login to continue');
              return;
          }
         
          setIsRemovingFromCart(true);
          console.log(quantityRef.current)
          const res = await axios.put(
              `${base_url}/api/cart/remove/${foodId}`,
              {
                  userId: user.id,
                  quantity: currentQuantity,
                  price: item.price,
                  
              },
              {
                  headers: {
                      Authorization: token,
                  },
              }
          );

          setCartItem(res.data);
          console.log(res);
          
      } catch (err) {
          console.log(err);
      } finally {
          setIsRemovingFromCart(false);
         
      }
  }, 800); // Adjust the delay as needed
};
    


    return (
        <div className="food-info" style={{ display: "flex" }}>
            <div className="food-image">
                <img src={item.image} alt={item.name} style={{ borderRadius: "5px" }} />
            </div>
            <div className="food-details" style={{ marginLeft: "20px", marginBottom: "20px" }}>
                <div className="name-and-label" style={{ display: "flex", alignItems: "center" }}>
                    {item.isVeg ? (
                        <span><img src="https://5.imimg.com/data5/SELLER/Default/2023/1/FC/HP/EV/74736417/plain-barcode-labels.jpeg" alt="" className='label-img' style={{ marginTop: "-10px" }} /></span>
                    ) :
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Non_veg_symbol.svg/2048px-Non_veg_symbol.svg.png" alt="" className='label-img' style={{ marginTop: "-5px" }} />
                    }
                    <h3>{item.name}</h3>
                </div>
                <p>₹{item.price}</p>
                <p>{item.description}</p>
                {/* {quantity === 0 ?  
                            <Button style={{marginBottom: "10px"}} onClick={() => handleAdd(item._id)}>Add to cart</Button>
                        : (
                            <div>
                            <Button style={{ marginRight: "10px" }} onClick={() => handleRemove(item._id)}>-</Button>
                            <span>{quantity}</span>
                            <Button style={{ marginLeft: "10px" }} onClick={() => handleAdd(item._id)}>+</Button>
                          </div>
                        )
                        } */}
                {/* Render conditionally based on quantity state */}
                { 
                 quantityRef.current == null || quantityRef.current === 0 ? ( // Display "Add to cart" button if quantity is 0
                    <Button
                        style={{ marginBottom: "10px" }}
                        onClick={() => handleAdd(item._id)}
                        disabled={isAddingToCart}
                    >
                        {/* {isAddingToCart ? 'Adding' : 'Add to cart'} */}
                        Add to cart
                    </Button>
                ) : ( // Display +/- buttons if quantity is > 0
                    <div>
                        <Button 
                        style={{ marginRight: "10px" }} 
                        onClick={() => handleRemove(item._id)}
                        disabled = {isRemovingFromCart}
                        >
                            {/* {isRemovingFromCart ? "Removing" : "-"} */}
                            -
                        </Button>
                        <span>{quantityRef.current}</span>
                        <Button
                            style={{ marginLeft: "10px" }}
                            onClick={() => handleAdd(item._id)}
                            disabled={isAddingToCart}
                        >
                            {/* {isAddingToCart ? 'Adding' : '+'} */}
                            +
                        </Button>

                    </div>
                    
                )}
               
            </div>
        </div>
    )
}

export default FoodItems