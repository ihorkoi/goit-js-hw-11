import axios from "axios";
// const axios = require('axios').default;
import Notiflix from 'notiflix';

import simplelightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api/?';
const API_KEY = '38137461-021887730cc8bf219daec4c0b';
const PER_PAGE = 40;

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
    if (!loadMoreBtnRef.hasAttribute('hidden')) {
        loadMoreBtnRef.hidden = true;
    }
    galleryRef.innerHTML = '';

    fetchDataByQuery(query, page = 1)
        .then(response => {
            console.log(response.data)
        Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
        return response.data.hits
        })
        .then((data) => {
            createGalleryMarkup(data)
            if (data.length >= PER_PAGE) {
                onSubmitClick()
            }

        })
        // .then(() => {
        //     if (!loadMoreBtnRef) {
        //         onSubmitClick()
        //     }
        // })
        .catch(error => Notiflix.Notify.failure(error.message));



})


async function fetchDataByQuery(query, page) {
    const response = await axios.get(`${BASE_URL}key=${API_KEY}&q=${query}&page=${page}&per_page=${PER_PAGE}`);
    if (!response.data.total) {
        throw new Error ('Sorry, there are no images matching your search query. Please try again.')
    }
    return response
    }

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
    
function onSubmitClick() {
    // const markup = '<button class="load-more" type=button>Load More</button>';
    // document.querySelector('body').insertAdjacentHTML('beforeend', markup)
    
    loadMoreBtnRef.addEventListener('click', (evt) => {
        evt.preventDefault();
        page += 1
        fetchDataByQuery(query, page)
            .then(response => response.data.hits)
        .then(data => createGalleryMarkup(data));
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
