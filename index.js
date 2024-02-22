console.log("lskdjfslkdfj");

// Define the API URL
const apiUrl = 'https://api.vam.ac.uk/v2/museumobject/O828146';

// Make a GET request
fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });