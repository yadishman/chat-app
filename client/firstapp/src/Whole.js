import { useEffect, useState } from "react"
import Drawers from "./Drawer"
import ContactArea from "./ContactArea"
import { getMessages, postImage, postNonImage, postVideo,  } from "./controller/messagecontroller"
import Notification from "./notification"
import Contact from "./Contact"
import Message from "./Messages"
import SendArea from "./SendeArea"

let _id=0
const Whole= (props)=>{
   
    const [latest,setLatest]= useState()
    const username= sessionStorage.getItem('username')
    const [allmessages,setAllMessages]=useState([])
    const [currentuser,setCurrentuser]= useState()
    const [sendto, setSendto]= useState(null)
    const [fileupload, setFileupload]=useState() 
    const [isTyping,setIsTyping]=useState(false)
    const fileshare={}

    const download= (data, file)=>{   
           let a=document.createElement('a')
           a.href=file
           a.download=data.metadata.filename
            a.click()
    }
   
useEffect(()=>{
    setIsTyping(false)
    getMessages(username,sendto,setAllMessages)
    const recievemessage=(data)=>{
        if(data.reciever===username && data.author===sendto){
                setAllMessages((list)=>[...list,data]) } 
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
        const blobdata=URL.createObjectURL(files)     
        if(files.type.includes("image")!==false) {
            setAllMessages((list)=>[...list, {author,message:blobdata,reciever, messagetype:"image",createdAt}])         
            postImage(files,author,reciever)}
         
        if(files.type.includes("video")!==false) {  
            setAllMessages((list)=>[...list, {author,message:blobdata,reciever, messagetype:"video",createdAt}])                    
            postVideo(files,author,reciever)}

        reader.onload= () =>{
            let buffer= new Uint8Array(reader.result)
            shareFile(
     {message:files.name,author,reciever,filetype : files.type,filename:files.name,max_buffer_size: buffer.length,buffer_size: 1024},
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
            props.socket.emit("file-raw", {
                buffer: chunk
            })
        }
    })
}

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
            const author= fileshare.metadata.author
            const message= file
            const reciever= fileshare.metadata.reciever 

            if(fileshare.metadata.filetype.includes("image")){           
                setAllMessages((list)=>[...list,{author, message, reciever, messagetype:"image",createdAt}])}

            else if (fileshare.metadata.filetype.includes("video")){
                setAllMessages((list)=>[...list,{author, message, reciever, messagetype:"video",createdAt}])}
            else {
                const message= fileshare.metadata
                message["createdAt"]=createdAt
                setAllMessages((list)=>[...list,message])
                download(fileshare,file)
            }}                 }
        else {
            props.socket.emit("fs-start")}   
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
           
                <Notification socket={props.socket} sendto={props.sendto} currentuser={props.currentuser}/>
                <Contact sendto={sendto} currentuser={currentuser} isTyping={isTyping}/>
                <Message allmessages={allmessages} fileupload={fileupload}/>
            <SendArea socket={props.socket} sendto={sendto} _id={_id} setAllMessages={setAllMessages} setIsTyping={setIsTyping} sendFile={sendFile} />
        </div>
</div>
      );
}
export default Whole
