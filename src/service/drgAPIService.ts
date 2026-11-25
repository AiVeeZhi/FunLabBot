import axios from 'axios';
import { DeepDiveResponse, DRGListResponse } from '../types/drg';

const BASE_URL = 'https://drgapi.com';

export async function getDeepDives(): Promise<DeepDiveResponse> {
	try {
		const endpoint = '/v1/deepdives';
		const response = await axios.get<DeepDiveResponse>(`${BASE_URL}${endpoint}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching data: ', error);
		throw error;
	}
}

export async function getSalutes(): Promise<DRGListResponse> {
	try {
		const endpoint = '/v1/salutes';
		const response = await axios.get<DRGListResponse>(`${BASE_URL}${endpoint}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching data: ', error);
		throw error;
	}
}

export async function getTrivia(): Promise<DRGListResponse> {
	try {
		const endpoint = '/v1/trivia';
		const response = await axios.get<DRGListResponse>(`${BASE_URL}${endpoint}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching data: ', error);
		throw error;
	}
}