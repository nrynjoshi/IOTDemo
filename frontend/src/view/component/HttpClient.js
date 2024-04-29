
//get the backend endpoint api to call 
const BACKEND_API_CALL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEV_API_URL : process.env.REACT_APP_DEV_API_URL;

const handleResponse = (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

const HttpClient = {
  //get method call
  get: (url) => {
    url = BACKEND_API_CALL + url;
    return fetch(`${url}`)
      .then(handleResponse)
      .catch((error) => {
        console.error('Error:', error);
        throw error;
      });
  },
  //post method call
  post: (url, data) => {
    url = BACKEND_API_CALL + url;
    return fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(handleResponse)
      .catch((error) => {
        console.error('Error:', error);
        throw error;
      });
  },
}

export default HttpClient;

