import React, {useEffect, useState} from 'react'
import {getProduct, productStar} from '../functions/product'
import SingleProduct from '../component/cards/SingleProduct'
import {useSelector} from 'react-redux'
import {getRelated} from '../functions/product'
import ProductCard from '../component/cards/ProductCard'

const Product = ({match}) => {
    const [product, setProduct] = useState({})
    const {slug} = match.params
    const [star, setStar] = useState(0)
    const [related, setRelated] = useState("")
    // redux
    const {user} = useSelector((state) => ({ ...state }))
    useEffect(() => {
        loadSingleProduct()
    }, [slug])

    useEffect(() => {
        
        if(product.ratings && user)
        {
            console.log("user " + JSON.stringify(user))
            console.log("user " + JSON.stringify(product.ratings))
            let existingRatingObject = product.ratings.find(
                (ele) => (ele.postedBy.toString() === user._id.toString())
            );
        
            existingRatingObject && setStar(existingRatingObject.star) // current user's star
        }
    
    });
    const loadSingleProduct = () => {
        getProduct(slug).then((res) => {
            setProduct(res.data)
            // load related
            getRelated(res.data._id).then(res => setRelated(res.data))
        });
    }
    const onStarClick = (newRating, name) => {
        console.log("newRating " + newRating)
        setStar(newRating)
        productStar(name, newRating, user.token)
        .then((res) => {
            loadSingleProduct()
            console.log("rating clicked ", res.data)
        })
    }   
    return (
       
        <div className="container-fluid">
            <div className="row pt-4">
                <SingleProduct product={product} onStarClick={onStarClick} star={star} />
            </div>
            <div className="row p-5">
                <div className="col text-center pt-5 pb-5">
                    <hr />
                        <h4>Related Products</h4>
                    <hr />
           
                </div>
            </div>
            <div className="row pb-5">{related.length > 0 ? related.map((r) => 
                (<div className="col-md-4" key={r._id}>
                    <ProductCard product={r} /></div> 
                ))
                : (<div className="text-center col">No product found</div>)
                
            }</div>
            
        </div>
       
    )
        
        
}

export default Product