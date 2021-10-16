import React, {useState, useEffect} from 'react'
import AdminNav from '../../../component/nav/AdminNav'
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'
import {createProduct} from "../../../functions/product"
import ProductCreateForm from '../../../component/forms/ProductCreateForm'
import {getCategories, getCategorySubs} from "../../../functions/category"
import FileUpload from '../../../component/forms/FileUpload'
import {LoadingOutlined} from '@ant-design/icons'
const initialState = {
    title: 'Macbook Pro',
    description: 'This is the best Apple product',
    price: '4500',
    category: '',
    categories: [],
    subs: [],
    shipping: 'Yes',
    quantity: '50',
    images: [],
    colors: ["Black", "Brown", "Silver", "White", "Blue"],
    brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
    color: 'White',
    brand: 'Apple',
}
// Possible to grab event.target.name
const ProductCreate = () => {
    const [values, setValues] = useState(initialState)
    const [subOptions, setSubOptions] = useState([])
    const [loading, setLoading] = useState(false)
    // redux to get user token
    const {user} = useSelector((state) => ({...state}))
    const handleCategoryClickSub = (e) => {
        
        e.preventDefault()
        
        setValues({...values, subs: [], [e.target.name]: e.target.value})
        

        let subId = e.target.value
        console.log(subId)
        getCategorySubs(subId).then((c) => setSubOptions(c.data));
        setSubOptions([""])
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        createProduct(values, user.token)
        .then(res => {
            console.log(res)
            window.alert(`"${res.data.title}" is created`)
            // browser alert and not toast because with toast, reload would happen imediately
            // and user wouldn't be able to see the message
            window.location.reload()
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

    const loadCategories = () => getCategories().then((c) => setValues({ ...values, categories: c.data }));

    useEffect(() => {
        loadCategories();
    }, [])
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col-md-10">
                    {loading ? <LoadingOutlined className="text-danger h1" /> : <h4>Product Create</h4>}
                    <hr />
                    <div className="p-3">
                        <FileUpload values={values} setValues={setValues} setLoading={setLoading} />
                    </div>
                    <ProductCreateForm handleSubmit={handleSubmit} handleChange={handleChange} handleCategoryClickSub={handleCategoryClickSub} values={values} setValues={setValues} subOptions={subOptions} setSubOptions={setSubOptions}/>
                </div>
            </div>
        </div>
    )
}

export default ProductCreate