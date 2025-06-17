import { Navigate, Route, Routes } from 'react-router-dom'
import { SUPER_ADMIN_ROUTES } from '../lib/constants/routes'
import { СompanyPage } from '../../pages/super-admin/company'
import { CompanyInnerPage } from '../../pages/super-admin/company/inner'
import { TariffsPage } from '../../pages/super-admin/tariffs'
import { AdressSuper } from '../../pages/super-admin/settings/addres'
import { SpecialityPage } from '../../pages/super-admin/settings/speciality'
import { FacilitiesSuper } from '../../pages/super-admin/settings/facilities'
import { SettingsPage } from '../../pages/super-admin/settings'
import DashboardOutlet from '../layout/dashboard/Dashboard'
import ServiceSuper from '../../pages/super-admin/settings/service'
import { CompanyInnerInfo } from '../../pages/super-admin/company/inner/info'
import { CompanyInnerPayment } from '../../pages/super-admin/company/inner/payment'
import { CompanyInnerChat } from '../../pages/super-admin/company/inner/chat'

export default function SuperAdminRoutes() {
	return (
		<Routes>
			<Route
				path={SUPER_ADMIN_ROUTES.DEFAULT.path}
				element={<DashboardOutlet />}
			>
				<Route
					path={SUPER_ADMIN_ROUTES.DEFAULT.path}
					element={<Navigate to={SUPER_ADMIN_ROUTES.COMPANY.path} />}
				/>
				<Route
					path={SUPER_ADMIN_ROUTES.COMPANY.path}
					element={<СompanyPage />}
				/>
				<Route
					path={SUPER_ADMIN_ROUTES.COMPANY_INNER.path}
					element={<CompanyInnerPage />}
				>
					<Route path="info" element={<CompanyInnerInfo />} />
					<Route path="payment" element={<CompanyInnerPayment />} />
					<Route path="chat" element={<CompanyInnerChat />} />
				</Route>
				<Route
					path={SUPER_ADMIN_ROUTES.TARIFFS.path}
					element={<TariffsPage />}
				/>
				<Route
					path={SUPER_ADMIN_ROUTES.SETTINGS.path}
					element={<SettingsPage />}
				>
					<Route path="addres" element={<AdressSuper />} />
					<Route path="facilities" element={<FacilitiesSuper />} />
					<Route path="speciality" element={<SpecialityPage />} />
					<Route path="service" element={<ServiceSuper />} />
				</Route>
			</Route>
		</Routes>
	)
}
