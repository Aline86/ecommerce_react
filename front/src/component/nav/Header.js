import React, { useState} from 'react'
import { Menu } from 'antd';
import {AppstoreOutlined, SettingOutlined, UserOutlined, UserAddOutlined, LogoutOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import firebase from 'firebase/compat/app';
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import Search from '../forms/Search'
const { SubMenu, Item } = Menu;

const Header = () => {
    
    const [current, setCurrent] = useState('home')
    let dispatch = useDispatch()
    // Récupération du state de redux pour faire affichage conditionnel est-ce que user existe ou pas
    let {user} = useSelector((state) => ({...state}))
    let history = useHistory()
    const handleClick = (e) => {
      setCurrent(e.key)
    }
    
    const logout = () => {
      firebase.auth().signOut()
      dispatch({
        type: "LOGOUT",
        payload: null
      })
      history.push("/login");
    }
    return (
      <>
        <Menu  onClick={handleClick} selectedKeys={[current]} mode="horizontal">
        <Item key="home" icon={<AppstoreOutlined />}>
          <Link to="/">Home</Link>
        </Item>
        <Item key="shop" icon={<ShoppingOutlined />}>
          <Link to="/shop">Shop</Link>
        </Item>
        
        {user && (
        <SubMenu key="SubMenu" icon={<SettingOutlined />} title={user.email && user.email.split('@')[0]}style={{marginLeft: 'auto' }}>
            {
              user && user.role === 'subscriber' && 
              (<Item key="userDash" >
                <Link to="/user/history">Dashboard</Link>
              </Item>)
            }
            {
              user && user.role === 'admin' && 
              (<Item key="adminDash" >
                <Link to="/admin/dashboard">Dashboard</Link>
              </Item>)
            }
              <Item key="setting:3" icon={<LogoutOutlined />} onClick={logout}>Logout</Item>
        </SubMenu>
         )}
        {!user && (
          <Item 
            key="login" 
            icon={<UserOutlined />} 
            style={{marginLeft: 'auto' }}>
            <Link to="/login">Login</Link>
          </Item>
        )}
        {!user && (
          <Item 
              key="register" 
              icon={<UserAddOutlined />}
              style={{marginLeft: '0' }}>
              <Link to="/register">Register</Link>
            </Item>
        )}
        <Item key="Search" style={{marginLeft: '0' }} className="float-right p1">
            <Search />
        </Item>
          
      </Menu>
      
     </>
    )
}
  

export default Header