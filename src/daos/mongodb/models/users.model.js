import mongoose from 'mongoose'

const collection = 'users'

const schema = new mongoose.Schema({
    first_name:String,
    last_name:String,
    email:String,
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
    },
    role:{ type: String, 
        enum: ["user", "admin","premium"],
        default: 'user'},
    documents:{
        type:[
            {
                name: {
                    type: String 
                },
                reference:{
                    type: String
                }
            
            }
        ]
    },
    last_connection:  { type: String, 
        default: Date.now()},
})

//const userModel = 
export const userModel =mongoose.model(collection, schema)