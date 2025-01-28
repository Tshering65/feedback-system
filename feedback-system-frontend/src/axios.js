import axios from 'axios';

axios.get("http://localhost:5000/api", { 
  withCredentials: true  // This allows sending cookies with requests
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });
export default instance;
