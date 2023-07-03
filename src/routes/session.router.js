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
  const user = await managerUsers.getUserByEmailPass({ email: email, password, password})
  // userModel.findOne({ email: email, password: password });
  console.log(user)
  if (!user) return res.redirect('/api/login')
  req.session.user = {
    name: user.first_name + user.last_name,
    email: user.email,
    age: user.age,
  };
  res.send({ status: "success", message: req.session.user });
});

export default router