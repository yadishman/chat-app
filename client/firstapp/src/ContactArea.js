import { useEffect } from "react"
import { useState } from "react"
import { getContacts } from "./controller/messagecontroller"
const ContactArea = (props)=>{
    
    const [contacts,setContacts]= useState([])
    
    useEffect(()=>{
       const userna= sessionStorage.getItem("username")
       getContacts(userna,props.setCurrentuser, setContacts)
          
    }, [props.sendto, props.isOnline])

    

    
    return (
        <div className="all-contacts" id="contacts">
        {contacts.map((contact)=>(     
            <button key={contact._id} className="contact-class" onClick={()=>{props.onChoos(contact.username)}} >
                <div className="contact-meta">
                    <div className="contact-phone">{
                    (contact.profilepic)!==undefined?<div style={{display:"flex" , flexDirection:"row"}}><img src={contact.profilepic} />
                    {contact.isOnline===true?<button className="profile-online"></button>: <button className="profile-noonline"><p>.</p></button>} 
                     </div>:
                    <div ><div className="no-profiel"><p className="contact-main2">{contact.username[0].toUpperCase()}</p>
                     </div>
                     {contact.isOnline===true ? <div className="noprofile-online"></div>:  <div className="noprofile-noonline"></div>}
                    
                     </div>}</div>
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

