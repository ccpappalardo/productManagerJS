export const generateErrorInfo = (product)=>{
    return `One or more properties were completed or invalid
    List of required properties:
    *price: needs to be a Number, received ${product.price}
    *title: needs to be a String, received ${product.title}`
}
 

