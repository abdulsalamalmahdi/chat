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
const passport= require('passport')

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// defining expermintal routes

app.get("/users",passport.authenticate('jwt', { session: false }), (req, res) => {
  User.find().then((user) => res.send(user))
  .catch(err=>{
      res.status(500).send({
          message: err.Message
      })
  })
});
app.post("/register", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const rawUser = { ...req.body };

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
              res.send(newUser);
            });
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
});

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
