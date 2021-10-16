import React from 'react'
import {Select} from 'antd'
const {Option} = Select;

const ProductCreateForm = ({handleSubmit, handleChange, handleCategoryClickSub, values, setValues, subOptions}) => {
    // destructure
    const {title, description, price, categories, category, subs, shipping, quantity, images, colors, brands, color, brand} = values

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
                <select name="shipping" className="form-control" onChange={handleChange}>
                    <option>Please select if you want your items to be shipped</option>
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
                <select name="color" className="form-control" onChange={handleChange}>
                    <option>Please select your whished color</option>
                    {colors.map(c => <option key={c} value={c}>{c}</option>)}
                </select>                        
            </div>
            <div className="form-group">
                <label>Brand</label>
                <select name="brand" className="form-control" onChange={handleChange}>
                    <option>Please select your whished brand</option>
                    {brands.map(b => <option key={b} value={b} >{b}</option>)}
                </select>                        
            </div>
            <div className="form-group">
                <label>Categories : </label>
                <select name="category" className="form-control" onChange={handleCategoryClickSub}>
                    <option>Please select your whished category</option>
                    {values.categories.length > 0 && values.categories.map(c => <option key={c._id} value={c._id} >{c.name}</option>)}
                </select>                        
            </div>
            {subOptions.length > 0 &&
            (
                <div>
                    <label>Sub Categories</label>
                    <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="Please select"
                        value={subs}
                        onChange={value => setValues({...values, subs: value})}
                    >
                        
                        { subOptions.length && subOptions.map(s => <Option key={s._id} value={s._id}>{s.name}</Option>) }
                    </Select>

                </div>
                



                /*<div>
                    <div className="form-group">
                        <label>Sub Categories : </label>
                        <select name="subs" className="form-control" onChange={handleChange}>
                            <option>Please select your whished brand</option>
                            { subOptions.map(s => <option key={s._id} value={s._id}>{s.name}</option>) }
                        </select>                        
                    </div>
                    
                </div>*/
            )
            }
            <button className="btn btn-outline-info">Save</button>
        </form>
    )
    }
export default ProductCreateForm