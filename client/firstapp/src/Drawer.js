import { BiArrowBack } from "react-icons/bi"
import { ImMenu } from "react-icons/im"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Drawer from 'react-modern-drawer'
import { loggingOut } from "./controller/messagecontroller"

const Drawers =(props)=>{

    const butt1= document.querySelectorAll(".noprofile-noonline")
    const butt2= document.querySelectorAll(".noprofile-online")
    const butt3= document.querySelectorAll(".profile-online")
    const butt4= document.querySelectorAll(".profile-noonline")
    
    const navigate= useNavigate() 

    const logOut= ()=>{
        const username= sessionStorage.getItem("username")
        loggingOut(username)
        props.setIsOnline()
        navigate("/")
    }
    const onExpand = (e)=>{
        // document.querySelector()
        document.querySelector(".right-side").style.opacity=0.6
        document.querySelector(".profile").style.display="flex"
        document.querySelector(".side-bar").style.width="30vw"
        const es= document.querySelectorAll(".nav-class")
        es.forEach(element => {
            element.style.width="30vw"
        });
        document.querySelector(".expand-menu-items").style.display="none"
        document.querySelector(".close-menu-items").style.display="flex"
        setTimeout(()=>{
            if( butt1!==null){
                butt1.forEach((butt)=>{
                    butt.style.display="none"
                })
                }
            if( butt2!==null){
                    butt2.forEach((butt)=>{
                        butt.style.display="none"
                    })
                    }
            if( butt3!==null){
                    butt3.forEach((butt)=>{
                        butt.style.display="none"
                    })
                    }
            if( butt4!==null){
                    butt4.forEach((butt)=>{
                        butt.style.display="none"
                    })
                    }
        
        },70)
        
    }
    const onContract = (e)=>{
        document.querySelector(".profile").style.display="none"
        document.querySelector(".right-side").style.opacity=1
        document.querySelector(".side-bar").style.width="0vw"
        document.querySelector(".close-menu-items").style.display="none"
        document.querySelector(".expand-menu-items").style.display="flex"
        setTimeout(()=>{
            if( butt1!==null){
                butt1.forEach((butt)=>{
                    butt.style.display="block"
                })
                }
            if( butt2!==null){
                    butt2.forEach((butt)=>{
                        butt.style.display="block"
                    })
                    }
            if( butt3!==null){
                    butt3.forEach((butt)=>{
                        butt.style.display="block"
                    })
                    }
            if( butt4!==null){
                    butt4.forEach((butt)=>{
                        butt.style.display="block"
                    })
                    }

        },200)
        
       
        const es= document.querySelectorAll(".nav-class")
        es.forEach(element => {
            element.style.width="0vw"
        });
       
    }

   
    return(
        <div>
           
           <div className="side-bar">
            <div className="user-profile-class">
            <div className="close-menu-items"> <BiArrowBack onClick={onContract}/></div>
            {props.currentuser && <div className="profile">
            {
                                (props.currentuser.profilepic)!==undefined?<img src={props.currentuser.profilepic} />:
                                 <div className="no-profiel2"><p className="contact-main3">{props.currentuser.username[0].toUpperCase()}</p></div>}
                <p>{props.currentuser.username}</p>
                </div>}
            </div>
            <button className='nav-class' onClick={()=>{navigate("/addcontacts")}}>add contacts</button>
            <button className='nav-class' >manage contacts</button>
            <button className='nav-class'>edit profile</button>
            <button className='nav-class' onClick={logOut}>Logout</button>
            </div> 
            <div className="top-side">
            <div className="expand-menu-items"> <ImMenu onClick={onExpand}/></div>
            </div>
        </div>
    )
}


export default Drawers

