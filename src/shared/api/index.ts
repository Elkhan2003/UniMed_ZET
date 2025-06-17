import axios, { AxiosInstance } from 'axios'
import { _KEY_AUTH } from '../lib/constants/constants'
import { getCookie } from '../lib/helpers/helpers'
import config from '../../config.json'

export const api: AxiosInstance = axios.create({
	baseURL: config.API_URL,
	timeout: 15000,
	headers: {
        'Accept-Language': 'ru'
    }
})

api.interceptors.request.use((config) => {
	const cookieDataString = getCookie(_KEY_AUTH)
	const convertObj = cookieDataString ? JSON.parse(cookieDataString) : {}

	if (convertObj.token) {
		config.headers.Authorization = `Bearer ${convertObj.token}`
	} else {
		config.headers.Authorization = ''
	}

	return config
})

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			// logout()
		}
		return Promise.reject(error)
	}
)

export const apiTemplate: AxiosInstance = axios.create({
	baseURL: config.TEMP_URL,
	timeout: 15000,
	headers: {
        'Accept-Language': 'ru'
    }
})

apiTemplate.interceptors.request.use((config) => {
	const cookieDataString = getCookie(_KEY_AUTH)
	const convertObj = cookieDataString ? JSON.parse(cookieDataString) : {}

	if (convertObj.token) {
		config.headers.Authorization = `Bearer ${convertObj.token}`
	} else {
		config.headers.Authorization = ''
	}

	return config
})

apiTemplate.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			// logout()
		}
		return Promise.reject(error)
	}
)