import UserDAO from "../daos/mongodb/daos/UserMongo.dao.js"
import config from "../config.js";
import jwt from 'jsonwebtoken' 
 
export default class SessionService {

    constructor(){
        this.userDao= new UserDAO();  
    }

    async registerService(user){
        const result =await this.userDao.addUser(user);
        console.log(result)
        return result;
    }
  
    async getUserByIdService(username){
        const result =await this.userDao.getUserById(username)
        return result;
    }

   async loginService(usuario,req,res){
    let token = jwt.sign({ email: usuario.email, usuario, role:'user'}, config.JWT_SECRET, {
        expiresIn: "24h",
    });
    res.cookie("coderCookie", token, { httpOnly: true })//.send({ status: "success", user: req.user });
    // res.cookie("coderCookie", token, { httpOnly: true })
        // .send({ status: "success", user: usuario });
    return req.user;
    }

    async getCurrentService(req,res){
        res.send(req.user);
    }

    async logoutService(res){
    //eliminar la cookie
    console.log("Cookie eliminada");
    res.clearCookie('coderCookie').send('Cookie Eliminada');
    }
    
    async githubService(){
    }
    
    async githubcallbackService(usuario,res){
        let token = jwt.sign({ email: usuario.email, usuario, role:'user'}, "coderSecret", {
            expiresIn: "24h",
        });
        console.log('Entro bien a githubCallback')
        //redirecciono a products si se loguea correctamente
        return res.cookie("coderCookie", token, { httpOnly: true }).redirect('/products') 
    }

    async resetPasswordService(user, hashedpass){
        const result =await this.userDao.updatePassword(user,hashedpass);
        return result;
    }

} 