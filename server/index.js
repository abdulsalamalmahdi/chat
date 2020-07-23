const User = require("./models/users_model");
const app = require('express')();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser= require('body-parser');
const http = require('http').Server(app);
let io = require('socket.io')(http);


mongoose.Promise= global.Promise;

mongoose.connect('mongodb://localhost:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
   useFindAndModify: false,
}).then(()=> {console.log("db connection established")
})
.catch((err)=>{ console.error(`Database error, exiting. Stack trace:\n${err}`)
process.exit();
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('connected to mongodb')
});

app.use(cors({
    
        origin: ['http://localhost:8080'],
        credentials: true,
      
}));



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000
http.listen(port, () => {
    console.log(`Example app listening at http://localhost:3000`);
});
 
io.on('connection', (socket) => {
    console.log("socket is connected")
    socket.on('connection', () => {
        console.log("A user disconnected");
    });

    socket.emit("beeb", {data:"we are beebbing baby"})
     
socket.on('chat-message', (data) => {
    console.log(data)
    // this.messages.push({
    //     message: data.message,
    //     type: 1,
    //     user: data.user,
    // });
});
 
socket.on('joined', (data)=>{
    console.log(data);
        User.findOne({name: data}, (err, user)=>{

        
            if(user){
                console.log("user exist")
                
    socket.emit('not',  "err")
               
                
            }else{
                User.create({name: data})
                .then(async user => {
                    console.log("this is the user"+user)
                    return user.save();
                }).then(async user=>{
                    const rawUser= await user.toObject()
                    console.log(rawUser)
                    socket.emit('user', {...rawUser});
                });
            }
        })
   
});

socket.on('typing', data =>{
    
    socket.emit('sender_typing', {data})
});
socket.on('stopTyping', ()=> {
    socket.emit('stopTyping')
})
});
    
