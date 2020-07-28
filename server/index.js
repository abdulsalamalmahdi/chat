const User = require("./models/users_model");
const app = require("express")();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http").Server(app);
let io = require("socket.io")(http);
const Message = require("./models/message_model");
const users_model = require("./models/users_model");
const { runInNewContext } = require("vm");
const { read } = require("fs");
const { RSA_NO_PADDING } = require("constants");
const passport= require('passport');
 const {createToken}= require('./lib/auth');
 const { hash, compareHash } = require("./lib/util");

require('dotenv').config();

mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost:27017/chat", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("db connection established");
  })
  .catch((err) => {
    console.error(`Database error, exiting. Stack trace:\n${err}`);
    process.exit();
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("connected to mongodb");
});

app.use(
  cors({
    origin: ["http://localhost:8080"],
    credentials: true,
  })
);

// Pass the global passport object into the configuration function
require('./lib/passport')(passport);

// This will initialize the passport object on every request
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// defining expermintal routes

app.get("/users",(req, res) => {
  User.find().then((user) => res.send(user))
  .catch(err=>{
      res.status(500).send({
          message: err.Message
      })
  })
});
app.post("/register", async (req, res) => {

  await console.log(req.body)

  
 
  const password = await hash(req.body.password);
  const rawUser = {
    ...req.body,
    password,
  };

  try {
    

    User.findOne(
      {
        email: rawUser.email,
      },
      (err, user) => {
        if (err) {
          res.send(err);
        } else if (user) {
          res.send("user already exist");
        } else {
          User.create(rawUser)
            .then(async (user) => {
              return user.save();
            })
            .then(async (user) => {
              const newUser = await user.toObject();
              console.log(newUser)
              res.send(newUser);
            });
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
});

app.post('/login', async (req, res)=>{
 
  await  console.log('logging')
const {email, password} = req.body;
console.log( email);
console.log(password);


try {
  const rawUser = await User.findOne({ email })
    .select("+email")
    .select("+password")
    .select("+_id");
// console.log(rawUser)
  if (!rawUser) {

     throw new Error("Incorret password or User name");
   }

  const passwordIsCorrect = await compareHash(password, rawUser.password);
  //  console.log(passwordIsCorrect)
  if (!passwordIsCorrect) {
    throw new Error("Incorret password or User name");
  } else if (passwordIsCorrect) {
    const user =  rawUser.toObject();
    delete user.password;
    
    const token = createToken(user, "1h");

    // const tokenPld = token.split(".").splice(0, 2);
    // const tokenSig = token.split(".").splice(2);
    console.log(token);
    // console.log(tokenPld);
    // console.log(tokenSig);
    user.token = token;
    // console.log(token);

    res.status(200).json({success:true,token: (await token).token, expiresIn:(await token).expires, user});
    //   const opt={ httpOnly: true, secure: cookieIsSecure }
    // res.cookie("jwt", token);
    // res.cookie("cookie", "cookie")
    // res.cookie("jwt", tokenPld, { httpOnly: false, secure: false });
    // res.cookie("jwtSig", tokenSig, { httpOnly: false, secure: false });

    
  }
} catch (err) {
  if (!err.message) {
    return res
      .status(500)
      .send({ message: "An unexpected error occurred during login" });
  } else {
    return res.status(404).json(err.message);
  }
}
})

app.post('/message', async (req, res)=>{
const rawMessage= {...req.body}
console.log(req.body)
const {_id, test, date, seen, sender, receiver}= rawMessage;
const message= await Message.create(rawMessage)
message= await message.populate('sender','receiver').execPopulate()
.then(async msg=>{
    return msg.save()
})
.then(async (msg) => {
    const newMsg = await msg.toObject();
    res.send(newMsg);
  });
// await Message.findByOneAndUpdate({sender:sender._id}, { $push: { messages: rawMessage}}, (err, data)=>{
//     if (err) res.send(err)
//     res.send(data)
// })
})

app.get('/messages', async (req, res)=>{
    const {_id,message}= req.body;
  const msgs =  Message.find()
  .then(data=> 
    res.send(data));
  
   
      
    
    // User.findById(_id, (err, (err, data)=>{
    //     res.send(data.message)
    // }))
})

app.get('/users/:id', passport.authenticate('jwt',{session:false}), async (req, res)=>{
const _id = req.params.id
console.log(_id)
  const rawUser = await User.findById(_id);
  try{
    if (!rawUser){
      throw new Error("something went wrong log in again")
    }else if(rawUser){
      const reqUser = await rawUser.toObject();
      res.send(reqUser)
    }
  }catch(err){
    res.send(err)
  }
})

const port = 3000;
app.listen(port, () => {
  console.log("app is listening");
});
http.listen(port, () => {
  console.log(`Example app listening at http://localhost:3000`);
});

io.on("connection", (socket) => {
  console.log("socket is connected");
  socket.on("connection", () => {
    console.log("A user disconnected");
  });

  socket.emit("beeb", { data: "we are beebbing baby" });

  socket.on("chat-message", (data) => {
    console.log(data);
    // this.messages.push({
    //     message: data.message,
    //     type: 1,
    //     user: data.user,
    // });
  });

  socket.on("joined", (data) => {
    console.log(data);
    User.findOne({ name: data }, (err, user) => {
      if (user) {
        console.log("user exist");

        socket.emit("not", "err");
      } else {
        User.create({ name: data })
          .then(async (user) => {
            console.log("this is the user" + user);
            return user.save();
          })
          .then(async (user) => {
            const rawUser = await user.toObject();
            console.log(rawUser);
            socket.emit("user", { ...rawUser });
          });
      }
    });
  });

  socket.on("typing", (data) => {
    socket.emit("sender_typing", { data });
  });
  socket.on("stopTyping", () => {
    socket.emit("stopTyping");
  });
});
