import { useNavigate } from "react-router-dom"


const CreateContact= ()=>{
    const navigate=useNavigate()
    function reguser(phone){
        const sendername=sessionStorage.getItem('username')
       
        const phonenumber=phone
        fetch("http://localhost:4000/createcontact", {
            method: 'POST',
            headers :{'Content-Type': 'application/json'},
            body: JSON.stringify({sendername, phonenumber})
        }).then((resp)=>{
            return resp['status']
        }).then((data)=>{
        if (data===200){
            navigate("/contacts")}
        else if(data===503){
            alert("adding your self as contact not allowded")
        }
        else if(data===502){
            alert("contact already exist in the list")
        }
        else {
            alert("user has joind chatapp yet")
        }})
            
        
    }
    return (<div className="login-container2">
    <div className="login-class2" >
        <div  className="login-form" >
            
            <input className="username-input2" placeholder="PhoneNumber" id="phonenumber"/>
            <button className="login-button3" onClick={(e)=>{reguser(document.querySelector(".username-input2").value)}}>Add Contact</button>
        </div>
    </div>
    <script>
        
    </script>
</div>);
}

export default CreateContact