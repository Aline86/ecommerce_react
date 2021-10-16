import React, {useState, useEffect} from 'react'
import {getProductsByCount, fetchProductsByFilter} from '../functions/product'
import {useSelector, useDispatch} from 'react-redux'
import {useParams} from 'react-router-dom'
import ProductCard from './../component/cards/ProductCard'
import {Menu, Slider, Checkbox, MenuItem, Button, Radio} from 'antd'
import {DollarOutlined, DownSquareOutlined, StarOutlined} from "@ant-design/icons"
import {getCategories} from '../functions/category'
import {getSubs} from '../functions/sub'
import Star from '../component/forms/Star'

const {SubMenu, ItemGroup} = Menu

export default function Shop({match}) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [price, setPrice] = useState([0, 0])
    const [ok, setOk] = useState(false)
    const [okCat, setOkCat] = useState(false)
    const [okStar, setOkStar] = useState(false)
    const [okSub, setOkSub] = useState(false)
    const [okBrand, setOkBrand] = useState(false)
    const [checkStar, setCheckStar] = useState(false)
    const [categories, setCategories] = useState([])
    const [categoryIds, setCategoryIds] = useState([])
    const [star, setStar] = useState('')
    const [subs, setSubs] = useState([])
    const [prevStar, setPrevStar] = useState('')
    const [sub, setSub] = useState('')
    const [brands, setBrands] = useState([
        "Apple", 
        "Samsung", 
        "Microsoft", 
        "Lenovo", 
        "ASUS"
    ])
    const [brand, setBrand] = useState("")
    const [color, setColors] = useState([
        
    ])
    let {search} = useSelector((state) => ({ ...state }))
    let dispatch = useDispatch()
    const {text} = search
    
   
    // 1. load products by default on page load 
    useEffect(() => {
        // fetch categories
        getCategories().then((res) => setCategories(res.data))
        // fetch subcategories
        getSubs().then((res) => setSubs(res.data))
        if(price.toString() == [0, 0].toString() && text == "" && categoryIds.toString() == [].toString() && !checkStar && sub == "" && brand == "")
        {
            loadAllProducts()
        }
        else 
        {
            if(text != "")
            {
                const delayed = setTimeout(() => {          
                    fetchProducts({query: text})
               }, 300);
               return () => clearTimeout(delayed)
            }
            console.log("categoryIds ", categoryIds)
            if(price.toString() != [0, 0].toString()) console.log("text", price); fetchProducts({price})
            if(categoryIds.toString() != [].toString()) fetchProducts({category: categoryIds})
            if(star != "") fetchProducts({ stars: star})
            if(sub != "") fetchProducts({sub: sub})
            if(brand != "") fetchProducts({ brand: brand})
        }
    }, [text, ok, okCat, prevStar, okSub, okBrand])
    
    const fetchProducts = (arg) => {
        fetchProductsByFilter(arg).then(product_list => {
            console.log(product_list )
            if(product_list )
            {
                setProducts(product_list.data)   
            }    
        }) 
    }
    // Load products based on category
    // show categories in a list of checkbox
    const loadAllProducts = () => {
        setLoading(true)
        getProductsByCount(12).then((p) => {
            
            setProducts(p.data);
            setLoading(false)
        })
    }
    const handleSlider = (value) => {
        console.log("value " + value)
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" }
        })
        setCategoryIds([])
        setStar("")
        setCheckStar(false)
        setPrevStar("")
        setSub("")
        setBrand("")
        if(value) setPrice(value)
        setTimeout(() => {
            setOk(!ok)
         
        }, 300);
    }
    // handle check for categories
    const handleChange = e => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        })
        setPrice([0, 0])
        setStar("")
        setCheckStar(false)
        setPrevStar("")
        setSub("")
        setBrand("")
        let inTheState =  [...categoryIds]
        let justChecked = e.target.value
        let foundInTheState = inTheState.indexOf(justChecked) // true or -1
        // indexOf method ? if found return -1 else returns index
        if(foundInTheState ===  -1) {
            inTheState.push(justChecked)
        }
        else
        {
            // if found pull out one item from index
            inTheState.splice(foundInTheState, 1)
        }
       
        setCategoryIds(inTheState)
        setOkCat(!okCat)
    }
  
    // show products by star rating
    const handleStarClick = (num) => {
        setCheckStar(true)
        console.log("prevStar ", prevStar )
        if(prevStar == "")
        {    
            setPrevStar(num)   
        }
        else{  
            if(prevStar == num)
            {
                setCheckStar(false)   
            }
            
            setPrevStar("")
        }
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" }
        })
        setPrice([0, 0])
        setCategoryIds([])
        setSub("")
        setStar(num)
        setBrand("")
    }
    const showStars = () => 
    {
        return (
            <>
                <Star 
                    starClick={handleStarClick}
                    numberOfStars ={5}
                />
                <Star 
                    starClick={handleStarClick}
                    numberOfStars ={4}
                />
                <Star 
                    starClick={handleStarClick}
                    numberOfStars ={3}
                />
                <Star 
                    starClick={handleStarClick}
                    numberOfStars ={2}
                />
                <Star 
                    starClick={handleStarClick}
                    numberOfStars ={1}
                />
            </>
        )
    }
    // show products by subcategories
    const showSubs = () => subs.map((s) => (<Menu.Item  key={s._id} ><Button 
        key={s._id} 
        style={{ cursor: "pointer" }} 
        className="p-1 m-1 badge badge-secondary" 
        onClick={() => handleSub(s)}>{s.name}</Button></Menu.Item>))
    const handleSub = (s) => {
        
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        })
        setPrice([0, 0])
        setStar("")
        setCheckStar(false)
        setPrevStar("")
        setSub(s)
        setOkSub(!okSub)
        setBrand("")
    }
    const showBrands = () => brands.map((b) => (<ItemGroup key={b} ><Radio 
        key={b}
        className="pb-1 pl-1 pr-4" 
        value={b} 
        name={b} 
        checked={b === brand} 
        onChange={handleBrand} 
    >{b}</Radio></ItemGroup>))

    const handleBrand = (e) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" }
        })
        setCategoryIds([])
        setStar("")
        setCheckStar(false)
        setPrevStar("")
        setSub("")
        setBrand(e.target.value)
        setOkBrand(!okBrand)
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 pt-2">
                    <h4>Search/Filter</h4>
                    <hr />
                    <Menu mode="inline" defaultOpenKeys={['1', '2', '3', '4', '5', '6', '7']} >
                        {/* price */}
                        <SubMenu key="1" title={<><span className="h6"><DollarOutlined /></span><span className="ml-3">Price</span></>}>
                         
                            <Slider 
                                className="ml-4 mr-4" 
                                tipFormatter={(v) => `${v}`} 
                                range 
                                value={price} 
                                onChange={handleSlider}
                                max="10000"
                            />
                        </SubMenu>
                      
                        {/* category */}
                        <SubMenu key="2" title={<><span className="h6"><DownSquareOutlined /></span><span className="ml-3">Categories</span></>}>
                            <ItemGroup key="2.1" style={{marginTop: "+10px"}}>
                            {
                                categories.map((c) => (
                                    <Menu.Item key={c._id}>
                                        <Checkbox checked={categoryIds.includes(c._id)} onChange={handleChange} className="pb-2 pl-4 pr-4" value={c._id} name="category">{c.name}</Checkbox>
                                    </Menu.Item>
                                ))
                            }
                            </ItemGroup>
                        </SubMenu>
                        {/* rating */}
                        <SubMenu key="3" title={<><span className="h6"><StarOutlined /></span><span className="ml-3">Rating</span></>}>
                            <ItemGroup className="pr-4 pl-4 pb-4">
                                {showStars()}
                            </ItemGroup>
                        </SubMenu>
                        {/* sub categories */}
                        <SubMenu key="4" title={<><span className="h6"><DownSquareOutlined /></span><span className="ml-3">Sub Categories</span></>}>
                            <ItemGroup key="4.1" style={{marginTop: "+10px"}}>
                            {
                                showSubs()
                            }
                            </ItemGroup>
                        </SubMenu>
                        {/* sub categories */}
                        <SubMenu key="5" title={<><span className="h6"><DownSquareOutlined /></span><span className="ml-3">Brands</span></>}>
                            
                            {
                                showBrands()
                            }
                            
                        </SubMenu>
                    </Menu>
                </div>
                <div className="col-md-9 pt-9">
                    {
                        loading ? (<h4 className="text-danger">
                            Loading...
                        </h4>
                        ) : (
                        <h4 className="text-danger">
                            Products...
                        </h4>)
                    }
                    {products.length < 1 && <p>No products found</p>}
                    <div className="row pb-5">
                        {products.map((p) => (<div key={p._id} className="col-md-4 mt-3">
                            <ProductCard product={p} />
                        </div>))}
                    </div>
                </div>
            </div>
        </div>
    )
}
