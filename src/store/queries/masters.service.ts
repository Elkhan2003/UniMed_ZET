import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'
import { getMaster } from '../features/master-slice'

const V2MasterService = createApi({
	reducerPath: 'V2MasterApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['master'],
	endpoints: (builder) => ({
		getMasterProfileById: builder.query({
			query: (masterId: number) => `/masters/${masterId}/profile`,
			providesTags: ['master'],
		}),
	}),
})

export default V2MasterService

export const { useGetMasterProfileByIdQuery } = V2MasterService
