import { serviceSlice } from './features/service-slice'
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { authSlice } from './features/auth-slice'
import { calendarSlice } from './features/calendar-slice'
import { masterSlice } from './features/master-slice'
import { categoryServiceSlice } from './features/category-service'
import { branchSlice } from './features/branch-slice'
import { adminSlice } from './features/admin-slice'
import { categorySlice } from './features/category-slice'
import { subCategorySlice } from './features/sub-category-service'
import { countriesSlice } from './features/countries-slice'
import { regionSlice } from './features/region-slice'
import { citySlice } from './features/city-slice'
import { scheduleSlice } from './features/schedule-slice'
import { feedbackSlice } from './features/feedback-slice'
import { appointmentSlice } from './features/appointment'
import { usersSlice } from './features/user-slice'
import { fileSlice } from './features/file-slice'
import { historySlice } from './features/history-slice'
import { specializationSlice } from './features/specialization-slice'
import { branchWorkSlice } from './features/branchWork-slice'
import { amenitySlice } from './features/amenity-slice'
import { PaymentSlice } from './features/payment-slice'
import { ownerSlice } from './features/owner-slice'
import { cashbackSlice } from './features/cashback-slice'
import dashboardService from './services/dashboard.service'
import calendarService from './services/calendar.service'
import masterService from './services/master.service'
import branchService from './services/branch.service'
import userService from './services/user.service'
import scheduleService from './services/schedule.service'
import facilitiesService from './services/fcilities.service'
import worksService from './services/works.service'
import reportService from './services/report.service'
import countryService from './services/country.service'
import regionService from './services/region.service'
import serviceService from './services/service.service'
import templateService from './services/push-template.service'
import specializationService from './services/specialization.service'
import settingsSuperService from './services/settingssevice.service'
import individualService from './queries/individual.service'
import V2MasterService from './queries/masters.service'
import V2schedulesService from './queries/schedule.service'
import { individualSlice } from './slices/individual.slice'
import servicesOfMaster from './queries/services.master.service'
import { s3FileSlice } from './features/s3-slice'
import { companiesSlice } from './features/company-slice'
import { ownerCompanySlice } from './slices/company.slice'
import companyService from './queries/company.service'
import serviceCategoryService from './queries/service.category.service'
import branchAmenties from './queries/branch.amenities.service'
import breaksService from './queries/breaks.service'
import TarrifService from './queries/tarrif.service'
import { singleBranchService } from './services/single.branch.service'

export const store = configureStore({
	reducer: {
		individual: individualSlice.reducer,

		auth: authSlice.reducer,
		calendar: calendarSlice.reducer,
		master: masterSlice.reducer,
		companies: companiesSlice.reducer,
		categoryService: categoryServiceSlice.reducer,
		admin: adminSlice.reducer,
		branch: branchSlice.reducer,
		category: categorySlice.reducer,
		subCategory: subCategorySlice.reducer,
		countries: countriesSlice.reducer,
		region: regionSlice.reducer,
		city: citySlice.reducer,
		schedule: scheduleSlice.reducer,
		service: serviceSlice.reducer,
		feedback: feedbackSlice.reducer,
		appointment: appointmentSlice.reducer,
		users: usersSlice.reducer,
		file: fileSlice.reducer,
		country: countriesSlice.reducer,
		history: historySlice.reducer,
		specialization: specializationSlice.reducer,
		branchWorks: branchWorkSlice.reducer,
		amenity: amenitySlice.reducer,
		owner: ownerSlice.reducer,
		cashback: cashbackSlice.reducer,
		s3File: s3FileSlice.reducer,
		ownerCompany: ownerCompanySlice.reducer,

		[individualService.reducerPath]: individualService.reducer,
		[V2MasterService.reducerPath]: V2MasterService.reducer,
		[V2schedulesService.reducerPath]: V2schedulesService.reducer,
		[breaksService.reducerPath]: breaksService.reducer,
		[PaymentSlice.name]: PaymentSlice.reducer,
		[dashboardService.reducerPath]: dashboardService.reducer,
		[calendarService.reducerPath]: calendarService.reducer,
		[specializationService.reducerPath]: specializationService.reducer,
		[masterService.reducerPath]: masterService.reducer,
		[branchService.reducerPath]: branchService.reducer,
		[settingsSuperService.reducerPath]: settingsSuperService.reducer,
		[userService.reducerPath]: userService.reducer,
		[scheduleService.reducerPath]: scheduleService.reducer,
		[facilitiesService.reducerPath]: facilitiesService.reducer,
		[worksService.reducerPath]: worksService.reducer,
		[reportService.reducerPath]: reportService.reducer,
		[countryService.reducerPath]: countryService.reducer,
		[regionService.reducerPath]: regionService.reducer,
		[serviceService.reducerPath]: serviceService.reducer,
		[templateService.reducerPath]: templateService.reducer,
		[servicesOfMaster.reducerPath]: servicesOfMaster.reducer,
		[companyService.reducerPath]: companyService.reducer,
		[serviceCategoryService.reducerPath]: serviceCategoryService.reducer,
		[branchAmenties.reducerPath]: branchAmenties.reducer,
		[singleBranchService.reducerPath]: singleBranchService.reducer,
		[TarrifService.reducerPath]: TarrifService.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			individualService.middleware,
			V2MasterService.middleware,
			V2schedulesService.middleware,
			breaksService.middleware,
			dashboardService.middleware,
			calendarService.middleware,
			masterService.middleware,
			specializationService.middleware,
			branchService.middleware,
			userService.middleware,
			userService.middleware,
			scheduleService.middleware,
			facilitiesService.middleware,
			worksService.middleware,
			reportService.middleware,
			countryService.middleware,
			regionService.middleware,
			serviceService.middleware,
			templateService.middleware,
			settingsSuperService.middleware,
			servicesOfMaster.middleware,
			companyService.middleware,
			serviceCategoryService.middleware,
			branchAmenties.middleware,
			singleBranchService.middleware,
			TarrifService.middleware
		),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
