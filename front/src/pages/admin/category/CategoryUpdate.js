import React, {useState, useEffect} from 'react'
import AdminNav from '../../../component/nav/AdminNav'
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'
import {getCategory, updateCategory} from "../../../functions/category"
import CategoryForm from '../../../component/forms/CategoryForm'

// Pour récupérer élément dans url => 2 options : useParams hook ou match qui est disponible via browserRouter et qui contient les infos de l'url directement
// Pas besoin d'utiliser useParams mais match.params.slug
const CategoryUpdate = ({history, match}) => {
    // grab the user from the state
    const {user} = useSelector(state => ({...state}))
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadCategory();
    }, [])

    const loadCategory = () => 
        getCategory(match.params.slug).then((c) => setName(c.data.name));

   

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        console.log("name " + name)
        updateCategory(match.params.slug, {name}, user.token)
        .then(res => {
            console.log(res)
            setLoading(false)
            setName('')
            toast.success(`"${res.data.name}" is updated`)
            history.push('/admin/category')
        })
        .catch(err => {
            setLoading(false)
            if(err.response.status === 400) toast.error(err.response.data)
        });
    }

    const categoryForm = () => <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label>Name</label>
            <input 
                type="text" 
                className="form-control" 
                onChange={e => setName(e.target.value)} 
                value={name}
                autoFocus
                required
            />
            <br />
            <button className="btn btn-outline-primary">Save</button>
        </div>
    </form>
    
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    {loading ? <h4 className="text-danger">Loading</h4> : <h4>Update category</h4>}
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
export default CategoryUpdate