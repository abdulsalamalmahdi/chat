const bcrypt = require('bcrypt');

exports.hash= (plaintext, saltRounds = 0)=> {
    console.log("hashing")
 return   bcrypt.hash(plaintext, saltRounds)};
exports.compareHash= (plaintext, hash)=>  bcrypt.compareSync(plaintext, hash);
