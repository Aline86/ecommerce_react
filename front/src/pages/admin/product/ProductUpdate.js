import React, {useState, useEffect} from 'react'
import AdminNav from '../../../component/nav/AdminNav'
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'
import {createProduct, getProduct, updateProduct} from "../../../functions/product"
import ProductUpdateForm from '../../../component/forms/ProductUpdateForm'

import {getCategory, getCategorySubs, getCategories} from "../../../functions/category"
import FileUpload from '../../../component/forms/FileUpload'
import {LoadingOutlined} from '@ant-design/icons'
import {useParams} from 'react-router-dom'

const initialState = {
    title: '',
    description: '',
    price: '',
    category: '',
    subs: [],
    shipping: '',
    quantity: '',
    images: [],
    colors: ["Black", "Brown", "Silver", "White", "Blue"],
    brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
    color: '',
    brand: '',
}
// match is a prop from react-router-dom that comes from App.js
// alternative => Router // or params = useParams()
// alternative => let {slug} = useParams()
const ProductUpdate = ({match, history}) => {
    const {user} = useSelector((state) => ({...state}))
    const {slug} = match.params
    const [values, setValues] = useState(initialState)
    const [subOptions, setSubOptions] = useState([...values.subs])
    const [categoryList, setCategoryList] = useState([])
    const [arrayOfSubs, setArrayOfSubIds] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadProduct(slug)
        loadCategories();
     
    }, [])
    const loadProduct = (slug) => {
        getProduct(slug)
        .then(p => {
            // load single product
            setValues({...values, ...p.data});
            // load single product category subs
            console.log(p.data)
            getCategorySubs(p.data.category._id)
            .then(res => {
                
                setSubOptions(res.data)
            })
            // prepare array of sub ids to show as default sub values in antd Select
            let arr = []
            p.data.subs.map((s) => {
                arr.push(s._id)
            })
            setArrayOfSubIds((prev) => arr) // required for antd to work // prev for previous values are add up to the new ones

        })
        
    }
    const handleCategoryClickSub = (e) => {
        
        e.preventDefault()
     
        //setValues({...values, subs: []}) switched off for the category never to change values.category._id should never change
        
        setSelectedCategory(e.target.value)
        console.log("selected " + selectedCategory )
        console.log("cate id " + values.category._id + "name " + values.category.name)
        let subId = e.target.value
        console.log(subId)
        getCategorySubs(subId).then((c) => setSubOptions(c.data));
        // if the user switchs to previous product category, pre populate subcategories in default again 
        // values.category._id should never change
        if(values.category._id === e.target.value)
        {
            loadProduct(slug)
        }
        // clear all subcategories
        setArrayOfSubIds([])
    }
    const loadCategories = () => getCategories().then((c) => setCategoryList(c.data));

 
      

   
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        values.subs = arrayOfSubs
        values.category = selectedCategory ? selectedCategory : values.category
        updateProduct(slug, values, user.token)
        .then(res => {
            console.log(res)
            toast.success(`"${res.data.title}" is updated"`)
            // browser alert and not toast because with toast, reload would happen imediately
            // and user wouldn't be able to see the message
            history.push("/admin/products")
        })
        .catch(err => {
            console.log(err)
            toast.error(err.response.data.err)
        })
    }
  
    const handleChange = (e) => {
        // use the spread operator because there are several values, one only is targeted
        setValues({...values, [e.target.name]: e.target.value})
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col-md-10">
                    <div>
                    {loading ? <LoadingOutlined className="text-danger h1" /> : <h4>Product Update</h4>}
                    </div>
                    
                    <div className="p-3">
                        <FileUpload 
                            values={values} 
                            setValues={setValues} 
                            setLoading={setLoading} 
                        />
                    </div>
                    <br />
                    <ProductUpdateForm 
                        handleSubmit={handleSubmit} 
                        handleChange={handleChange} 
                        values={values}
                        subOptions={subOptions}
                        arrayOfSubs={arrayOfSubs}
                        setArrayOfSubIds={setArrayOfSubIds}
                        handleCategoryClickSub={handleCategoryClickSub} 
                        categoryList={categoryList}
                        selectedCategory={selectedCategory}
                        setValues={setValues}/>
                    <hr />
                </div>
            </div>
        </div>
    )
}

export default ProductUpdate