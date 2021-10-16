import React, {useState, useEffect} from 'react'
import AdminNav from '../../../component/nav/AdminNav'
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'
import {getCategories, getCategory} from "../../../functions/category"
import {updateSub, createSub, getSub} from "../../../functions/sub"
import {Link} from 'react-router-dom'
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import CategoryForm from '../../../component/forms/CategoryForm'
import LocalSearch from '../../../component/forms/LocalSearch'

const SubUpdate = ({match, history}) => {
    const {user} = useSelector(state => ({...state}))
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([]);
    const [parent, setParent] = useState([]);

    useEffect(() => {
        loadCategories();
        loadSub()
     
    }, [])

    const loadSub = () => getSub(match.params.slug).then((s) => {
        setName(s.data.name)
        setParent(s.data.parent)
    });
    
    const loadCategories = () => getCategories().then((c) => setCategories(c.data));
    
   
  
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        updateSub(match.params.slug, {name, parent}, user.token)
        .then(res => {
            console.log(res)
            setLoading(false)
            setName('')
            toast.success(`"${res.data.name}" is updated`)
            history.push('/admin/sub')
        })
        .catch(err => {
            setLoading(false)
            if(err.response.status === 400) toast.error(err.response.data)
        });
    }
  
    // step 4

    const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword)
  
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    {loading ? <h4 className="text-danger">Loading</h4> : <h4>Create sub category</h4>}
                    <div className="form-group">
                        <label>Parent category</label>
                        <select 
                            name="category" 
                            className="form-control"
                            onChange={(e) => setParent(e.target.value)}   
                        >
                            <option>Please select</option>
                            {categories.length > 0 && categories.map((c) => (
                                <option key={c._id} value={c._id} selected={c._id === parent}>
                                    {c.name}
                                </option>)
                                )
                            }
                        </select>
                    </div>
                    <CategoryForm 
                        handleSubmit={handleSubmit} 
                        name={name} 
                        setName={setName} 
                    />
                    <hr />
                </div>
            </div>
        </div>
    )
}
export default SubUpdate