import React from 'react'
import {getProducts} from './../functions/product'
import ProductCard from '../component/cards/ProductCard'
import Jumbotron from '../component/cards/Jumbotron'
import NewArrivals from '../component/home/NewArrivals'
import BestSellers from '../component/home/BestSellers'
import CategoryList from '../component/category/CategoryList'
import SubList from '../component/sub/SubList'
const Home = () => {
  return (
    <>
      <div className="jumbotron text-danger h1 font-weight-bold text-center">
        <Jumbotron text={["Latest Products", "New Arrivals", 'Best Sellers']} />
      </div>
      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron" >
        New Arrivals
      </h4>
      <NewArrivals />
      <br />
      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron" >
        Best Sellers
      </h4>
      <BestSellers />
      <br />
      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron" >
        Categories
      </h4>
      <CategoryList />
      <br />
      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron" >
        Subs
      </h4>
      <SubList />
    </>
  )
}

export default Home;
