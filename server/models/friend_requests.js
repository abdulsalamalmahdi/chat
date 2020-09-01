const mongoose= require('mongoose')
const requestsSchema = new mongoose.Schema({
    requester: { type: mongoose.Types.ObjectId, ref: 'User'},
    recepient: { type: mongoose.Types.ObjectId, ref: 'User'},
    status: {
      type: Number,
      enums: [
          0,    //'add friend',
          1,    //'requested',
          2,    //'pending',
          3,    //'friends'
      ]
    }
  }, {timestamps: true})
  module.exports = mongoose.model('Friends', requestsSchema)