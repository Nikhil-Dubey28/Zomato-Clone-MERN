import React, { useEffect, useState } from 'react'

import { Nav, Navbar, NavDropdown, Tabs, Tab, Form, FormControl, InputGroup, Button, Carousel, Card, Modal, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../OrderOnline/OrderOnline.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../../CartContext.jsx';
import axios from 'axios'
import CartModal from '../CartModal/CartModal.jsx';
import base_url from '../../config/config.js';

const Navigation = () => {

  const navigate = useNavigate();

  const { cartCount, setCartCount, setRefresh,refresh } = useCart()
  
  const user = JSON.parse(localStorage.getItem('user'))

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  // const base_url = `https://zomato-clone-fmmd.onrender.com`


  const handleLogout = () => {
    localStorage.getItem('user');
    localStorage.getItem('token');

    localStorage.removeItem('user');
    localStorage.removeItem('token');

    alert('logged out successfully')

    setRefresh((prev) => !prev)
    // navigate('/login')
  }

  

  useEffect(() => {
    const getTotalCartQuantity = async () => {

      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${base_url}/api/cart/quantity`, {
          headers: {
            Authorization: token
          }
        })
        console.log(res.data)
        setCartCount(res.data.quantity)
      } catch (err) {
        console.log(err)
      }
    }

    getTotalCartQuantity()
  }, [refresh])

  const handleCartClick = () => {
    cartCount > 0 ? navigate('/checkout') : navigate('/empty-cart')
  }


 
  return (
    <>
      <Navbar expand="lg" className="navbar-style fixed-top custom-nav">
        <Navbar.Brand href="/">
          {/* <span className="zomato-logo">Zomato</span> */}
          <img src="https://b.zmtcdn.com/web_assets/b40b97e677bc7b2ca77c58c61db266fe1603954218.png" alt="logo" className='zomato-logo' />
        </Navbar.Brand>
        <Form inline className="search-bar">


          <FormControl type="text" placeholder="Search for restaurants or cuisines" className="mr-sm-2 search-bar-input" />

        </Form>
        <div className='shopping-cart'>
        <span style={{ marginTop: "6px", cursor: 'pointer', marginRight: "20px" }} onClick={() => handleCartClick()}><ShoppingCartIcon />({cartCount})</span>
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />


        <Navbar.Collapse id="basic-navbar-nav">


          <Nav className="mx-auto">


            {user ? (
              <>
                {/* <span style={{ marginTop: "6px", cursor: 'pointer', marginRight: "20px" }} onClick={() => handleCartClick()}><ShoppingCartIcon />({cartCount})</span> */}
                <NavDropdown title={user.name} id="basic-nav-dropdown" style={{ color: "black", fontSize: "1.9rem" }} className='custom-nav-dropdown'>
                  <NavDropdown.Item href="#">Profile</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate('/my-orders')}>My Orders</NavDropdown.Item>
                  <NavDropdown.Item href="#">Saved Restaurants</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate('/my-addresses')}>My Addresses</NavDropdown.Item>


             


                  <NavDropdown.Item onClick={() => handleLogout()}>Logout</NavDropdown.Item>


                </NavDropdown>
              </>
            ) : <span style={{cursor: "pointer"}}onClick =  {() => navigate('/login')}>Sign In</span>}



          </Nav>
          <Form inline className="search-bar-mobile">


            <FormControl type="text" placeholder="Search for restaurants or cuisines" className="mr-sm-2 search-bar-input" />

          </Form>
        </Navbar.Collapse>


      </Navbar>
      {/* <CartModal show={show} handleClose={handleClose} quantity={cartCount} /> */}
    </>


  )
}

export default Navigation