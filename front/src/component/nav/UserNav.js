import React from 'react'
import {Link} from 'react-router-dom'

const UserNav = () => (
    <nav>
        <ul className="nav flex-column">
            <li className="nav-item">
                <Link to="/user/history" className="nav-link">HISTORY</Link>
            </li>
            <li className="nav-item">
                <Link to="/user/password" className="nav-link">PASSWORD</Link>
            </li>
            <li className="nav-item">
                <Link to="/user/wishlist" className="nav-link">WHISHLIST</Link>
            </li>
        </ul>
    </nav>
)

export default UserNav