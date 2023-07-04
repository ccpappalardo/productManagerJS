import { Router } from "express";
import UserManager from "../../daos/mongodb/UserManager.class.js";

const router = Router();

const managerUsers = new UserManager();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  const exist = await managerUsers.getUserById({ email })
  // userModel.findOne({ email });

  if (exist)
    return res
      .status(400)
      .send({ status: "error", message: "usuario ya registrado" });

  let result = await managerUsers.addUser({
    first_name,
    last_name,
    email,
    age,
    password,
  });

  /*userModel.create({
    first_name,
    last_name,
    email,
    age,
    password,
  });*/
  res.send({ status: "success", message: "usuario  registrado" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)
  let user
  console.log(email!='adminCoder@coder.com')
    if(email!='adminCoder@coder.com')
    { user = await managerUsers.getUserByEmailPass(email,password); 
      if (!user) return res.redirect('/api/login')
      req.session.user = {
        name: user.first_name + user.last_name,
        email: user.email,
        age: user.age,
        rol: "user"
      };
    }else{

        req.session.user = {
        name: "Admin Coder",
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
        rol: "admin"
      };
    }
    res.send({ status: "success", message: req.session.user });
  
  // userModel.findOne({ email: email, password: password });
   
  
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.json({ status: 'Logout ERROR', body: err })
    }
    return res.send('Logout ok!')
    //res.redirect('/api/login')
  })
 })
 

export default router