import axios from "axios";

const API_KEY = 'iWstpSZgo6VaLHZu1nrJJiLFn6WzCLh7M3xX1d1bm8Y';

const unsplash = axios.create({
    baseURL: 'https://api.unsplash.com',
});

export const getPhotos = async (query) => {
    try {
        const params = {
            count: 100,
            client_id: API_KEY,
            query: query
        };

        const res = await unsplash.get('/photos/', { params });

        return res.data;
    } catch (error) {
        console.error('Error al obtener fotos de Unsplash:', error);
        throw error;
    }
}