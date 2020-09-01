const mongoose= require('mongoose')
const messageSchema = new mongoose.Schema({
    text: String,
    date:{ type : Date, default: Date.now },
    seen: {
        type: Boolean,
        default: false,
      },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      receiver:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
  });


  module.exports= mongoose.model("Message", messageSchema);