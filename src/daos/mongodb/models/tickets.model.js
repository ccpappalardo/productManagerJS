import mongoose from "mongoose"; 

const collection = 'tickets'

const TicketsSchema = new mongoose.Schema({
    //codigo unico del ticket
    code: {
        type: String,
        required: true,
        unique: true
    },
    //fecha y hora time stamp de la compra
    purchase_datetime: { type: Date, default: Date.now },
    //monto de la compra
    amount: {
        type: Number,
        required: true
    },
    //email de la persona que compró los productos
    purchaser: {
        type: String,
        required: true
    },
    //array de productos comprados
    products:[],

})
 

export const ticketsModel = mongoose.model(collection, TicketsSchema)