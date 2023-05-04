import { useNavigate } from "react-router-dom"
import { getUser } from "./controller/messagecontroller"

const Auth= (props)=>{

    const navigate= useNavigate()
   
    const onSubmit= (data)=>{
        const username=data

        getUser(username,navigate, props.setIsOnline)
      
    }

    return (<div className="login-container">
    <div className="login-class" >
        <div  className="login-form" action="/contacts">
        <h1 className="main-title">Welcome</h1>
            <input className="username-input" placeholder="UserName" id="username"/>
            <button className="login-button" onClick={()=>{
                onSubmit(document.querySelector("#username").value)
            }}>Login</button>
            <div className="registrationclass"><p className="registerNow"> Don't have an account. Register <a href="/register">Here</a></p></div>
            
        </div>      
    </div>
</div>);
}

export default Auth