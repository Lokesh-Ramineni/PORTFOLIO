
const nodemailer = require("nodemailer");

module.exports = function(app){
        const transporter = nodemailer.createTransport({
        service: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.Host_Gmail,
            pass: process.env.Host_Password
        }
    });
    app.post("/contact",async(req,res) => {
        let {name,email,subject,message}=req.body;
        try {
            const info = await transporter.sendMail({
                from: `"${name}" <${process.env.Host_Gmail}>`,
                to: process.env.Host_Gmail,
                subject: subject,
                text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
            });
            console.log("Email sent successfully:", info.response);
            res.redirect("/contact")
        } catch (error) {
            console.error("Error sending email:", error);
        }       
        
    });
};




