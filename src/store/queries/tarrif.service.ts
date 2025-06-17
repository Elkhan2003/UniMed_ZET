import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauthSub } from '../../shared/api/api.base-query-subscription'

const TarrifService = createApi({
	reducerPath: 'tarriflApi',
	baseQuery: baseQueryWithReauthSub,
	tagTypes: ['Tarif'],
	endpoints: (builder) => ({
		getTarifs: builder.query<any, void>({
			query: () => '/tariffs',
			providesTags: ['Tarif'],
		}),
		getTarifById: builder.query<any, string>({
			query: (id) => `/tariffs/${id}`,
			providesTags: ['Tarif'],
		}),
		postTarif: builder.mutation<any, any>({
			query: (body) => ({
				url: '/tariffs',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Tarif'],
		}),
		putTarif: builder.mutation<any, { body: any; id: string | number }>({
			query: ({ body, id }) => ({
				url: `/tariffs/${id}`,
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['Tarif'],
		}),
		deleteTarif: builder.mutation<any, any>({
			query: (id) => ({
				url: `/tariffs/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Tarif'],
		}),
		getTarifsActive: builder.query<any, any>({
			query: (categoryType) => `/tariffs/active?categoryType=${categoryType}`,
			providesTags: ['Tarif'],
		}),
		getCompaniesPayment: builder.query<any, { companyId: number }>({
			query: ({ companyId }: { companyId: number }) =>
				`/subscriptions/companies/${companyId}`,
		}),
		postPayment: builder.mutation<any, any>({
			query: (body) => ({
				url: '/subscriptions',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Tarif'],
		}),
		getSubscriptionsCurrent: builder.query<any, any>({
			query: (companyId) => `/subscriptions/companies/${companyId}/current`,
		}),
	}),
})

export default TarrifService

export const {
	usePostTarifMutation,
	useGetTarifsQuery,
	useLazyGetTarifsQuery,
	useGetTarifByIdQuery,
	useDeleteTarifMutation,
	usePutTarifMutation,
	useGetTarifsActiveQuery,
	useGetCompaniesPaymentQuery,
	useLazyGetCompaniesPaymentQuery,
	usePostPaymentMutation,
	useGetSubscriptionsCurrentQuery,
	useLazyGetSubscriptionsCurrentQuery,
} = TarrifService
