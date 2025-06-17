import { Navigate, Route, Routes } from 'react-router'
import { ADMIN_ROUTES } from '../lib/constants/routes'
import { MasterInnerPage } from '../../pages/owner/affiliate/inner/Master/MasterInnerPage/MasterInnerPage'
import { Appointments } from '../../pages/owner/affiliate/inner/Master/MasterInnerPage/appointments/Appointments'
import { Rewievs } from '../../pages/owner/affiliate/inner/Master/MasterInnerPage/rewievs/Rewievs'
import { Service } from '../../pages/owner/affiliate/inner/Master/MasterInnerPage/services/Service'
import { UserPage } from '../../pages/admin/User/UserPage/UserPage'
import { Specialization } from '../../pages/owner/affiliate/inner/Master/MasterInnerPage/specialization/Specialization'
import { MasterPage } from '../../pages/owner/affiliate/inner/Master/MasterPage/MasterPage'
import { SettingsPage } from '../../pages/admin/Settings/SettingsState'
import { AboutMaster } from '../../pages/owner/affiliate/inner/Master/MasterInnerPage/about'
import { LayoutContent } from '../../components/UI/LayoutContent'
import PersonalService from '../../pages/personal_master/Service'
import NotificationsPage from '../../pages/personal_master/Notifications'
import { Calendar } from '../../components/Calendar'
import { ReportsPage } from '../../pages/owner/reports'
import { Layout } from '../layout'
import { AdminItems } from '../layout/const'
import { adminLinks } from '../links'
import { AdminHeader } from '../layout/headers/admin'
import { AppointmentsPage } from '../../pages/appointments'
import { NotificationPage } from '../../pages/notification'
import { ServicesPage } from '../../pages/services'

export default function AdminRoutes() {
	return (
		<Routes>
			<Route
				path={adminLinks.default}
				element={<Layout items={AdminItems()} children={<AdminHeader />} />}
			>
				<Route
					path={adminLinks.default}
					element={<Navigate to={adminLinks.calendar} />}
				/>
				<Route path={adminLinks.calendar} element={<Calendar />} />
				{/* <Route path={adminLinks.employees} element={<MasterPage />} /> */}
				<Route
					path={ADMIN_ROUTES.CALENDAR_NOTIFICATION.path}
					element={<NotificationsPage />}
				/>
				<Route path={ADMIN_ROUTES.SETTINGS.path} element={<SettingsPage />} />
				<Route
					path={ADMIN_ROUTES.MASTERS.path}
					element={
						<div style={{ padding: '15px' }}>
							<MasterPage />
						</div>
					}
				/>
				<Route path={ADMIN_ROUTES.MASTER.path} element={<MasterInnerPage />}>
					<Route
						path={ADMIN_ROUTES.MASTER_APPOINTMENT.path}
						element={<Appointments />}
					/>
					<Route
						path={ADMIN_ROUTES.MASTER_REWIEVS.path}
						element={<Rewievs />}
					/>
					<Route
						path={ADMIN_ROUTES.MASTER_SERVICE.path}
						element={<Service />}
					/>
					<Route
						path={ADMIN_ROUTES.MASTER_SPECIALIZATION.path}
						element={<Specialization />}
					/>
					<Route
						path={ADMIN_ROUTES.MASTER_ABOUT.path}
						element={<AboutMaster />}
					/>
				</Route>
				<Route path={ADMIN_ROUTES.USERS.path} element={<UserPage />} />
				<Route
					path={ADMIN_ROUTES.SERVICES.path}
					element={
						<LayoutContent>
							<PersonalService />
						</LayoutContent>
					}
				/>
				<Route path={adminLinks.settings} element={<SettingsPage />} />
				<Route path={adminLinks.reports} element={<ReportsPage />} />
				<Route path={adminLinks.appointments} element={<AppointmentsPage />} />
				<Route path={adminLinks.notification} element={<NotificationPage />} />
				<Route
					path={adminLinks.services}
					element={
						<div className='bg-white h-full p-[15px]'>
							<PersonalService />
						</div>
					}
				/>
			</Route>
		</Routes>
	)
}
