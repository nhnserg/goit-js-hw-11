// import axios from 'axios';
// import SimpleLightbox from 'simplelightbox';
// import Notiflix from 'notiflix';

// const searchForm = document.getElementById('search-form');
// const gallery = document.querySelector('.gallery');
// const loadMoreBtn = document.querySelector('.load-more');

// const apiKey = '39797585-95f120e70fb7e422bd65b56f5'; // Замените на свой API ключ Pixabay
// const perPage = 40;
// let page = 1;
// let currentQuery = '';

// const lightbox = new SimpleLightbox('.gallery a');

// searchForm.addEventListener('submit', async e => {
//   e.preventDefault();
//   const searchQuery = e.target.elements.searchQuery.value.trim();
//   if (!searchQuery) return;

//   if (searchQuery !== currentQuery) {
//     page = 1;
//     gallery.innerHTML = '';
//   }

//   currentQuery = searchQuery;

//   try {
//     const response = await axios.get('https://pixabay.com/api/', {
//       params: {
//         key: apiKey,
//         q: searchQuery,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//         per_page: perPage,
//         page: page,
//       },
//     });

//     const { data } = response;

//     if (data.hits.length === 0) {
//       Notiflix.Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     } else {
//       gallery.innerHTML += generateGalleryMarkup(data.hits);
//       lightbox.refresh();
//       page++;
//       if (page === 2) {
//         loadMoreBtn.style.display = 'block';
//       }
//       if (page * perPage >= data.totalHits) {
//         loadMoreBtn.style.display = 'none';
//         Notiflix.Notify.info('We found ' + data.totalHits + ' images.');
//       }
//       scrollPage();
//     }
//   } catch (error) {
//     console.error(error);
//     Notiflix.Notify.failure('Something went wrong. Please try again later.');
//   }
// });

// loadMoreBtn.addEventListener('click', () => {
//   searchForm.dispatchEvent(new Event('submit'));
// });

// function generateGalleryMarkup(images) {
//   return images
//     .map(image => {
//       return `
//         <div class="photo-card">
//           <a href="${image.largeImageURL}">
//             <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
//           </a>
//           <div class="info">
//             <p class="info-item"><b>Likes:</b> ${image.likes}</p>
//             <p class="info-item"><b>Views:</b> ${image.views}</p>
//             <p class="info-item"><b>Comments:</b> ${image.comments}</p>
//             <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
//           </div>
//         </div>
//       `;
//     })
//     .join('');
// }

// function scrollPage() {
//   const { height: cardHeight } =
//     gallery.firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }

import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiKey = '39797585-95f120e70fb7e422bd65b56f5';
const perPage = 20;
let currentPage = 1;

const searchForm = document.getElementById('search-form');
const loadMoreButton = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

const lightbox = new SimpleLightbox('.photo-card a');

function clearGallery() {
  gallery.innerHTML = '';
}

function showLoadMoreButton() {
  loadMoreButton.style.display = 'block';
}

function hideLoadMoreButton() {
  loadMoreButton.style.display = 'none';
}

function scrollToGallery() {
  const { height: cardHeight } =
    gallery.lastElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function updateGallery(images) {
  images.map(image => {
    const photoCard = document.createElement('div');
    photoCard.className = 'photo-card';
    photoCard.innerHTML = `
    <a href ="${image.largeImageURL}"><img src ="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item"><b>Likes:</b> ${image.likes}</p>
      <p class="info-item"><b>Views:</b> ${image.views}</p>
      <p class="info-item"><b>Comments:</b> ${image.comments}</p>
      <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
    </div>`;
    gallery.appendChild(photoCard);
  });

  lightbox.refresh();
}
function showMessage(message) {
  Notiflix.Notify.info(message);
}
async function searchImages(query, page = 1) {
  if (page === 1) {
    clearGallery();
    currentPage = 1;
  }

  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;
    if (data.hits.length === 0) {
      showMessage(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      updateGallery(data.hits);
    }
    if (page === 1) {
      showMessage(`We found ${data.totalHits} images.`);
    }
    if (gallery.childElementCount < data.totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      showMessage("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.error('Error', error);
  }
}
function handleSearchFormSubmit(e) {
  e.preventDefault();
  const searchQuery = searchForm.searchQuery.value.trim();
  if (searchQuery !== '') {
    searchImages(searchQuery);
  }
}

function handleLoadMoreButtonClick() {
  const searchQuery = searchForm.searchQuery.value.trim();
  if (searchQuery !== '') {
    currentPage++;
    
    searchImages(searchQuery, currentPage);
    scrollToGallery();
  }
}

searchForm.addEventListener('submit', handleSearchFormSubmit);
loadMoreButton.addEventListener('click', handleLoadMoreButtonClick);

notiflix.Notify.init();
