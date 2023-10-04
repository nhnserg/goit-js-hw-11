import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from '/src/axiosCongif';

const perPage = 40;
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
  const galleryHTML = images
    .map(
      image => `<div class="photo-card">
        <a href="${image.largeImageURL}">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Views:</b> ${image.views}</p>
          <p class="info-item"><b>Likes:</b> ${image.likes}</p>
          <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
          <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        </div>
      </div>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', galleryHTML);
  lightbox.refresh();
}

async function searchImages(query, page = 1) {
  if (page === 1) {
    clearGallery();
    currentPage = 1;
  }

  const params = {
    q: query,
    page: page,
  };

  try {
    const response = await axios.get('', { params });
    const data = response.data;
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      updateGallery(data.hits);
    }
    if (page === 1) {
      Notiflix.Notify.success(`We found ${data.totalHits} images.`);
    }
    if (gallery.childElementCount < data.totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.error('Ошибка', error);
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
    currentPage += 1;

    searchImages(searchQuery, currentPage);
    scrollToGallery();
  }
}

searchForm.addEventListener('submit', handleSearchFormSubmit);
loadMoreButton.addEventListener('click', handleLoadMoreButtonClick);

Notiflix.Notify.init();
