import { BiArrowBack } from "react-icons/bi"
import { ImMenu } from "react-icons/im"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Drawer from 'react-modern-drawer'

const Drawers =(props)=>{
    const navigate= useNavigate() 
    const onExpand = (e)=>{
        document.querySelector(".right-side").style.opacity=0.6
        document.querySelector(".profile").style.display="flex"
        document.querySelector(".side-bar").style.width="25vw"
        document.querySelector(".nav-class").style.width="25vw"
       
        document.querySelector(".expand-menu-items").style.display="none"
        document.querySelector(".close-menu-items").style.display="flex"
    }
    const onContract = (e)=>{
        document.querySelector(".profile").style.display="none"
        document.querySelector(".right-side").style.opacity=1
        document.querySelector(".side-bar").style.width="0vw"
        document.querySelector(".close-menu-items").style.display="none"
        document.querySelector(".expand-menu-items").style.display="flex"
        document.querySelector(".nav-class").style.width="0vw"
       
    }

   
    return(
        <div>
           
           <div className="side-bar">
            <div className="user-profile-class">
            <div className="close-menu-items"> <BiArrowBack onClick={onContract}/></div>
            {props.currentuser && <div className="profile">
            {
                                (props.currentuser.profilepic)!==undefined?<img src={props.currentuser.profilepic} />:
                                 <div class="no-profiel2"><p className="contact-main3">{props.currentuser.username[0].toUpperCase()}</p></div>}
                <p>{props.currentuser.username}</p>
                </div>}
            </div>
            <button className='nav-class' onClick={()=>{navigate("/addcontacts")}}>add contacts</button>
           
            </div> 
            <div className="top-side">
            <div className="expand-menu-items"> <ImMenu onClick={onExpand}/></div>
            </div>
        </div>
    )
}


export default Drawers

