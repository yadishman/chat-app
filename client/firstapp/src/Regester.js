import { BiArrowFromRight } from "react-icons/bi"
import { useNavigate } from "react-router-dom"


const Register= ()=>{
    
    const navigate=useNavigate()
    const  reguser= (e)=>{
        e.preventDefault()
        const formdata= new FormData(document.getElementById("register"))
        console.log(Array.from(formdata))
        try{
        fetch("http://localhost:4000/createuser", {
            method: 'POST',
           
            body: formdata
        }).then((resp)=>{
            return resp['status']
        }).then((data)=>{
            data===201?(
            navigate("/"))
           :
            console.log("fool")
        })}
        catch(e){
            return false
        }
        return false
            
        
    }
    return (<div className="login-container">
    <div className="login-class" >
   
        <form  className="login-form" id="register" onSubmit={reguser} >
        <h1 className="main-title">Chat-app</h1>
            <input className="username-input" placeholder="UserName" minLength={3}  name="username"/>
            <input className="username-input2" placeholder="PhoneNumber" minLength={3} name="phonenumber"/>
            <input type="file" name="profilepicture" id="files"/>
            <label for="files" className="file-man">upload picture</label>
            <button className="login-button" type="submit">Register</button>
        </form>
       
        
    </div>
    <script>
        
    </script>
</div>);
}

export default Register