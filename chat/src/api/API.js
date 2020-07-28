
class API {
    constructor() {
      this.BASE_URL = "http://localhost:3000";
      this.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization':JSON.parse(localStorage.getItem('user_token')),
      };
    }
  
    handleResponse = async (response) => {
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          const result = await response.json();
          throw result;
        } else {
          throw response.statusText;
        }
      }
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) return response.json();
      return response;
    }
  
    getOptions(method, body = null) {
      const options = {
        method: method.toUpperCase(),
        headers: this.headers,
        credentials: 'include'
      };
  
      if (body) options.body = JSON.stringify(body);
  
      return options;
    }
  }
  
  export default API;
  