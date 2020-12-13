const KEY = '18977229-7092af5d4460397c12f37767a';
const BASE_URL = `https://pixabay.com/api/`;

function fetchImages(searchQuery, page) {
  const url = `${BASE_URL}?q=${searchQuery}&page=1&key=${KEY}&image_type=photo&orientation=horizontal&per_page=${
    page * 12
  }`;

  return fetch(url).then(response => {
    if (response.ok) {
      return response.json();
    }

    return Promise.reject(new Error('No response from server'));
  });
}

const api = {
  fetchImages,
};

export default api;
