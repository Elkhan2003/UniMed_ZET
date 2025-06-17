import { Navigate, Route, Router, Routes } from 'react-router-dom'
import { OWNER_ROUTES } from '../lib/constants/routes'
import { AffiliatePage } from '../../pages/owner/affiliate'
import { CreateAffiliate } from '../../pages/owner/create/affiliate'
import { InnerAffiliatePage } from '../../pages/owner/affiliate/inner'
import { AdminsOwner } from '../../pages/owner/affiliate/inner/admins'
import { FeedbacksOwner } from '../../pages/owner/affiliate/inner/feedbacks'
import { FacilitiesPage } from '../../pages/admin/Settings/FacilitiesPage/FacilitiesPage'
import { OurWorksPage } from '../../pages/admin/Settings/OurWorksPage/OurWorksPage'
import { SamplePage } from '../../pages/admin/Settings/SamplePage/SamplePage'
import { MasterInnerPage } from '../../pages/owner/affiliate/inner/Master/MasterInnerPage/MasterInnerPage'
import { Appointments } from '../../pages/owner/affiliate/inner/Master/MasterInnerPage/appointments/Appointments'
import { Rewievs } from '../../pages/owner/affiliate/inner/Master/MasterInnerPage/rewievs/Rewievs'
import { Service } from '../../pages/owner/affiliate/inner/Master/MasterInnerPage/services/Service'
import { Specialization } from '../../pages/owner/affiliate/inner/Master/MasterInnerPage/specialization/Specialization'
import { AboutMaster } from '../../pages/owner/affiliate/inner/Master/MasterInnerPage/about'
import PersonalService from '../../pages/personal_master/Service'
import { MasterPage } from '../../pages/owner/affiliate/inner/Master/MasterPage/MasterPage'
import { Subscription } from '../../pages/personal_master/Subscription'
import ProfileOwner from '../../pages/owner/ProfileOwner'
import { AnalyticsPage } from '../../pages/owner/analytics'
import { SubscriptionCheckWrapper } from '../hooks/wrapper-check'
import { ReportsPage } from '../../pages/owner/reports'
import { MarketingPage } from '../../pages/owner/marketing'
import MasterPrivilegesPage from '../../pages/owner/affiliate/inner/Master/MasterInnerPage/privilege'
import { Layout } from '../layout'
import { OwnerItems } from '../layout/const'
import { OwnerHeader } from '../layout/headers/owner'
import { ownerLinks } from '../links'
import { OwnerSettingsPage } from '../../pages/owner/settings'
import { EmployeesPage } from '../../pages/employees'
import { EmployeeDetails } from '../../pages/employees/details'
import { StockPage } from '../../pages/stock'
import { AppointmentsPage } from '../../pages/appointments'
import { ServicesPage } from '../../pages/services'
import { ServicesSubcategoriesPage } from '../../pages/services/subcategories'
import { Movements } from '../../pages/stock/movements'

