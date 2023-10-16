export default class userDTO{

    constructor(user){
        this.nombre=user.first_name;
        this.apellido=user.last_name;
        this.email=user.email;
        this.role=user.role;
    }
} 