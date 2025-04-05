const express = require("express")
const mongoose = require("mongoose")
const http = require("http")
const {Server} = require("socket.io")
const path = require("path")
const cookieparser = require("cookie-parser")
const users = require("./routes/users")
const documents = require("./routes/documents")
const {AuthMiddleware} = require("./middlewares")
const { log } = require("console")
require("dotenv").config()



const app = express()
const server = http.createServer(app)

mongoose.connect(process.env.MONGO_URI).then(() => console.log('mongodb connected!'));
const io = new Server(server, {
    cors: {
        origin: "https://inksync-gjzj.onrender.com",  
        methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"]
    }
});



io.on("connection", async (socket) =>{
    socket.on("join_document",document_id => {
        socket.join(document_id)
        
    })

    socket.on("emit_delta",(delta,document_id) => {
        socket.to(document_id).emit("brodcast_delta", delta);
    })
})


app.use(express.json())
app.use(cookieparser())
app.use(express.static(path.join(__dirname, 'public')));


app.use(users)
app.get('/register',(req,res) => {
    return res.sendFile(path.join(__dirname, 'public', 'users', 'register.html'))
})

app.get('/login',(req,res) => {
    return res.sendFile(path.join(__dirname,'public',"users","login.html"))
})


app.use(documents)

app.get('/',AuthMiddleware,async (req,res) => {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/documents',AuthMiddleware,async (req,res) => {
    return res.sendFile(path.join(__dirname, 'public', 'quill.html'))
})






server.listen(2000,() => console.log("server listening on port 2000"))