import React from 'react'
import Resizer from 'react-image-file-resizer'
import axios from 'axios'
import {useSelector} from 'react-redux'
import { Avatar, Badge } from 'antd';
// responseUriFunc => gives as the binary data in a callback function
// data we need to send to the server
const FileUpload = ({values, setValues, setLoading}) => {
    const {user} = useSelector((state) => ({ ...state }))
    const {images} = values
    const FileUploadAndResize = (e) => {
        // resize
        let files = e.target.files;
        let allUploadedFiles = values.images;
        if(files) {
            setLoading(true)
            for(let i = 0; i < files.length; i++)
            {
                Resizer.imageFileResizer(files[i], 720, 720, 'JPEG', 100, 0, (uri) => {
                    
                    axios.post(`${process.env.REACT_APP_API}/uploadimages`, {image: uri},
                        {
                            headers: {
                                authtoken: user ? user.token : "",
                            },
                        }
                    )
                    .then(res => {
                        console.log('IMAGE UPLOAD RES DATA', res)
                        setLoading(false)
                        allUploadedFiles.push(res.data)
                        setValues({...values, images: allUploadedFiles})
                    })
                    .catch(err => {
                        setLoading(false)
                        console.log('CLOUDINARY UPLOAD ERROR', err)
                    })
                }, "base64");
            }
        }

    }
    
    const handleImageRemove = (public_id) => {
        setLoading(true)
        // don't forget to send headers if protected route
        axios.post(`${process.env.REACT_APP_API}/removeimage`, {public_id}, {
            headers: {
                authtoken: user ? user.token : "",
            }
        })
        .then((res) => {
            setLoading(false)
            let filteredImages = images.filter((item) => {
                return item.public_id !== public_id
            })
            setValues({...values, images: filteredImages})
        })
        .catch((err) => {
            console.log(err);
            setLoading(false)
        })
    }

    return (
        <>
            <div className="row">
                {values.images && values.images.map((image) => (
                    <Badge count="X" key={image.public_id} onClick={(e) => handleImageRemove(image.public_id) } style={{ cursor: "pointer" }} >
                        <Avatar src={image.url} size={100} shape="square" className="ml-3" />
                    </Badge>
                ))}
            </div>
            <div className="row">
                <label className="btn btn-primary btn-raised mt-3">
                    Choose file
                    <input 
                        name="images"
                        type="file" 
                        multiple 
                        hidden
                        accept="images/*" 
                        onChange={FileUploadAndResize} 
                    />
                </label>
            </div>
        </>
        
    )
   
}

export default FileUpload