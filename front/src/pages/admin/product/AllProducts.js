import React, {useEffect, useState} from 'react'
import AdminNav from '../../../component/nav/AdminNav'
import {getProductsByCount} from '../../../functions/product'
import {useSelector} from 'react-redux'
import AdminProductCard from '../../../component/cards/AdminProductCard'
import {removeProduct} from '../../../functions/product'
import {toast} from 'react-toastify'
const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const {user} = useSelector((state) => ({...state}))
    useEffect(() => {
        loadAllProducts()
        
    }, [])
    
    const loadAllProducts = () => 
    {
        setLoading(true)
        getProductsByCount(100, user.token)
            .then(res => 
                setProducts(res.data),
                setLoading(false)
            )
            .catch((err) => console.log(err))
    }

    const handleRemove = (slug) => {
        let answer = window.confirm('Delete ?')
        if(answer)
        {
            //console.log('send delete request', slug)
            removeProduct(slug, user.token)
            .then(res => {
                loadAllProducts()
                toast.error(`${res.data.title} is deleted`)
            })
            .catch(err => {
                toast.error()
                console.log(err)
            })
        }
    }
    return (
        <div className="container-fluid">
            
            <div className="row">
            
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    <div className="col">
                        {loading ? (<h4 className="text-danger">Loading...</h4>) : (<h4>All Products...</h4>)}
                    </div>
                    <div className="row">
                    {products.map(product => (
                        
                            <div key={product._id} className="col-md-4 pb-3">
                                <AdminProductCard product={product} handleRemove={handleRemove} />
                            </div>
                        
                        )
                    )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AllProducts