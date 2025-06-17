import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'
import { toast } from 'react-hot-toast'

interface CompaniesProps {
	isLoadingCompanies: boolean
	company: any
	companies: []
	listSearch: any[]
}
interface IpostData {
	name: string
	logo: string
	domain?: string
	instagram?: string
	categoryType?: string
	branchRequest:
		| {
				phoneNumber: string
				regionId: number
				cityId: number
				addressRequest:
					| {
							name: string
							latitude: number
							longitude: number
					  }
					| undefined
		  }
		| undefined
	ownerRequest:
		| {
				firstName: string
				lastName: string
		  }
		| undefined
	authInfoRequest: {
		phoneNumber: string
		password: string
	}
}

interface IpropsPostComp {
	Data: IpostData
	navigateHandler?: any
}

export const getCompanies = createAsyncThunk(
	'companies/getCompanies',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get('companies')
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const postCompanies = createAsyncThunk(
	'companies/postCompanies',
	async ({ Data, navigateHandler }: IpropsPostComp, { rejectWithValue }) => {
		try {
			const formData = new FormData()
			formData.append('file', Data.logo)
			const responseImg = await axiosInstance.post('files', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			const imgLink = await responseImg.data.link
			const updatedData = { ...Data, logo: imgLink }
			const response = await axiosInstance.post(`companies`, updatedData)
			toast.success(response.data.message)
			navigateHandler()
			return response.data
		} catch (error) {
			toast.error((error as Error).message)
			rejectWithValue((error as Error).message)
		}
	}
)

export const companiesDelete = createAsyncThunk(
	'companies/companiesDelete',
	async (
		companyId: number | string | undefined,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.delete(`companies/${companyId}`)
			toast.success('Удаление прошло успешно!')
			dispatch(getCompanies())
			return response.data
		} catch (error) {
			toast.error((error as Error).message)
			return rejectWithValue((error as Error).message)
		}
	}
)

export const companiesPut = createAsyncThunk(
	'companies/companiesPut',
	async (
		{ data, companyId }: { companyId: number | string | undefined; data: any },
		{ rejectWithValue, dispatch }
	) => {
		try {
			let image = ''
			if (typeof data.logo !== 'string') {
				const formData = new FormData()
				formData.append('file', data.logo)
				const res = await axiosInstance.post('files', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})
				image = await res.data.link
			}
			const response = await axiosInstance.put(`companies/${companyId}`, {
				...data,
				logo: typeof data.logo !== 'string' ? image : data.logo,
			})
			toast.success(response.data.message)
			dispatch(getCompanies())
			return response.data
		} catch (error) {
			toast.error((error as Error).message)
			return rejectWithValue((error as Error).message)
		}
	}
)

export const getCompanyById = createAsyncThunk(
	'Company/getCompanyById',
	async ({ companyId }: { companyId: number }, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(`companies/${companyId}`)
			return response.data
		} catch (error) {
			return rejectWithValue((error as Error).message)
		}
	}
)

export const getSearchCompanies = createAsyncThunk(
	'Company/getSearchCompanies',
	async ({ search }: { search: string }, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(
				`companies/search?search=${search}`
			)
			return response.data
		} catch (error) {
			return rejectWithValue((error as Error).message)
		}
	}
)

const initialState: CompaniesProps = {
	isLoadingCompanies: false,
	companies: [],
	company: [],
	listSearch: [],
}

export const companiesSlice = createSlice({
	name: 'companies',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getCompanyById.pending, (state) => {
			state.isLoadingCompanies = true
		})
		builder.addCase(getCompanyById.fulfilled, (state, { payload }) => {
			state.isLoadingCompanies = true
			state.company = payload
		})
		builder.addCase(getCompanyById.rejected, (state) => {
			state.isLoadingCompanies = false
		})

		builder.addCase(getCompanies.pending, (state) => {
			state.isLoadingCompanies = true
		})
		builder.addCase(getCompanies.fulfilled, (state, action) => {
			state.isLoadingCompanies = false
			state.companies = action.payload
		})
		builder.addCase(getCompanies.rejected, (state) => {
			state.isLoadingCompanies = false
		})

		builder.addCase(companiesDelete.pending, (state) => {
			state.isLoadingCompanies = true
		})
		builder.addCase(companiesDelete.fulfilled, (state) => {
			state.isLoadingCompanies = false
		})
		builder.addCase(companiesDelete.rejected, (state) => {
			state.isLoadingCompanies = false
		})
		builder.addCase(getSearchCompanies.pending, (state) => {
			state.isLoadingCompanies = true
		})
		builder.addCase(getSearchCompanies.fulfilled, (state, { payload }) => {
			state.isLoadingCompanies = false
			state.listSearch = payload
		})
		builder.addCase(getSearchCompanies.rejected, (state) => {
			state.isLoadingCompanies = false
		})
	},
})
