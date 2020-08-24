import API from "./API";
import axios from "axios"



axios.interceptors.request.use(function(res){
  return res; 
}, function(err){
  if(err.status === '401'){
    console.log(typeof err.status)
    localStorage.removeItem('user_token');
    localStorage.removeItem('_id')
  }
})

class userApi extends API {
  ENDPOINT = this.BASE_URL;

  
  login = async credentials =>
      await axios.post(`${this.ENDPOINT}/login`,  credentials);
        //  await fetch(`${this.ENDPOINT}/login`, this.getOptions("post", credentials))
      //  .then(this.handleResponse)
      // .catch( err =>console.log(err.response.data));

      signUp = async credentials =>
    await fetch(`${this.ENDPOINT}/register`, this.getOptions("post", credentials))
      .then(this.handleResponse)
      .catch(err => console.error(err));

      uploadImage = async (_id, imageurl)=> 
      await axios.patch(`${this.ENDPOINT}/${_id}`, this.getOptions('patch', imageurl))
      .then(this.handleResponse)
      .catch(err=> console.error(err));

      user= async (_id ) =>{
  await fetch(`${this.ENDPOINT + ":" + _id}`, this.getOptions("get")).then(user=>{
    console.log("authed: " + user)
  }).catch(err => console.log(err))
}
seenMessage= async(id)=>{
  await axios.put(`${this.ENDPOINT}/message/${id}`)
}
}


export default new userApi();
