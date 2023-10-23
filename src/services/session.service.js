import UserDAO from "../daos/mongodb/daos/UserMongo.dao.js"
import jwt from 'jsonwebtoken' 
import userDTO from "../controllers/dtos/user.dto.js";
import usersDTO from "../controllers/dtos/users.dto.js";
import Mail from "../helpers/mail.js";
 
export default class SessionService {

    constructor(){
        this.userDao= new UserDAO();  
        this.mail = new Mail();
    }

    async registerService(user){
        const result =await this.userDao.addUser(user);
        return result;
    }
  
    async getUserByIdService(username){
        const result =await this.userDao.getUserById(username)
        return result;
    }
    
    async getUserService(id){
        const result =await this.userDao.getUser(id)
        return result;
    }

    async getCurrentService(req,res){  
    let usuario=new userDTO(req.user);
    return usuario;
    }

    async logoutService(req,res){ 
        //Cookie Eliminada
        res.clearCookie('coderCookie').send('Se ha cerrado la sesión!');
    }
    
    async githubService(){
    }
    
    async githubcallbackService(user,res){
       
        let token = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: "24h",
        }); 

        return res.cookie("coderCookie", token, { httpOnly: true }).redirect('/products') 
    }

    async resetPasswordService(user, hashedpass){
        const result =await this.userDao.updatePassword(user,hashedpass);
        return result;
    }

    async updateUserRoleService(id,role){
        const result =await this.userDao.updateRole(id,role);
        return result;
    }

    async updateUserLastConnection(id){
        const result =await this.userDao.updateLastConnection(id);
        return result;
    }

    async updatePathDocuments(id,documentsNames,documentsPaths){
 
        const result =await this.userDao.updatePathDocuments(id,documentsNames,documentsPaths);
        return result;
    }

    
    async getPremiumRequiredDoc(id){
        const result =await this.userDao.getPremiumRequiredDoc(id);
        return result;
    }

    async getUsersService(){
        let result =await this.userDao.getUsers(); 
        
        let usuariosFormateados=new Array();
        
        result.forEach((usuario)=>usuariosFormateados.push(new usersDTO(usuario)));
        return usuariosFormateados;
    }

    async getUsersInactivos(){
        const usersInactivos=await this.userDao.getUsersInactivos();
        return usersInactivos;
    }

    
    async deleteUserInactivo(user){
       
        try{
             const result =this.userDao.deleteUserById(user._id);
            return result; 
          }catch(error){
            return res.status(404).send({status: "error", error: error.message});
          }
    }

    async enviarCorreo(email,asunto, cuerpo,res){

    try{ 
      const result = this.mail.send(email,asunto,cuerpo);
      return result; 
    }catch(error){
      return res.status(404).send({status: "error", error: error.message});
    }
    }

    
    async deleteUser(userId){
       
        try{
             const result =this.userDao.deleteUserById(userId);
             return result;
          }catch(error){
            return res.status(404).send({status: "error", error: error.message});
          }
    }

} 