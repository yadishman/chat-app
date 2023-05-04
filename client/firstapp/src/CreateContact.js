import { useNavigate } from "react-router-dom"
import { createContact } from "./controller/messagecontroller"


const CreateContact= ()=>{
    const navigate=useNavigate()
    function reguser(phone){
        const sendername=sessionStorage.getItem('username')
        const phonenumber=phone
       
        createContact(sendername,phonenumber,navigate)       
        
    }

    return (<div className="login-container2">
    <div className="login-class2" >
        <div  className="login-form" >
            <input className="username-input2" placeholder="PhoneNumber" id="phonenumber"/>
            <button className="login-button3" onClick={(e)=>{reguser(document.querySelector(".username-input2").value)}}>Add Contact</button>
        </div>
    </div>   
</div>);
}

export default CreateContact