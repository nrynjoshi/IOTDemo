
const handleResponse = (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

const HttpClient = {
  get: (url) => {
    return fetch(`${url}`)
      .then(handleResponse)
      .catch((error) => {
        console.error('Error:', error);
        throw error;
      });
  },
  post: (url, data) => {
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

