const usertype= document.getElementById("send-area")
const displayarea=document.querySelector('.all-message')
const displayusername= document.querySelector('.username-class')
const recipent=document.querySelector(".choose-person")
const socket= io();
const username=sessionStorage.getItem("username")
let myname
displayusername.innerHTML=
`<p> ${username} </p>`

recipent.addEventListener('submit',(e)=>{
    e.preventDefault()
    myname=e.target.elements.receiver.value
   
    
})
socket.on("message", data=>{
    console.log(data)
    if(data.username==username){
    newMessage(data)}
    displayarea.scrollTop=displayarea.scrollHeight
})


usertype.addEventListener('submit', e=>{
    e.preventDefault()
    const message=e.target.elements.send.value
    
    socket.emit("usermessage", {username:myname,usermessage: message})
   
    myMessage(message)
    
    e.target.elements.send.value=""
    e.target.elements.send.focus()
    
})

function newMessage(message){
    const div=document.createElement('div')
    div.classList.add('message')
    div.innerHTML=
        `<p className='main-message'>${message.usermessage}</p>`
    
    displayarea.appendChild(div)
}

function myMessage(message){
    const div=document.createElement('div')
    div.classList.add('reply-message')
    div.innerHTML=
        `<p className='main-message'>${message}</p>`
    
    displayarea.appendChild(div)
}