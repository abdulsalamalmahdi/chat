
const mongoose= require('mongoose')
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name:String,
    email:String,
    password:String,
    messages:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },],
    image:String,
    friends:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Friends'
    }],
    
  }, {timestamps: true});

  module.exports= mongoose.model('User', userSchema);