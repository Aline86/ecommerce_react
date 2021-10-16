import React, {useEffect, useState} from 'react'
import {Route, Link} from 'react-router-dom'
import {useSelector} from 'react-redux'
import LoadingToRedirect from './LoadingToRedirect'
import {currentAdmin} from '../../functions/auth'
// Utilisation de router dom pour voir si l'utilisateur est authentifié
const AdminRoute = ({
    children, ...rest
}) => {
    const {user} = useSelector((state) => ({ ...state}));
    const [ok, setOk] = useState(false)

    useEffect(() => {
        if(user && user.token){
            currentAdmin(user.token)
            .then(res => {
                console.log('CURRENT ADMIN RESPONSE', res)
                setOk(true)
            })
            .catch(err => {
                console.log('ADMIN ROUTE ERR', err)
                setOk(false)
            })
        }
    }, [user])
    return ok ? 
    (
        <Route {...rest} />
    ) : 
    
    (
        <LoadingToRedirect />
    )
}

export default AdminRoute