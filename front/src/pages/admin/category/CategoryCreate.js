import React, {useState, useEffect} from 'react'
import AdminNav from '../../../component/nav/AdminNav'
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'
import {getCategories, removeCategory, createCategory} from "../../../functions/category"
import {Link} from 'react-router-dom'
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import CategoryForm from '../../../component/forms/CategoryForm'
import LocalSearch from '../../../component/forms/LocalSearch'

const CategoryCreate = ({history}) => {
    const {user} = useSelector(state => ({...state}))
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([]);

    //searching filtering
    const [keyword, setKeyword] = useState("");
    useEffect(() => {
        loadCategories();
    }, [])

    const loadCategories = () => getCategories().then((c) => setCategories(c.data));


  

    const handleRemove = async(slug) => {
        
        let answer = window.confirm("Êtes vous sûr de vouloir supprimer ?")
        if(answer){
            setLoading(true)
            removeCategory(slug, user.token)
            .then(res => {
                setLoading(false)
                toast.error(`${res.data.name} deleted`)
                loadCategories()
                history.push('/admin/category/')
            })
            .catch(err => {
                if(err.response.status === 400) 
                {
                    setLoading(false);
                    toast.error(err.response.data);
                }
               
            })
        }
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        createCategory({name}, user.token)
        .then(res => {
            console.log(res)
            setLoading(false)
            setName('')
            toast.success(`"${res.data.name}" is created`)
            loadCategories()
        })
        .catch(err => {
            setLoading(false)
            if(err.response.status === 400) toast.error(err.response.data)
        });
    }
  
    // step 4

    const searched = (keyword) => (c) =>c.name.toLowerCase().includes(keyword)
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    {loading ? <h4 className="text-danger">Loading</h4> : <h4>Create category</h4>}
                    <CategoryForm 
                        handleSubmit={handleSubmit} 
                        name={name} 
                        setName={setName} 
                    />
                    {/* step 2 and step 3*/}
                    <LocalSearch keyword={keyword} setKeyword={setKeyword} />
                    <hr />
                    {/* step 5 */}
                    {categories.filter(searched(keyword)).map((c) => (
                    <div className="alert alert-secondary" key={c._id} style={{height: "4em", lineHeight: "4em"}}>
                        <span style={{ display: "inline-block", float: "left", height: "4em", lineHeight: "4em", verticalAlign: "middle", marginTop: "-.7em" }}>{c.name}</span> <span onClick={() => handleRemove(c.slug)} className="btn btn-sm" style={{ float: "right" }}><Link to={`/admin/categories/${c.slug}`}><DeleteOutlined className="text-danger" /></Link></span><span className="btn btn-sm" style={{ float: "right" }}><Link to={`/admin/category/${c.slug}`}><EditOutlined className="text-warning"  /></Link></span>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default CategoryCreate