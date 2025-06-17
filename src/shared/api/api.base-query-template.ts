import { deleteCookie, getCookie } from '../lib/helpers/helpers'
import { FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query'
import { _KEY_AUTH } from '../lib/constants/constants'
import config from '../../config.json'
import { COOKIE } from '../lib/constants/constants'

export const baseQuery = fetchBaseQuery({
	baseUrl: config.TEMP_URL,
	prepareHeaders(headers, { endpoint }: any) {
		const cookieDataString = getCookie(_KEY_AUTH)
		const convertObj = cookieDataString ? JSON.parse(cookieDataString) : {}
		const token = convertObj.token
		const withoutToken = ['']
		headers.set('Accept-Language', 'ru')
		if (token && !withoutToken.includes(endpoint)) {
			headers.set('authorization', `Bearer ${token}`)
			headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
			if (!headers.has('Content-Type')) {
				headers.set('Content-Type', 'application/json')
			}
		}
		return headers
	},
  });
  


export const baseQueryWithReauthTemp = async (
	args: FetchArgs | string,
	api: any,
	extraOptions: any
  ) => {
	const skipAuth = extraOptions?.skipAuth;
  
	if (skipAuth) {
	  return await fetchBaseQuery({ baseUrl: config.TEMP_URL })(args, api, extraOptions);
	}
  
	const result: any = await baseQuery(args, api, extraOptions);
  
	if (result?.error?.status === 403 || result?.response?.status === 403) {
	  await deleteCookie(_KEY_AUTH, `.${COOKIE}`);
	} else if (result?.error?.status === 401 || result?.response?.status === 401) {
	}
  
	return result;
  };
  
