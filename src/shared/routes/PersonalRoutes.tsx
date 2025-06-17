import { Navigate, Route, Routes } from 'react-router-dom'
import { PERSONAL_ROUTES } from '../lib/constants/routes'
import PersonalOutlet from '../layout/outlet'
import PersonalSchedule from '../../pages/personal_master/Schedule'
import PersonalService from '../../pages/personal_master/Service'
import PersonalVisits from '../../pages/personal_master/Visits'
import PersonalClients from '../../pages/personal_master/Clients'
import { PersonalWorks } from '../../pages/personal_master/Works'
import { PersonalSocials } from '../../pages/personal_master/Socials'
import { SettingsPage } from '../../pages/admin/Settings/SettingsState'
import NotificationsPage from '../../pages/personal_master/Notifications'
import { LayoutContent } from '../../components/UI/LayoutContent'
import { Subscription } from '../../pages/personal_master/Subscription'
import { SubscriptionCheckWrapper } from '../hooks/wrapper-check'

import { personalLinks } from '../links'
import { Calendar } from '../../components/Calendar'
import { ReportsPage } from '../../pages/owner/reports'
import { AnalyticsPage } from '../../pages/owner/analytics'

export default function PersonalRoutes() {
	return (
		<Routes>
			<Route path={PERSONAL_ROUTES.DEFAULT.path} element={<PersonalOutlet />}>
				<Route
					path="/"
					element={
						<SubscriptionCheckWrapper>
							<Navigate to={PERSONAL_ROUTES.SERVICE.path} />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={PERSONAL_ROUTES.SERVICE.path}
					element={
						<SubscriptionCheckWrapper>
							<LayoutContent>
								<PersonalService />
							</LayoutContent>
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={PERSONAL_ROUTES.CALENDAR.path}
					element={
						<SubscriptionCheckWrapper>
							<Calendar />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={PERSONAL_ROUTES.SUBSCRIPTION.path}
					element={
						<SubscriptionCheckWrapper>
							<Subscription />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={PERSONAL_ROUTES.CALENDAR_NOTIFICATION.path}
					element={
						<SubscriptionCheckWrapper>
							<NotificationsPage />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={PERSONAL_ROUTES.SCHEDULE.path}
					element={
						<SubscriptionCheckWrapper>
							<PersonalSchedule />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={PERSONAL_ROUTES.VISITS.path}
					element={
						<SubscriptionCheckWrapper>
							<PersonalVisits />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={PERSONAL_ROUTES.CLIENTS.path}
					element={
						<SubscriptionCheckWrapper>
							<PersonalClients />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={PERSONAL_ROUTES.SOCIAL.path}
					element={
						<SubscriptionCheckWrapper>
							<PersonalSocials />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={PERSONAL_ROUTES.SETTINGS.path}
					element={
						<SubscriptionCheckWrapper>
							<SettingsPage />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={PERSONAL_ROUTES.WORKS.path}
					element={
						<SubscriptionCheckWrapper>
							<PersonalWorks />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={personalLinks.calendar}
					element={
						<SubscriptionCheckWrapper>
							<Calendar />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={personalLinks.reports}
					element={
						<SubscriptionCheckWrapper>
							<ReportsPage />
						</SubscriptionCheckWrapper>
					}
				/>
				<Route
					path={personalLinks.analytics}
					element={
						<SubscriptionCheckWrapper>
							<AnalyticsPage />
						</SubscriptionCheckWrapper>
					}
				/>
			</Route>
		</Routes>
	)
}
