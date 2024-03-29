import React, {useState, useEffect} from 'react'
import {getSub} from '../../functions/sub'
import ProductCard from '../../component/cards/ProductCard'

const CategoryHome = ({match}) => {
    const [sub, setSub] = useState({})
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    const {slug} = match.params

    useEffect(() => {
        setLoading(true)
        getSub(slug)
        .then(s => {
            console.log(JSON.stringify(s.data, null, 4))
            setSub(s.data.sub)
            setProducts(s.data.products)
            setLoading(false)
        })
    }, [])
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col">
                    {loading ? (
                        <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">Loading...</h4>
                    ) : 
                    <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
                        {products.length} products in "{sub.name}" sub category
                    </h4>
                    }
                </div>
            </div>
            <div className="row">
                {products.map((p) => (
                    <div className="col-md-4" key={p._id}>
                        <ProductCard product={p} />
                    </div>
                    )
                )}
            </div>
        </div>
    )
}

export default CategoryHome