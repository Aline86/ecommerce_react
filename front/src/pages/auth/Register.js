import React, {useState, useEffect} from 'react'
import {auth} from '../../firebase'
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'

const Register = ({history}) => {
    const [email, setEmail] = useState("")
    const {user} = useSelector((state) => ({...state}))
    useEffect(() => {
        if(user && user.token)
        {
            history.push("/");
        }
    }, [user, history])
    const handleSubmit = async (e) => {
        e.preventDefault()
        const config = {
            // Récupération de la variable d'environnment dans .env
            url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
            handleCodeInApp: true
        }
        await auth.sendSignInLinkToEmail(email, config)
        toast.success(`Un e-mail a été envoyé à l'adresse suivante : ${email}. Cliquer sur le lien pour compléter l'inscription`);
        // save the mail in localstorage
        window.localStorage.setItem('emailForRegistration', email)
        // clear state
        setEmail('');
        
    }
    const registerForm = () => <form onSubmit={handleSubmit}>
        <input 
            type="email" 
            className="form-control" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="Your email"
            autoFocus
            />
            <br />
        <button type="submit" className="btn btn-raised">Register</button>

    </form>
    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Register</h4>
                    {registerForm()}
                </div>
            </div>
        </div>
    )
}

export default Register;