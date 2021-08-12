import React, { useState } from 'react'
import db_logo from '../assets/dashboard_logo.png'
import { useHistory } from "react-router-dom";
import {auth} from "../firebase"

function Login () {

    const[email, setEmail]= useState('')
    const[password, setPassword]= useState('')
    const[remember, setRemember]= useState()

    let history = useHistory();

    const handleSubmit=(event) =>{
        event.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            // var user = userCredential.user;
            history.replace('/main')
            // ...
        })
        .catch((error) => {
            // var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
        });
      }

   return (
       <div className="login">
           <div className='login-div'>
                <div className='login-div-left'>
                    <h3>Login</h3>
                    <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='Email' name='email' 
                        onChange={(val)=>{
                            setEmail(val.target.value)
                        }}
                    />
                    <input type="password" placeholder='Password' name='password' 
                        onChange={(val)=>{
                            setPassword(val.target.value)
                        }}
                    />
                    <div style={{display:'flex', flexDirection:'row', width:'70%'}}>
                        <input type="checkbox" name ='remember' 
                            onChange={(val)=>{
                                setRemember(val.target.value)
                            }}
                        />    
                        <div style={{paddingLeft:10, display:'flex', width:'100%', alignItems:'center', justifyContent:'flex-start'}}>Remember me</div> 
                    </div>
                    <button type="submit" value="Login"> Login </button>
                    </form>
                </div>
                <div className='login-div-right'>
                    <img src={db_logo} alt="Logo" />
                </div>
           </div>
       </div>
   )
}

export default Login;