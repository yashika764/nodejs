const nodemailer = require("nodemailer")

const sendMail = async (to, text) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "booking confirmation mail",
        text
    })
}

module.exports = sendMail

