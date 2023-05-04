const mongosse= require('mongoose')
const schema= mongosse.Schema
const userSchema= new schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        phonenumber : {
            type: String,
            required: true,
            unique: true,
        },

        profilepic: {
            type : String,
        }
        ,

        isOnline : {
            type: Boolean,
            default: false,
        },
        
        contacts: {
            type: Array
        }
        
    }, {timestamps: true}
)

const user= mongosse.model('User', userSchema)

module.exports= user