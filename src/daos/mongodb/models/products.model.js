import mongoose from "mongoose";
import moongoosePaginate from "mongoose-paginate-v2";

const collection = 'products'

const ProductsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
      },
    owner:{
        type: String,
        required: true
    },
})

ProductsSchema.plugin(moongoosePaginate);

export const productsModel = mongoose.model(collection, ProductsSchema)