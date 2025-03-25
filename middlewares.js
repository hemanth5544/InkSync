const jwt = require("jsonwebtoken");
const Users = require("./models/users");
require("dotenv").config()


const AuthMiddleware = async (req,res,next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.JWT) {
            token = req.cookies.JWT; 
        }

        if(!token){
            return res.redirect(`/login?message=loggin first&redirect=${encodeURIComponent(req.originalUrl)}`)   
        }

        const payload = jwt.verify(token,process.env.ACCESS_TOKEN_SECERET)
        req.user = payload
        next()

    } catch (error) {
        if(error.name === "JsonWebTokenError"){
            return res.status(400).json({
                status : 400,
                successful : false,
                name : error.name,
                message : error.message

            })  
        }

        if(error.name === "TokenExpiredError"){
            return res.redirect("/login?message=session expired")
        }

        console.log(error);
        res.json(error)   
    }
}



