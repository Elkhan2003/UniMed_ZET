import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'

const breaksService = createApi({
	reducerPath: 'breaksApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['breaks'],
	endpoints: (builder) => ({
		postBreaks: builder.mutation<any, any>({
			query: ({ masterId, body }) => {
				return {
					url: `/breaks/masters/${masterId}`,
					method: 'POST',
					body: body,
				}
			},
		}),
        putBreaks: builder.mutation<any, any>({
			query: ({ breakId, body }) => {
				return {
					url: `/breaks/${breakId}`,
					method: 'PUT',
					body: body,
				}
			},
		}),
        deleteBreaks: builder.mutation<any, any>({
			query: (breakId: number) => {
				return {
					url: `/breaks/${breakId}`,
					method: 'DELETE',
				}
			},
		}),
	}),
})

export default breaksService

export const {
    usePostBreaksMutation,
    usePutBreaksMutation,
    useDeleteBreaksMutation
} = breaksService
