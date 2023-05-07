import { AiFillFile } from "react-icons/ai"
import ScrollToBottom from "react-scroll-to-bottom"
const Message= (props)=>{
    const username=sessionStorage.getItem("username")
    const allmessages=props.allmessages
    const fileupload=props.fileupload
    const timeReturn= (data)=>{
        if(data.length > 6){
        const time= data.slice(11,16)
        return time}
        return data

    }
    return (
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
                  </video>
                      : <p className="main-message"><AiFillFile style={{color:"gray" , paddingRight:"10px"}}/>{allmessage.message} </p>
                      : <p className="main-message">{allmessage.message}</p> }
                      {allmessage.createdAt && <p className="time">{timeReturn(allmessage.createdAt)}</p>
                        }
                   </div>
                  ))}
                  
                  {(fileupload!=="100%" && fileupload!==undefined && fileupload!=='200%')? <p className="progress"> file being uploaded .... {fileupload}</p> : <div></div>}
              </div>
              </ScrollToBottom>
    )
}

export default Message