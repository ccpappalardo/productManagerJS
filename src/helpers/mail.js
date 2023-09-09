import nodemailer from 'nodemailer'
import config from '../config.js'

export default class Mail {
    constructor() {
        this.transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: config.EMAIL_NAME,
                pass: config.EMAIL_PASSWORD
            }
        })
    }

    send = async(user, subject, html) => {
        const result = await this.transport.sendMail({
            from: config.mailUser,
            to: user.email,
            subject,
            html
        })

        return result
    }
}