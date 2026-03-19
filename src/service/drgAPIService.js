const axios = require('axios');

const BASE_URL = 'https://drgapi.com';

async function getDeepDives() {
    try {
        const endpoint = '/v1/deepdives'
        const response = await axios.get(BASE_URL+endpoint);
        return response.data;
    } catch (error) {
        console.error('Error fetching data: ', error);
        throw error;
    }
}

async function getSalutes() {
    try {
        const endpoint = '/v1/salutes'
        const response = await axios.get(BASE_URL+endpoint);
        return response.data;
    } catch (error) {
        console.error('Error fetching data: ', error);
        throw error;
    }
}

async function getTrivia() {
    try {
        const endpoint = '/v1/trivia'
        const response = await axios.get(BASE_URL+endpoint);
        return response.data;
    } catch (error) {
        console.error('Error fetching data: ', error);
        throw error;
    }
}

module.exports = {
    getDeepDives,
    getSalutes,
    getTrivia
};