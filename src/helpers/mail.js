import nodemailer from 'nodemailer'
import config from '../config.js'

export default class Mail {
    constructor() {
        this.transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user:"ccpappalardo@gmail.com",
                pass: "qcuwqbhmdfntltnc"
            }
        })
    }

    send = async(user, subject, html) => {
        const result = await this.transport.sendMail({
            from: config.mailUser,
            to: user,
            subject,
            html
        })

        return result
    }
}