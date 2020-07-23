const mongoose= require('mongoose')
const commentSchema = new mongoose.Schema({
    text: String,
    date: Date,
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