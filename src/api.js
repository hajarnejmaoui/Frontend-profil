import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:9006', // Remplacez par l'URL de votre backend si nécessaire
});

export default API;
