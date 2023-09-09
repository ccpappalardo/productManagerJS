export const userAuth=(req,res,next)=>{ 
 
        if(req.user.role==='user'){
            next();
        }else{
         return res.status(403).send({error: "Alerta! Usted no tiene acceso."});
        }   
}

export const adminAuth=(req,res,next)=>{ 
        if(req.user.role==='admin'){
            next();
        }else{
         return res.status(403).send({error: "Alerta! Usted no tiene acceso."});
        } 
 }

 
export const premiumAuth=(req,res,next)=>{ 
    if(req.user.role==='premium'){
        next();
    }else{
     return res.status(403).send({error: "Alerta! Usted no tiene acceso."});
    } 
}
