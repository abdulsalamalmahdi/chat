import API from "./API";
import axios from "axios"





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
}

export default new userApi();
