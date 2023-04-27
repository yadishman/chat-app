const mongosse= require('mongoose')
const schema= mongosse.Schema
const messageSchema= new schema(
    {
        author: {
            type: String
        },
        message : {
          
        },

        reciever: {
            type: String
        },
        messagetype :{
            type: String
        }
    }, {timestamps: true}
)

const message= mongosse.model('Message', messageSchema)

module.exports= message