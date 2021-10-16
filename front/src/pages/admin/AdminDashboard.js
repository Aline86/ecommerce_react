import React, {useEffect, useState} from 'react'
import AdminNav from '../../component/nav/AdminNav'

const AdminDashboard = () => {
    
    return (
        <div className="container-fluid">
            
            <div className="row">
            
                <div className="col-2">
                    <AdminNav />
                </div>
                
               
                <div className="col">
                    <div className="col">
                        <h4>Admin Dashbord</h4>
                    </div>
               
                </div>
            </div>
        </div>
    )
}
export default AdminDashboard