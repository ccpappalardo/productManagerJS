import mongoose from "mongoose";

const collection = 'carts'


const CartSchema = new mongoose.Schema({
    products:{
        type:[
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                }
            }
        ]
    }

})

export const cartModel = mongoose.model(collection, CartSchema)