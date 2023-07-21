import Notiflix from 'notiflix';

import simplelightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { PER_PAGE, fetchDataByQuery } from './pixabay-api';


const galleryRef = document.querySelector('.gallery');
let loadMoreBtnRef = document.querySelector('.load-more');


galleryRef.addEventListener('click', onImageClick);

let page = 1;
let query = '';

document.querySelector('.search-form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    query = evt.target[0].value;
    if (!query.trim()) {
        return
    }
    loadMoreBtnRef.style.display ='none';

    galleryRef.innerHTML = '';

    fetchDataByQuery(query, page = 1)
        .then(response => {
            Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
            return response.data.hits
        })
        .then((data) => {
            createGalleryMarkup(data)
            if (data.length >= PER_PAGE) {
                showLoadBtn()
            }
        })
        .catch(error => Notiflix.Notify.failure(error.message));



})

function createGalleryMarkup(objectArr) {
    let markup = ''
    objectArr.forEach(element => {
        markup += `<div class="photo-card">
            <a href="${element.largeImageURL}">
            <img class="gallery-image" src="${element.webformatURL}" alt="" loading="lazy" />
            </a>
            <div class="info">
            <p class="info-item">
            <b>Likes</b>
              ${element.likes}
            </p>
            <p class="info-item">
              <b>Views</b>
              ${element.views}
            </p>
            <p class="info-item">
              <b>Comments</b>
              ${element.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>
              ${element.downloads}
            </p>
        </div>
        </div>`
    });
    galleryRef.insertAdjacentHTML('beforeend', markup);
    let lightbox = new simplelightbox('.gallery a');
    lightbox.refresh();

}
    
function showLoadBtn() {
    loadMoreBtnRef.style.display ='block';

    loadMoreBtnRef.addEventListener('click', (evt) => {
        evt.preventDefault();
        loadMoreBtnRef.style.display ='none';
        page += 1
        fetchDataByQuery(query, page)
            .then(response => response.data.hits)
            .then(data => {
                if (data.length < PER_PAGE) {
                    return Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
                    
                }
                createGalleryMarkup(data)
                loadMoreBtnRef.style.display ='block';

            })
            .then(() => {
                    const { height: cardHeight } = galleryRef
                    .firstElementChild.getBoundingClientRect();

                    window.scrollBy({
                    top: cardHeight * 2,
                    behavior: "smooth",});
            })
            .catch(() => {
                Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`)
                loadMoreBtnRef.style.display ='none'
            });
    })
}

function onImageClick(evt) {
    evt.preventDefault();
    if (!evt.target.classList.contains('gallery-image')) {
        return
    }
    document.addEventListener("keydown", event => {
        if (event.key ==='Escape'){
            instance.close();
        }
    });
}

