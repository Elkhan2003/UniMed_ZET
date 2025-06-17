import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Company } from '../../common/companies'
import companyService from '../queries/company.service'
import TarrifService from '../queries/tarrif.service'
import axiosInstance from '../../shared/api/axios-config'
import toast from 'react-hot-toast'

interface initialState {
	ownerData: Company | undefined
	tarriff: any
}

const initialState: initialState = {
	ownerData: undefined,
	tarriff: undefined
}

export const putCompaniesLogo = createAsyncThunk(
	'master/putAvatarMaster',
	async (
		{ companyId, avatar}: {companyId: number | undefined | string, avatar: any},
		{ rejectWithValue }
	) => {
		try {
			const formData = new FormData()
			formData.append('file', avatar)

			const res = await axiosInstance.post('files', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			const finalAvatar = await res.data

			const response = await axiosInstance.put(
				`/companies/${companyId}/logo?logo=${finalAvatar}`
			)
			toast.success('Лого загружен!')
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const ownerCompanySlice = createSlice({
	name: 'ownerCompany',
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(
			companyService.endpoints.getCompanyCurrent.matchFulfilled,
			(state, { payload }) => {
				state.ownerData = payload
			}
		)
		builder.addMatcher(
			TarrifService.endpoints.getSubscriptionsCurrent.matchFulfilled,
			(state, { payload }) => {
				state.tarriff = payload
			}
		)
	},
})
