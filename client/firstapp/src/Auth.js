import { useNavigate } from "react-router-dom"

const Auth= ()=>{

    const navigate= useNavigate()
   
    const onSubmit= (data)=>{
        const username=data
        fetch("http://localhost:4000/users/" + username).then(
            resp=>{return resp['status']}
        ).then(data=>
            {
                if (data===200){
                sessionStorage.setItem("username", username)
                navigate("/contacts")}
            else {
                console.log('user does not exist')
            }
        })

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

    <script>
        
    </script>
</div>);
}

export default Auth