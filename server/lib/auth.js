const jwt = require('jsonwebtoken');

const User= require('../models/user.model.js')
require('dotenv').config();
const cookieParser = require('cookie-parser')
const secret_key= process.env.JWT_SECRET;

exports.createToken= (user, expiresIn = null)=>{
    

    const options = {};
   // console.log(secret_key)
   
    if (expiresIn) options.expiresIn= expiresIn;
    
     console.log(options)
         const signedToken = jwt.sign({user},secret_key,options)
    return {
        token:"Bearer " + signedToken,
        expires:expiresIn,
    }

}


// exports.findUserByToken = async (token) => {
//     const payload = await jwt.verify(token, secret_key);
//     return User.findById(payload.sub)
//       .select('+passwordResetToken')
//       .select('+accountConfirmationToken');
//   };

//   exports.authMW = async(req, res, next)=>{
     

//     try{
//          if (req.cookies === undefined) throw 'Unautherized';
//         //  console.log(req.cookies.jwt[0], req.cookies.jwtSig)
//         const cookie = req.cookies;
//         //  console.log(req.headers.cookie);
       
//          const cookieReconst= cookie.jwt[0] +"," + cookie.jwt[1]+","+ cookie.jwtSig;
//         const readyCookie= cookieReconst.replace(",", ".").replace(",",".")
//           console.log( readyCookie)
//         //  console.log(" \n space \n")
         
//         //  console.log(cookie)
//        // const token = cookieReconst.split("=")[1];
//         // console.log(readyCookie)
//         // const pureCookie= cookie.replace("jwt=")
//         const decodedToken= jwt.verify(readyCookie, secret_key);
//          console.log(decodedToken)
//         const _id = decodedToken.user._id;
//         //  console.log(_id)
//         //  console.log(req.params.id)
        
//         if (req.params.id !== _id){
//            throw 'Invalid user ID'; 
//         }else{
//             next();
//         }

//     }catch(err){
//         res.status(401).json({
//             error: err
//         })
//     }
   

//   }
  
 