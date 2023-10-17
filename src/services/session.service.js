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
            //TO DO crear el DTO y mandar la cookie req
  //await sessionController.getCurrentController(dto).
  //   console.log("envio usuario en servicio current "+req.user);
    let usuario=new userDTO(req.user);
    return usuario;
    }

    async logoutService(req,res){
    //console.log("Cookie eliminada");
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

      //  console.log('Entro bien a githubCallback')
        //redirecciono a products si se loguea correctamente
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
        const result =await this.userDao.getUsers(); 
        let usuariosFormateados=new Array();
        result.forEach((usuario)=>usuariosFormateados.push(new usersDTO(usuario)));
        return usuariosFormateados;
    }

    async getUsersInactivos(){
        const usersInactivos=await this.userDao.getUsersInactivos();
        
        //deleteUserById
        
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
      console.log("Entro a mandar el emailssssssssss");
    
      const result = this.mail.send(email,asunto,cuerpo);
      return result; 
    }catch(error){
      return res.status(404).send({status: "error", error: error.message});
    }
    }


} 