export default function OwnerRoutes() {
	return (
		<Routes>
			<Route
				path={ownerLinks.default}
				element={<Layout items={OwnerItems} children={<OwnerHeader />} />}
			>
				<Route path="/" element={<Navigate to={ownerLinks.analytics} />} />
				<Route
					path={OWNER_ROUTES.AFFILIATE.path}
					element={
						<SubscriptionCheckWrapper>
							<AffiliatePage />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={OWNER_ROUTES.PROFILE.path}
					element={
						<SubscriptionCheckWrapper>
							<ProfileOwner />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={`${OWNER_ROUTES.AFFILIATE.path}/:id`}
					element={
						<SubscriptionCheckWrapper>
							<InnerAffiliatePage />
						</SubscriptionCheckWrapper>
					}
				>
					<Route
						path={`admins`}
						element={
							<SubscriptionCheckWrapper>
								<AdminsOwner />
							</SubscriptionCheckWrapper>
						}
					/>
					<Route
						path={`masters`}
						element={
							<SubscriptionCheckWrapper>
								<MasterPage />
							</SubscriptionCheckWrapper>
						}
					/>
					<Route
						path={`feedbacks`}
						element={
							<SubscriptionCheckWrapper>
								<FeedbacksOwner />
							</SubscriptionCheckWrapper>
						}
					/>
					<Route
						path={`facilities`}
						element={
							<SubscriptionCheckWrapper>
								<FacilitiesPage />
							</SubscriptionCheckWrapper>
						}
					/>
					<Route
						path={`services`}
						element={
							<SubscriptionCheckWrapper>
								<PersonalService />
							</SubscriptionCheckWrapper>
						}
					/>
					<Route
						path={`ourworks`}
						element={
							<SubscriptionCheckWrapper>
								<OurWorksPage />
							</SubscriptionCheckWrapper>
						}
					/>
					<Route
						path={`sample`}
						element={
							<SubscriptionCheckWrapper>
								<SamplePage />
							</SubscriptionCheckWrapper>
						}
					/>
					{/* <Route
						path={`schedule`}
						element={
							<SubscriptionCheckWrapper>
								<Schedules />
							</SubscriptionCheckWrapper>
						}
					/> */}
				</Route>
				<Route
					path={OWNER_ROUTES.AFFILIATECREATE.path}
					element={
						<SubscriptionCheckWrapper>
							<CreateAffiliate />
						</SubscriptionCheckWrapper>
					}
				/>
				{/* <Route
					path={OWNER_ROUTES.BONUS.path}
					element={
						<SubscriptionCheckWrapper>
							<BonusPage />
						</SubscriptionCheckWrapper>
					}
				/> */}
				<Route
					path={OWNER_ROUTES.MASTER.path}
					element={
						<SubscriptionCheckWrapper>
							<MasterInnerPage />
						</SubscriptionCheckWrapper>
					}
				>
					<Route
						path={OWNER_ROUTES.MASTER_APPOINTMENT.path}
						element={
							<SubscriptionCheckWrapper>
								<Appointments />
							</SubscriptionCheckWrapper>
						}
					/>
					<Route
						path={OWNER_ROUTES.MASTER_REWIEVS.path}
						element={
							<SubscriptionCheckWrapper>
								<Rewievs />
							</SubscriptionCheckWrapper>
						}
					/>
					<Route
						path={OWNER_ROUTES.MASTER_SERVICE.path}
						element={
							<SubscriptionCheckWrapper>
								<Service />
							</SubscriptionCheckWrapper>
						}
					/>
					<Route
						path={OWNER_ROUTES.MASTER_SPECIALIZATION.path}
						element={
							<SubscriptionCheckWrapper>
								<Specialization />
							</SubscriptionCheckWrapper>
						}
					/>
					<Route
						path={OWNER_ROUTES.MASTER_ABOUT.path}
						element={
							<SubscriptionCheckWrapper>
								<AboutMaster />
							</SubscriptionCheckWrapper>
						}
					/>
					<Route
						path={OWNER_ROUTES.MASTER_PRIVILAGE.path}
						element={
							<SubscriptionCheckWrapper>
								<MasterPrivilegesPage />
							</SubscriptionCheckWrapper>
						}
					/>
				</Route>
				<Route
					path={OWNER_ROUTES.SUBSCRIPTION.path}
					element={
						<SubscriptionCheckWrapper>
							<Subscription />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={ownerLinks.settings}
					element={
						<SubscriptionCheckWrapper>
							<OwnerSettingsPage />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={ownerLinks.analytics}
					element={
						<SubscriptionCheckWrapper>
							<AnalyticsPage />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={ownerLinks.reports}
					element={
						<SubscriptionCheckWrapper>
							<ReportsPage />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={ownerLinks.marketing}
					element={
						<SubscriptionCheckWrapper>
							<MarketingPage />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={ownerLinks.employees}
					element={
						<SubscriptionCheckWrapper>
							<EmployeesPage />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={`${ownerLinks.employees}/:id`}
					element={
						<SubscriptionCheckWrapper>
							<EmployeeDetails />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={ownerLinks.stock}
					element={
						<SubscriptionCheckWrapper>
							<StockPage />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={ownerLinks.stock_history_product_movement}
					element={<Movements />}
				/>
				<Route
					path={ownerLinks.appointments}
					element={
						<SubscriptionCheckWrapper>
							<AppointmentsPage />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={ownerLinks.services}
					element={
						<SubscriptionCheckWrapper>
							<ServicesPage />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={ownerLinks.services_subcategories}
					element={<ServicesSubcategoriesPage />}
				/>
			</Route>
		</Routes>
	)
}
