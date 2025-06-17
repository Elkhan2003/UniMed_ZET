import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'
import { IIndividual } from '../../common/individual'

const individualService = createApi({
	reducerPath: 'individualApi',
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({
		getIndividual: builder.query<IIndividual, void>({
			query: () => '/personal-masters/me',
		}),
	}),
})

export default individualService

export const { useGetIndividualQuery } = individualService
