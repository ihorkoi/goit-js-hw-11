import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/?';
const API_KEY = '38137461-021887730cc8bf219daec4c0b';
export const PER_PAGE = 40;

export async function fetchDataByQuery(query, page) {
    
    const response = await axios.get(`${BASE_URL}key=${API_KEY}&q=${query}&orientation=horizontal&image_type=photo&safesearch=true&page=${page}&per_page=${PER_PAGE}`);
    if (!response.data.total) {
        throw new Error ('Sorry, there are no images matching your search query. Please try again.')
    }
    return response
    }