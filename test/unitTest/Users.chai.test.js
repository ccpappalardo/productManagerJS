import mongoose from "mongoose";
import UserDAO from "../../src/daos/mongodb/daos/UserMongo.dao.js"; 
import chai from 'chai' 
import config from "../../src/config.js";
import { createHash, validatePassword } from "../../src/utils.js";

const connection = mongoose.connect(
    config.MONGO_URL
);

const expect = chai.expect

describe('Testing Users Dao', ()=>{
    let usersDao
    before(async function(){
        usersDao = new UserDAO()
    })
    
   it('Prueba de agregar usuarios', async ()=>{
        let user = {
            first_name: 'Juan',
            last_name: 'Perez',
            email: 'juanpq123@gmail.com',
            password: '12345'
        }

        const result = await usersDao.addUser(user)
        console.log(result)
        expect(result._id).to.be.ok
    }).timeout(10000)
 
    it('Prueba de traer usuario por email', async ()=> {
        const result = await usersDao.getUserById('ccpappalardo@gmail.com')
        expect(result._id).to.be.ok;
    }) 
 
    it('probar hash',async ()=>{
        const hashedPassword = await createHash('12345')
        console.log(hashedPassword)
        expect(hashedPassword).to.not.be.equal('12345')
    })
    
    
  it('Se actualiza la password de un usuario', async function() {
   
    let user = await usersDao.updatePassword("xx@gmail.com", "3333")
    user = await usersDao.getUserById("xx@gmail.com")
    expect(validatePassword("3333",user));
    
  })

  it('Se actualiza el rol de un usuario especifico', async function() {
    let user = await usersDao.getUserById("xx@gmail.com");    
    await usersDao.updateRole(user._id, "premium")
    let userRolActualizado= await usersDao.getUserById("xx@gmail.com")
    expect(userRolActualizado).to.have.property("role").and.to.be.equal("premium")
  })


})