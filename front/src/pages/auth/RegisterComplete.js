import React, {useState, useEffect} from 'react'
import {auth} from '../../firebase'
import {toast} from 'react-toastify'
import {useDispatch, useSelector} from 'react-redux'
import {createOrUpdateUser} from "../../functions/auth"


const RegisterComplete = ({history}) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {user} = useSelector((state) => ({ ...state }));
    useEffect(() => {
        
        setEmail(window.localStorage.getItem('emailForRegistration'))
        console.log(window.localStorage.getItem('emailForRegistration'))
    }, [history])
    let dispatch = useDispatch()
    const handleSubmit = async (e) => {
        e.preventDefault()
        // validation
        if(!email || !password)
        {
            toast.error('Le Mail et le mot de passe doivent être insérés.')
            return;
        }
        if(password.length < 6){
            toast.error("Le mot de pass doit faire au moins 6 caractères.")
            return;
        }
        try {
            const result = await auth.signInWithEmailLink(
                email, 
                window.location.href
            );
            if(result.user.emailVerified) {
                window.localStorage.removeItem('emailForRegistration')
                // remove user Email from localStorage
                let user = auth.currentUser
                await user.updatePassword(password) 
                            
                // get user id token
                const idTokenResult = await user.getIdTokenResult()
                // redux store
                createOrUpdateUser(idTokenResult.token)
                .then((res) => 
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
                    })
                      
                )
                .catch();
                  // redirect
                  history.push('/')
            }
        } catch (error) {
        
            toast.error(error)
        }
    }
    const completeRegistrationForm = () => 
        <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                className="form-control" 
                value={email} 
                disabled
                />
            <input 
                type="password" 
                className="form-control" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                autoFocus
                />
            <br />
            <button type="submit" className="btn btn-raised">
                Complete Registeration
            </button>
        </form>
    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Register</h4>
                    {completeRegistrationForm()}
                </div>
            </div>
        </div>
    )
}

export default RegisterComplete;