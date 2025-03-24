const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Users = require("../models/users")
const {GetUserAvatar} = require("../utilities")
require("dotenv").config()


//register
//Regex
const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
//Regex
const Register = async (req,res) => {
    try {

        if(!passwordValidationRegex.test(req.body.password)){
            return res.status(400).json({
                status : 400,
                successful : false,
                error : "password policy violation",
                message : "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, a special character (e.g., !, @, #, $), and have no spaces."
            })
        }

        await new Users({
            username : req.body.username,
            email : req.body.email,
            password : await bcrypt.hash(req.body.password,10),
            user_avatar : GetUserAvatar(req.body.email)
        }).save()

        return res.redirect("/login")
        
    } catch (error) {

        if(error.name === "ValidationError"){
            return res.status(400).json({
                status : 400,
                successful : false,
                error : error.name,
                message : error._message,
                body : error.message
            })
        }

        else if(error.code === 11000){
            return res.status(400).json({
                status : 400,
                successful : false,
                error : "duplicate value error",
                message : "email address already used",
                body : error.keyValue,
            })
        }

        console.log(error);
        res.status(500).json(error)
    }
}
//register

