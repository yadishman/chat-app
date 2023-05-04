import {BsFillCameraVideoFill} from "react-icons/bs"
import {IoMdCall, } from 'react-icons/io'
import { useEffect, useState } from "react"
import { ImAttachment } from "react-icons/im"
import ScrollToBottom from 'react-scroll-to-bottom'
import Drawers from "./Drawer"
import ContactArea from "./ContactArea"
import {AiFillFile} from "react-icons/ai"
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { getMessages, postImage, postNonImage, postVideo,  } from "./controller/messagecontroller"
import { sendMessage } from "./functionalites/messagefunctions"
import { useNavigate } from "react-router-dom"
import  ReactLoading from 'react-loading'

let _id=0
const Whole= (props)=>{
    const navigate= useNavigate()
    const [latest,setLatest]= useState()
    const username= sessionStorage.getItem('username')
    const [allmessages,setAllMessages]=useState([])
    const [currentuser,setCurrentuser]= useState()
    const [sendto, setSendto]= useState(null)
    const [fileupload, setFileupload]=useState() 
    const [open, setOpen]= useState(false)
    const [recievingCall, setRecievingCalling]=useState(false)
    const [callerSignal, setCallerSignal]= useState()
    const [callFrom,setCallFrom]= useState()
    const [isTyping,setIsTyping]=useState(false)

    const typingText = (e)=>{
        let random= e.target.value
        if((random.trim()).length ===0){
            props.socket.emit("finished")
            console.log("empty")
        }
        else {
        props.socket.emit("istyping", {sender:username, to:sendto})
    }
    }

    const timeReturn= (data)=>{
        if(data.length > 6){
        const time= data.slice(11,16)
        return time}
        return data

    }
    const openEmojis= ()=>{
        setOpen((prev)=>(!prev))
    }
    const selectedEmoji = (e)=>{
                
        document.querySelector(".send-message").value+=e.native
    
    }

    const download= (data, file)=>{
        
           let a=document.createElement('a')
           a.href=file
           a.download=data.metadata.filename
            a.click()
    }


    props.socket.on("istyping",(data)=>{
        if (data.sender===sendto && data.to===username){
        setIsTyping(true)
        }
        
    })

    props.socket.on("finished",()=>{
        
        setIsTyping(false)
    })
useEffect(()=>{
    props.socket.on("recievecall", (data)=>{
        if (data.to===username) {
            
            setRecievingCalling(true)
            setCallerSignal(data.signal)  
            setCallFrom(data.from)   
        }

    })
},[])
    
useEffect(()=>{
    
    setIsTyping(false)
    getMessages(username,sendto,setAllMessages)
   
    const recievemessage=(data)=>{
        if(data.reciever===username && data.author===sendto){
                setAllMessages((list)=>[...list,data]) 
               
            } 
        else {
            setLatest(data)
        }
    }    
    if (sendto!==null){
    props.socket.on("message", recievemessage)}
    return ()=>{
        if(sendto!==null){
        props.socket.off("message",recievemessage)}
    }

}, [sendto])

const onChoos=(to)=>{
    const reciever=to
    setSendto(reciever)
}

const sendFile= (e)=>{
    const date= new Date()
    const createdAt= date.getHours() + ":" +date.getMinutes()
    const files=e.target.files[0]
    e.target.value=null
    const author= username
    const reciever= sendto
    const message=files.name
   
    if(files.type.includes("image")===false && files.type.includes("video")===false){
    postNonImage(author, message, reciever, "non-text")
    setAllMessages((list)=>[...list, {author,message,reciever, messagetype:"non-text",createdAt}])}
   
    if (files){
       
        const reader= new FileReader()
        
        if(files.type.includes("image")!==false) {
            const blobdata=URL.createObjectURL(files)        
            setAllMessages((list)=>[...list, {author,message:blobdata,reciever, messagetype:"image",createdAt}])         
           
            postImage(files,author,reciever)
           
          
           }
         
        if(files.type.includes("video")!==false) {
            const blobdata=URL.createObjectURL(files)        
            setAllMessages((list)=>[...list, {author,message:blobdata,reciever, messagetype:"video",createdAt}])         
           
            postVideo(files,author,reciever)
           
          
           }

        
        reader.onload= () =>{
            let buffer= new Uint8Array(reader.result)
            shareFile(

                {   message:files.name,
                    author,
                    reciever,
                    filetype : files.type,
                    filename:files.name,
                 max_buffer_size: buffer.length,
                buffer_size: 1024},
                buffer
            )
        }
        reader.readAsArrayBuffer(files)
       
    }
  
}
    


  
const shareFile= (metadata,buffer)=>{
    props.socket.emit("file-meta", {metadata:metadata})
    props.socket.on("fs-shares", ()=>{
        let chunk= buffer.slice(0,metadata.buffer_size)
        buffer= buffer.slice(metadata.buffer_size, buffer.length)
        if(chunk.length!==0){
            console.log("ok")
            props.socket.emit("file-raw", {
                buffer: chunk
            })
        }
    })
}

const fileshare={}
props.socket.on("fs-meta",(metadata)=>{
    fileshare.metadata=metadata
    fileshare.transferred=0
    fileshare.buffer=[]
    props.socket.emit("fs-start")
})

useEffect(()=>{
    const sharefiles= (buffer)=>{ 
        const date= new Date()
         const createdAt= date.getHours() + ":" +date.getMinutes()
        const sender=username
        fileshare.buffer.push(buffer)
        fileshare.transferred +=buffer.byteLength
        setFileupload((100*fileshare.transferred/fileshare.metadata.max_buffer_size).toFixed(2)  + "%")
        if (fileshare.transferred===fileshare.metadata.max_buffer_size){
            setFileupload()
           if( fileshare.metadata.author===sendto && fileshare.metadata.reciever===sender){
            const blob=new Blob(fileshare.buffer, { type: fileshare.metadata.filetype})
            let file= URL.createObjectURL(blob)

            if(fileshare.metadata.filetype.includes("image")){
                const author= fileshare.metadata.author
                const message= file
                const reciever= fileshare.metadata.reciever
                
                setAllMessages((list)=>[...list,{author, message, reciever, messagetype:"image",createdAt}])
                
            }

            else if (fileshare.metadata.filetype.includes("video")){
                console.log("it is a video")
                const author= fileshare.metadata.author
                const message= file
                const reciever= fileshare.metadata.reciever
                
                setAllMessages((list)=>[...list,{author, message, reciever, messagetype:"video",createdAt}])


            }
            else {
                const message= fileshare.metadata
                message["createdAt"]=createdAt

                setAllMessages((list)=>[...list,message])
                console.log(fileshare.metadata.filetype.includes("images"))
                download(fileshare,file)
            }
           }     
            
        }
    
        else {
            props.socket.emit("fs-start")
        }   
    
    }
    if (sendto!==null){
        props.socket.on("fs-share",sharefiles)}
        return ()=>{
            if(sendto!==null){
                props.socket.on("fs-share",sharefiles)}
        }
    

},[sendto])


    return(
        <div className= "container">
        <div className="left-side">
            <Drawers currentuser={currentuser} setIsOnline={props.setIsOnline}/>
            <div className="bottom-side">      
            <ContactArea  setCurrentuser={setCurrentuser}  onChoos={onChoos}  sendto={sendto} latest={latest}  socket={props.socket} isOnline={props.isOnline}/>
                
            </div>    
        </div>
        <div className="right-side">
            {recievingCall&&
            <div className="notification">
                <p className="call-income" style={{paddingLeft:"4px"}}>Incoming call from {callFrom}</p>
                <div className="cancel-or-open">
                <button className="goto" onClick={()=>{navigate("/call", {state:{sendto,currentuser,callFrom,callerSignal,recievingCall}})}}>go to call</button>
                <button className="cancel" onClick={()=>{setRecievingCalling(false)}}>cancel</button></div>
                </div>}
            {sendto!==null?<div className="some-info">
                <div className="username-class" style={{display:"flex" , flexDirection:"column"}}>
                
                <p >{sendto}</p>
                {isTyping&&
                 <div style={{display:"flex", flexDirection:"row"}}>

                 <p style={{marginTop:"-17px" , fontSize:"10px" , color:"gray"}}>typing </p>
                 <div style={{marginTop:"-19px" ,paddingLeft:"3px"}}> 
                 <ReactLoading width={"13px"} color='rgb(0, 255, 255)' />
                 </div>
                 </div> }
               
                </div>
                <div className="extra">
                    <IoMdCall className="call-class"/>
                <BsFillCameraVideoFill className="video-class"  onClick={()=>{navigate("/call", {state:{sendto,currentuser}})}}/>
                
                </div>
               
            </div>: <div  >
                
               
            </div>}
           
            <ScrollToBottom className="chat-area">
               
                <div className="all-message">
                  
                    {allmessages.map((allmessage)=>( 

                      <div   className= {username===allmessage.author?"reply-message":"message"} key={allmessage._id} >
                         {allmessage.messagetype!=="text"?allmessage.messagetype==="image" ?<img className="send-image" src={allmessage.message}/> :
                         allmessage.messagetype==="image-blob" ? <img className="send-image" src={allmessage.message}/>:allmessage.messagetype==="video"?<video width={"30px"} height={"30px"} autoPlay controls loop>
                         <source src={allmessage.message}></source>
                     </video>:allmessage.messagetype==="video-db"?
                     <video width={"30px"} height={"30px"} autoPlay controls loop>
                        <source src={allmessage.message}></source>
                    </video>:<p className="main-message">{allmessage.message}</p>
                        : <p className="main-message"><AiFillFile style={{color:"gray" , paddingRight:"10px"}}/>{allmessage.message} </p>
                         }
                        {allmessage.createdAt && <p className="time">{timeReturn(allmessage.createdAt)}</p>
                          }
                     </div>
                    ))}
                    
                    {(fileupload!=="100%" && fileupload!==undefined && fileupload!=='200%')? <p className="progress"> file being uploaded .... {fileupload}</p> : <div></div>}
                </div>
            </ScrollToBottom>
            {sendto !== null ?<div className="send-area" id="send-area" >
               
                <input type="file" className="send-file" onChange={sendFile} id="file"/>
                
                <label htmlFor="file" className="attach"><ImAttachment/></label>
               
                <input type="text" className="send-message" placeholder='type something' pattern=".{3,}" required id="send" onKeyDown={(e)=>{e.key==='Enter'&& 
                sendMessage(document.querySelector(".send-message").value,username,sendto,postNonImage,setAllMessages,props.socket,_id,
                setIsTyping)
                }} onChange={typingText}/>

                <button className="emojis" onMouseOver={()=>{openEmojis()}} >🙂</button>
                {open ?
                <div className="emoji-data">
                <Picker data={data} onEmojiSelect={selectedEmoji } theme={"light"}  /></div>
                :<div></div>}
               
            </div>:<div >
            </div>}
        </div>

</div>
    
    );
}

export default Whole
