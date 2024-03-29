import React, {useState, useEffect} from 'react'
import {auth, googleAuthProvider} from '../../firebase'
import {toast} from 'react-toastify'
import {Button} from 'antd'
import {
    MailOutlined,
    GoogleOutlined
} from '@ant-design/icons';
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {createOrUpdateUser} from "../../functions/auth"

const Login = ({history}) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [getparam, setParam] = useState("")
    const {user} = useSelector((state) => ({ ...state }));
    const [routeParam, setRouteParam] = useState()
    useEffect(() => {
        let intended = history.location.state
        if (intended) {
            
            return
        }   
        else if (user && user.token) 
        {
           console.log("routeParam " + routeParam)
            if(routeParam)
            {
                history.push(routeParam)
            }
            else
            {
                history.push("/");
            }
           
        
            
            
        }
        
    }, [user, history])
    
    
    let dispatch = useDispatch()
    // Fait la connexion avec firebase pour voir si le user existe dans firebase

    const roleBasedRedirect = (res) => {
        // check if intended
        
        let intended = history.location.state
        setRouteParam(intended.from)
        if(intended){
            console.log("intended " + intended.from)
            history.push(intended.from)
        }
        else
        {
            if(res.data.role == 'admin'){
                history.push('/admin/dashboard');
            }
            else
            {
                history.push('/user/history')
            }
        }       
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
         
       
        // Méthode d'authentification firebase
        
        try {
            const result = await auth.signInWithEmailAndPassword(email, password)
            const {user} = result
            const idTokenResult = await user.getIdTokenResult() 
            createOrUpdateUser(idTokenResult.token)
            .then((res) => {
                
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: {
                        name: res.data.name,
                        email: res.data.email,
                        token: idTokenResult.token,
                        role: res.data.role,
                        _id: res.data._id,
                    },
                });
               
                roleBasedRedirect(res)
            })
            .catch(error => {   
              console.log(error)
             })
        } catch (error) {
      
           
            toast.error(error.message);
             
            
        }
            
        
        
      
        
        // history.push('/') 
      
    }
    // Login avec compte Google
    const googleLogin = () => {
        auth
        .signInWithPopup(googleAuthProvider)
        .then(async (result) => {
            const {user} = result
            const idTokenResult = await user.getIdTokenResult() 
            createOrUpdateUser(idTokenResult.token)
            .then((res) => {
                // Définition des paramètres de connexion mail + password // Faire en sorte que la co ne soit possible
                // que si les deux variables sont remplies 
                
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: {
                        name: res.data.name,
                        email: res.data.email,
                        token: idTokenResult.token,
                        role: res.data.role,
                        _id: res.data._id,
                    },
                });
                roleBasedRedirect(res)
            })
            .catch((err) => console.log(err));
            
        })
        .catch((err) => 
        {
            console.log(err)
            toast.error(err.message);
        })
    };
    const loginForm = () => <form onSubmit={handleSubmit}>
        <div className="form-group">
            <input 
                type="email" 
                className="form-control" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Your email"
                autoFocus
            />
        </div>
        <br />
     
        <div className="form-group">
            <input 
                type="password" 
                className="form-control" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Your password"
            />
        </div>
        <Button
            onClick={handleSubmit}
            type="primary"
            className="mb-3"
            block
            shape="round"
            icon={<MailOutlined/>}
            size="large"
            name="path"
            value={history.location.state && history.location.state.from}
            disabled={!email || password.length < 6}
        >Login with Email/Password</Button>

    </form>
    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {loading ? (<h4 className="text-danger">Loading..</h4>) : (<h4>Login</h4>)}
                    {loginForm()}
                    <Button
                        onClick={googleLogin}
                        type="danger"
                        className="mb-3"
                        block
                        shape="round"
                        icon={<GoogleOutlined/>}
                        size="large"
                    >Login with Google
                </Button>
                <Link to="/forgot/password" className="float-right text-danger">Forgot password</Link>
                </div>
            </div>
        </div>
    )
}

export default Login;