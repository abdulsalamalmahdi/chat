const User = require("./models/users_model");
const app = require("express")();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const server = http.createServer(app).listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    const host = server.address().address;
    const port = server.address.port;
    console.log(`server listening on ${host}:${port}`);
  }
});
let io = require("socket.io").listen(server);
const Message = require("./models/message_model");
const users_model = require("./models/users_model");
const { runInNewContext } = require("vm");
const { read, readdirSync } = require("fs");
const { RSA_NO_PADDING } = require("constants");
const passport = require("passport");
const { createToken } = require("./lib/auth");
const { hash, compareHash } = require("./lib/util");
const Friends = require("./models/friend_requests");

require("dotenv").config();

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
require("./lib/passport")(passport);

// This will initialize the passport object on every request
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// defining expermintal routes

app.get("/users", (req, res) => {
  User.find()
    .then((user) => res.send(user))
    .catch((err) => {
      res.status(500).send({
        message: err.Message,
      });
    });
});
app.delete("/delete", (req, res) => {
  Message.remove({})
    .then((user) => res.send(user))
    .catch((err) => {
      res.status(500).send({
        message: err.Message,
      });
    });
});
app.post("/register", async (req, res) => {
  await console.log(req.body);

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
              console.log(newUser);
              res.send(newUser);
            });
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
});

app.post("/login", async (req, res) => {
  // await console.log("logging");
  const { email, password } = req.body;
  // console.log(req.body);
  await console.log(email);
  // console.log(password);

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
      const user = rawUser.toObject();
      delete user.password;

      const token = createToken(user, "1h");

      // const tokenPld = token.split(".").splice(0, 2);
      // const tokenSig = token.split(".").splice(2);
      // console.log(token);
      // console.log(tokenPld);
      // console.log(tokenSig);
      user.token = token;
      // console.log(token);

      res.status(200).json({
        success: true,
        token: (await token).token,
        expiresIn: (await token).expires,
        user,
      });
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
});

app.post("/message", async (req, res) => {
  const rawMessage = { ...req.body };

  const { text, date, seen, sender, receiver } = rawMessage;
  console.log(rawMessage);
  await Message.create(rawMessage)

    // message= await message.populate('sender','receiver', (err, doc)=>{
    //   if (err){
    //    return err
    //   }else{
    //    const sender_id= doc.sender._id;

    //    User.findById(sender_id)
    //    .then(data=> res.json({data, doc}))
    //   }
    // })
    .then(async (msg) => {
      return msg.save();
    })
    .then(async (msg) => {
      const newMsg = await msg.toObject();
      console.log(newMsg);
      res.send(newMsg);
    });
});

