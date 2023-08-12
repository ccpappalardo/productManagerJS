 export const permiteAgregarAsuCarrito=(req,res,next)=>{ 
    if(req.user.cart===req.params.cid){
        next();
    }else{
     return res.status(403).send({error: "Alerta! Solo puedes agregar productos a tu carrito."});
    }   
}
