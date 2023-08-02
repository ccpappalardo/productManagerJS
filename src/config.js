import dotenv from 'dotenv';

//configuración del path de dotenv 
dotenv.config({path:"./src/.env"})

export default {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    ADMIN_NAME: process.env.ADMIN_NAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    JWT_SECRET: process.env.JWT_SECRET
}