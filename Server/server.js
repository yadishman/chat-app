const express= require('express')
const multer= require('multer')
let i=0
const Storage= multer.diskStorage(
    {
        destination: "../client/firstapp/public/images",
        filename: (req, file ,cb )=>{
            cb(null, Date.now()+ file.originalname)
        }
    }
)

const Storage2 = multer.diskStorage (
    {destination: "../client/firstapp/public/messages/",
    filename :(req,file,cb)=>{
        cb(null,Date.now() + file.originalname)
    }
}
)

const Upload2 = multer({
    storage:Storage2
})
const Upload = multer(
    {
        storage : Storage
    }
).single("profilepicture")

var cors= require('cors')
const http= require('http')
const socket= require('socket.io')
const mongoose = require('mongoose')
const dbURI= 'mongodb://127.0.0.1:27017/checkapp'
const app= express()
const User= require("./models/user")
const Message= require("./models/message")
const server=http.createServer(app)
const io= socket(server, { cors:{
    origin: '*'
}
})
console.log(__dirname)
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

let userna='anonymous'

io.on("connection", socket=>{
   
   
    console.log("user is conncected")
    socket.on("usermessage", message=>{
        console.log(message)
        socket.broadcast.emit('message', message)
       
    })

    socket.on ("file-meta",(data)=>{
        console.log(data)
        socket.broadcast.emit("fs-meta" , data.metadata)
    }) 
    socket.on ("fs-start",(data)=>{
        socket.broadcast.emit("fs-shares", {})
    }) 
    socket.on ("file-raw",(data)=>{
        i+=1
        console.log(i)
        console.log(data.buffer.byteLength)
        socket.broadcast.emit("fs-share", data.buffer)
    }) 
    
    socket.on('disconnect', ()=>{
        
        console.log("disconnected")
       
    })

    
   
})
mongoose.connect(dbURI).then(()=>{console.log("success")})

server.listen(4000,{cors:{
    origin: "*"
}},
     ()=>{console.log("we are running")})


app.post('/createuser', (req,resp)=>{
    Upload(req,resp,(err)=>{
        if(err){
            console.log(err)
        }
        else {
            const response= req.body
           
            if (req.file!==undefined)
            {
                 response["profilepic"]= "./images/"+req.file["filename"]
            }
        
           
            const user= new User(response)
            user.save().then((resutl)=>{resp.sendStatus(201)}).catch((e)=>{resp.sendStatus(500)})
        }
    })
    
   
})

app.get('/messages/:metadata', async(req,resp)=>{
    const meta=req.params.metadata
    const newarray= meta.split('&')
    const sender= newarray[0]
    const reciever= newarray[1]
    if (reciever===null){
        resp.sendStatus(300)
    }
    const message= await Message.find({$or :[{author:sender, reciever:reciever},{author:reciever, reciever:sender}]}).sort({createdAt:1})
    resp.status(201).json({message:message})
})

app.post('/messages',Upload2.single("imagemessage"), async(req,resp)=>{
    const response= req.body
   const username=response["author"]
   const reciever= response["reciever"]
  
    if (req.file!==undefined)
    {
         response["message"]= "./messages/"+req.file["filename"]
    }
    const isContact= await User.findOne({username:reciever,contacts: {
        $elemMatch :{
            username: username
        }
    }})

    if(isContact){
        console.log("i am there no need to add me again")
    }

    if(isContact===null){
        console.log("i am not there")
       const user= await User.findOne({username:username})
        await User.findOneAndUpdate({username:reciever}, {$push:{
            contacts: {$each: [user], $position: 0 } 
       }})
    }
    const message= new Message(response)
    message.save().then((resutl)=>{resp.sendStatus(201)}).catch((e)=>{resp.sendStatus(500)})
   
})
app.post('/createcontact', async (req,resp)=>{
    const phone= req.body['phonenumber']
    const sendername= req.body['sendername']
    console.log(phone, " ", sendername)
    try {
        const creator= await User.findOne({username:sendername})
        const user= await User.findOne({phonenumber:phone})
        const isContact= await User.findOne({username:sendername,contacts: {
            $elemMatch :{
                phonenumber: phone
            }
        }})

        const isme= await User.findOne({username:sendername,phonenumber:phone})
        if(isme){
            console.log("fool, stop trying to add your self")
            resp.sendStatus(503)
        }
        else if(isContact){
            console.log("why again")
           
            resp.sendStatus(502)
        }

      
        
        else if(user!==null){
        
            User.findOneAndUpdate({username:sendername}, {$push:{
                 contacts: {$each: [user], $position: 0 } 
           }}).then(data=>{resp.sendStatus(200)}).catch(e=>resp.sendStatus(404))
        
    }
    else {
        resp.sendStatus(404)
    }
    }
    catch(err) {
        console.log(err)
       

    }
   
})
app.get('/users/:username',async(req,resp)=>{
    const username=req.params.username
    
    try {
        const user= await User.findOne({username:username})
        
        user!==null?

        resp.status(200).json({user,contacts:user.contacts}):
        resp.sendStatus(404)


    }
    catch(err) {
        console.log(err)
        resp.sendStatus(404)

    }
})