import React from 'react'
import {Select} from 'antd'
const {Option} = Select;

const ProductUpdateForm = ({handleSubmit, handleChange, values, setValues, arrayOfSubs, setArrayOfSubIds, selectedCategory, handleCategoryClickSub, subOptions, categoryList}) => {
    // destructure
    const {title, description, price, category, subs, shipping, quantity, images, colors, brands, color, brand} = values

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Title :</label>
                <input type="text" name="title" className="form-control" value={title} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Description</label>
                <input type="text" name="description" className="form-control" value={description} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Price</label>
                <input type="text" name="price" className="form-control" value={price} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Shipping</label>
                <select name="shipping" className="form-control" onChange={handleChange} value={shipping === 'Yes' ? 'Yes' : 'No'}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>                        
            </div>
            <div className="form-group">
                <label>Quantity</label>
                <input type="number" name="quantity" className="form-control" value={quantity} onChange={handleChange} />                        
            </div>
            <div className="form-group">
                <label>Color</label>
                <select name="color" className="form-control" onChange={handleChange} value={color}>
                    {colors.map(c => <option key={c} value={c}>{c}</option>)}
                </select>                        
            </div>
            <div className="form-group">
                <label>Brand</label>
                <select name="brand" className="form-control" onChange={handleChange} value={brand}>
                    {brands.map(b => <option key={b} value={b} >{b}</option>)}
                </select>                        
            </div>
            <div className="form-group">
                <label>Category</label>
                <select 
                    name="category" 
                    className="form-control" 
                    onChange={handleCategoryClickSub} 
                    value={selectedCategory ? selectedCategory : category._id} 
                >
                    
                    {categoryList.length > 0 && categoryList.map(c => <option key={c._id} value={c._id} >{c.name}</option>)}
                </select>                        
            </div>
            <div>
                <label>Sub Categories</label>
                
                <Select
                /* ant design components use an array of values and not object to display items */
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    
                    value={arrayOfSubs}
                    onChange={value => setArrayOfSubIds(value)}
                >
                    { subOptions.length && subOptions.map(s => <Option key={s._id} value={s._id}>{s.name}</Option>) }
                </Select>
            </div>
            <button className="btn btn-outline-info">Save</button>
        </form>
    )
    }
export default ProductUpdateForm