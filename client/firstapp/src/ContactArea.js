import { useEffect } from "react"
import { useState } from "react"

const ContactArea = (props)=>{

    const [contacts,setContacts]= useState([])
    useEffect(()=>{
        const userna= sessionStorage.getItem('username')
        fetch("http://localhost:4000/users/" + userna).then(
            resp=>{return resp.json()}
        ).then(data=>
            {
                console.log("user contact loaded successfully")
              
              props.setCurrentuser(data['user'])
              
               setContacts(contacts => data['contacts'])
            }
        )
        
    }, [contacts])
    
   
   

    

    return (
        <div className="all-contacts" id="contacts">
        {contacts.map((contact)=>(
            
               
            <button key={contact._id} className="contact-class" onClick={()=>{props.onChoos(contact.username)}} >
                <div className="contact-meta">
                    <div className="contact-phone">{
                    (contact.profilepic)!==undefined?<img src={contact.profilepic} />:
                     <div class="no-profiel"><p className="contact-main2">{contact.username[0].toUpperCase()}</p></div>}</div>
                    <div className="contact-name"><p className="contact-main">{contact.username}</p></div>
                    </div>
                </button>
               
        ))}
        <div className="message" style={{backgroundcolor:"rgb(225, 232, 243)", height: 0}}>
            <p className="main-message"></p>
        </div>
        <div className="reply-message" style={{backgroundcolor:"rgb(225, 232, 243)", height: 0}}>
            <p className="main-message"></p>
        </div>
    </div>
    )

}

export default ContactArea