app.put("/message/:id", async (req, res) => {
  const _id = req.params.id;
  await console.log(_id);
  await Message.findByIdAndUpdate(_id, { $set: { seen: true } })
    .then(async (msg) => {
      await console.log(msg.seen);
      res.send(msg);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/messages/:id", async (req, res) => {
  // const { _id, receiverId, message } = req.body.message;
  console.log(req.params);

  let sent = [];
  let received = [];
  const { id } = req.params;
  const { receiver_id } = req.body;
  console.log(receiver_id);
  console.log(id);
  Message.find({
    sender: id,
    receiver: receiver_id,
  })
    .populate("sender", "receiver")
    .then((data) => {
      sent = data;

      Message.find({
        sender: receiver_id,
        receiver: id,
      })
        .then((data) => {
          console.log(data);
          received = data;
          res.json({ sent, received });
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    })
    .catch((err) => {
      console.log(err);
    });

  // User.findById(_id, (err, (err, data)=>{
  //     res.send(data.message)
  // }))
});

app.get(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await console.log('user calling')
    const _id = req.params.id;
  
    //  await console.log(req.headers);
    // console.log(_id);
    // console.log(req.headers.authorization);

    const user = await User.findById(_id).populate({
      path: 'friends.friend',
      model:'User',
      select:['_id','first_name', 'last_name', 'image']
    }).then(async res => {
      const userObj = await res.toObject();
      await console.log(userObj)
     const friends= await User.find().where('_id').in(userObj.friends)
     .then(async result => await result)
      .catch(err =>console.log(err))
   
       userObj.friends =  friends;
      return userObj
    })
    .catch(err=> console.log(err))

    const messages = await Message.find({ sender: _id })
      .populate(["sender", "receiver"])
      .then((data) => data)
      .catch((err) => res.send(err));
       await console.log('user friends ' + user.friends)
    res.json({ user, messages });

    // .populate('messages', 'text' )
    // .exec(function(err, doc){
    //   if (err){
    //     res.send(err)
    //   }else if(doc){
    //     res.send(doc)
    //   }else{
    //     res.send('something went wrong')
    //   }
    // })
    // .then((user) => {
    //   res.send(user);
    // })
    // .catch((err) => {
    //   res.send(err);
    // });

    // try{
    //   if (!rawUser){
    //     throw new Error("something went wrong log in again")
    //   }else if(rawUser){

    //     const reqUser = await rawUser.toObject();
    //     res.json({reqUser, messages})
    //   }
    // }catch(err){
    //   console.log(err)
    //   res.send(err)
    // }
  }
);

app.get("/request/:id", async (req, res) => {
  try {
    //   const requests_try= await Friends.aggregate(
    //     [

    //       { $project: { "requester.v.messages" : 0} },

    //   ]
    //   ).catch(err=> res.send(err))
    //   res.send(requests_try);
    // }
    const { _id } = req.params;
    const requests = await Requests.find({ recepient: _id })

      .populate("requester recepient", "-friends -messages")
      .then((res) => res)
      .catch((err) => res.send(err));
    res.send(requests);
  } catch (err) {
    res.send(err);
  }
});
app.post("/request", async (req, res) => {
  const { requester, recepient } = req.body;
  await console.log(requester, recepient);
  try {
    const docA = await Requests.findOneAndUpdate(
      { requester: requester, recepient: recepient },
      { $set: { status: 1 } },
      { upsert: true, new: true }
    );

    // if (request){
    // await console.log(request)
    //     Friends.findByIdAndDelete({_id:request._id})
    //     .then(async result=>{
    //       const doc= await result.toObject();
    //       console.log( doc)
    //       res.json({deleted: doc})
    //     })
    //     .catch(err=> res.send(err))
    // }else{
    console.log("creating");
    Requests.create({ requester: requester, recepient: recepient })
      .then(async (result) => {
        await result
          .save()

          .then(async (result) => {
            res.json({ new_request: result });
          });
      })
      .catch((err) => res.json({ error: err.message }));
  } catch (err) {
    // }
    res.json({ error: "the error is" + err });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log("app is listening");
});
// http.listen(port, () => {
//   console.log(`Example app listening at http://localhost:3000`);
// });

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

  socket.on("friend-request", async (data) => {
    const { requester, recepient } = data;
    const request = await Friends.findOneAndUpdate(
      { requester: requester, recepient: recepient },
      { $set: { status: 1 } },
      { upsert: true, new: true }
    )
      .then((doc) => doc)
      .catch((err) => console.log(err));
      await console.log(request)
  });

  socket.on('unfriend', async(friend_id, user_id)=>{
   await  console.log(friend_id, user_id)
         await User.findByIdAndUpdate(
          user_id,
          {$pullAll:{friends:[friend_id]}},
          {multi: true}
         ).then(async res=> res)
          .catch(err=> console.log(err))
  })
  socket.on("fech-requests", async (data) => {
    const { _id } = data;
    console.log(_id);
    const from = await Friends.find({ requester: _id })

      .populate("requester recepient", "-friends -messages")
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((err) => console.log(err));

    const to = await Friends.find({ recepient: _id })

      .populate("requester recepient", "-friends -messages")
      .then((res) => {
        return res;
      })
      .catch((err) => console.log(err));
    console.log(from, to);
    socket.emit("send-requests", { to });

    // this.messages.push({
    //     message: data.message,
    //     type: 1,
    //     user: data.user,
    // });
  });
  socket.on("confirm-request", async (data) => {
    await console.log("confirming request");
    const { requester, recepient } = data;
    const to = await Friends.findOneAndDelete({ requester, recepient })

      .populate("requester recepient", "-friends -messages")
      .then(async (res) => {
       
        const requester_id = res.requester._id;
        const recepient_id= res.recepient._id
        const userA = await User.findByIdAndUpdate(
          requester_id,
          {
            $push: { friends: recepient },
            $set: { status: 3 },
          }
        )
          .then((res) =>res)
          .catch((err) => console.log(err));

        const userB = await User.findByIdAndUpdate(
          recepient_id,
          { $push: { friends: requester },
            $set: { status: 3 } 
          }
        )
          .then((res) => res)
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
    await console.log(to);
  });
  socket.on("delete-request", async (data) => {
    const { _id } = data;
    const request = await Friends.findByIdAndDelete({ _id })
      .then((res) => res)
      .catch((err) => console.log(err));
    console.log("deleted request is : " + request._id);
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
