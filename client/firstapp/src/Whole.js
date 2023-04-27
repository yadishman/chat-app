import {io} from "socket.io-client"
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

const socket= io('http://localhost:4000')
let _id=0

const Whole= ()=>{
   
    const username= sessionStorage.getItem('username')
    const [allmessages,setAllMessages]=useState([])
    const [currentuser,setCurrentuser]= useState()
    const [sendto, setSendto]= useState(null)
    const [fileupload, setFileupload]=useState() 
    const [open, setOpen]= useState(false)

    const timeReturn= (data)=>{
        
        const time= data.slice(11,16)
        return time

    }
    const openEmojis= ()=>{
        setOpen((prev)=>(!prev))
    }
    const selectedEmoji = (e)=>{
        
        
        
        document.querySelector(".send-message").value+=e.native

        
        
    }
    const postMessage = (url,author, message, reciever, messagetype)=>{
    
        fetch(url, {
            method: 'POST',
            headers :{'Content-Type': 'application/json'},
            body: JSON.stringify({author, message:message,reciever, messagetype:messagetype  })            
        }).then(resp=>{
            return resp['status']
        }).then( data => {
            data===201?
            console.log('success'):
            console.log('failure')
        })
    }
    const sendMessage= (data)=>{
        const author= username
        const message=data.trim()
        const reciever= sendto
        if(data.trim().length!==0){
        _id+=1
        postMessage("http://localhost:4000/messages",author, message, reciever, "text" )
        socket.emit("usermessage", {author,message,reciever,_id, messagetype:"text"})
        setAllMessages((list)=>[...list, {author,message,reciever, messagetype:"text"}])
        document.querySelector(".send-message").value=""}
        else{
            console.log("empty submission")
        }

    }
    const download= (data, file)=>{
        
           let a=document.createElement('a')
           a.href=file
           a.download=data.metadata.filename
            a.click()
    }
    
useEffect(()=>{
    const sender=sessionStorage.getItem('username')
    fetch("http://localhost:4000/messages/" + sender + "&" + sendto ).then(resp=>{
        return resp.json()
    }).then( data => {
            setAllMessages(allmessages => data['message'])        
    })
    const recievemessage=(data)=>{
        if(data.reciever===sender && data.author===sendto){
                setAllMessages((list)=>[...list,data])    
            } 
    }    
    if (sendto!==null){
    socket.on("message", recievemessage)}
    return ()=>{
        if(sendto!==null){
        socket.off("message",recievemessage)}
    }

}, [sendto])

const onChoos=(to)=>{
    const reciever=to
    setSendto(reciever)
}

const sendFile= (e)=>{
   
    
    
    const files=e.target.files[0]
    
    
    const author= sessionStorage.getItem("username")
    const reciever= sendto
    const message=files.name
   
    if(files.type.includes("image")===false){
    postMessage("http://localhost:4000/messages",author, message, reciever, "non-text")
    setAllMessages((list)=>[...list, {author,message,reciever, messagetype:"non-text"}])}
   
   
   
    if (files){
       
        const reader= new FileReader()
        
        if(files.type.includes("image")!==false) {
            const blobdata=URL.createObjectURL(files)
            const message=files
           
            setAllMessages((list)=>[...list, {author,message:blobdata,reciever, messagetype:"image"}])
           
            const formdata=new FormData()
            formdata.append("imagemessage", files, files.name)
            formdata.append("message",files.name)
            formdata.append("author", author)
            formdata.append("reciever", reciever)
            formdata.append("messagetype", "image-blob")
            fetch("http://localhost:4000/messages", {
                method: 'POST',
               
                body: formdata,            
            }).then(resp=>{
                return resp['status']
            }).then( data => {
                data===201?
                console.log('success'):
                console.log('failure')
            })
            
          
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
        e.preventDefault()
    }
    e.preventDefault()
}
    


  
const shareFile= (metadata,buffer)=>{
    socket.emit("file-meta", {metadata:metadata})
    socket.on("fs-shares", ()=>{
        let chunk= buffer.slice(0,metadata.buffer_size)
        buffer= buffer.slice(metadata.buffer_size, buffer.length)
        if(chunk.length!==0){
            console.log("ok")
            socket.emit("file-raw", {
                buffer: chunk
            })
        }
    })
}

const fileshare={}
socket.on("fs-meta",(metadata)=>{
    fileshare.metadata=metadata
    fileshare.transferred=0
    fileshare.buffer=[]
    socket.emit("fs-start")
})

useEffect(()=>{
    const sharefiles= (buffer)=>{ 
        const sender=sessionStorage.getItem('username')
        fileshare.buffer.push(buffer)
        fileshare.transferred +=buffer.byteLength
        setFileupload(Math.round(100*fileshare.transferred/fileshare.metadata.max_buffer_size)  + "%")
        if (fileshare.transferred===fileshare.metadata.max_buffer_size){
            setFileupload()
           if( fileshare.metadata.author===sendto && fileshare.metadata.reciever===sender){
            const blob=new Blob(fileshare.buffer, { type: fileshare.metadata.filetype})
            let file= URL.createObjectURL(blob)

            if(fileshare.metadata.filetype.includes("image")){
                const author= fileshare.metadata.author
                const message= file
                const reciever= fileshare.metadata.reciever
                
                setAllMessages((list)=>[...list,{author, message, reciever, messagetype:"image"}])
                
            }
            else {

                setAllMessages((list)=>[...list,fileshare.metadata])
                console.log(fileshare.metadata.filetype.includes("images"))
                download(fileshare,file)
            }
           }     
            
        }
    
        else {
            socket.emit("fs-start")
        }   
    
    }
    if (sendto!==null){
        socket.on("fs-share",sharefiles)}
        return ()=>{
            if(sendto!==null){
                socket.on("fs-share",sharefiles)}
        }
    

},[sendto])


   
    
    return(
        <div className= "container">
        <div className="left-side">
            <Drawers currentuser={currentuser}/>
            <div className="bottom-side">      
            <ContactArea  setCurrentuser={setCurrentuser}  onChoos={onChoos}  />
                
            </div>    
        </div>
        <div className="right-side">
            {sendto!==null?<div className="some-info">
                <div className="username-class">
                
                <p >{sendto}</p>
                </div>
                <div className="extra">
                    <IoMdCall className="call-class"/>
                <BsFillCameraVideoFill className="video-class"/>
                
                </div>
               
            </div>: <div  >
                
               
            </div>}
            <ScrollToBottom className="chat-area">
               
                <div className="all-message">
                   
                    {allmessages.map((allmessage)=>( 

                      <div   className= {username===allmessage.author?"reply-message":"message"} key={allmessage._id} >
                         {allmessage.messagetype!=="text"?allmessage.messagetype==="image" ?<img className="send-image" src={allmessage.message}/> :
                         allmessage.messagetype==="image-blob" ? <img className="send-image" src={allmessage.message}/>:
                         <p className="main-message"><AiFillFile style={{color:"gray" , paddingRight:"10px"}}/>{allmessage.message} </p>
                        :<p className="main-message">{allmessage.message}</p> }
                        {allmessage.createdAt && <p className="time">{timeReturn(allmessage.createdAt)}</p>
                          }
                     </div>
                    ))}
                    
                    {(fileupload!=="100%" && fileupload!==undefined && fileupload!=='200%')? <p className="progress"> file being uploaded .... {fileupload}</p> : <div></div>}
                </div>
            </ScrollToBottom>
            {sendto !== null ?<div className="send-area" id="send-area" >
               
                <input type="file" className="send-file" onChange={sendFile} id="file"/>
                
                <label for="file" className="attach"><ImAttachment/></label>
               
                <input type="text" className="send-message" placeholder='type something' pattern=".{3,}" required id="send" onKeyDown={(e)=>{e.key==='Enter'&& 
                sendMessage(document.querySelector(".send-message").value)
                }}/>

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
