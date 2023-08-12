import UserDAO from "../daos/mongodb/daos/UserMongo.dao.js"
import jwt from 'jsonwebtoken' 
import userDTO from "../controllers/dtos/user.dto.js";
 
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


    async getCurrentService(req,res){
            //TO DO crear el DTO y mandar la cookie req
  //await sessionController.getCurrentController(dto).
  //   console.log("envio usuario en servicio current "+req.user);
    let usuario=new userDTO(req.user);
    return usuario;
    }

    async logoutService(res){
    //eliminar la cookie
    console.log("Cookie eliminada");
    res.clearCookie('coderCookie').send('Cookie Eliminada');
    }
    
    async githubService(){
    }
    
    async githubcallbackService(user,res){
        /*let token = jwt.sign({ email: usuario.email, usuario, role:'user'}, process.env.JWT_SECRET, {
            expiresIn: "24h",
        }); */

        let token = jwt.sign(user, process.env.JWT_SECRET, {
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