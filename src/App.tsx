import { UserRoutes } from './shared/routes/LoginRoutes'
import MasterRoutes from './shared/routes/MasterRoutes'
import AdminRoutes from './shared/routes/AdminRoutes'
import OwnerRoutes from './shared/routes/OwnerRoutes'
import SuperAdminRoutes from './shared/routes/SuperAdminRoutes'
import PersonalRoutes from './shared/routes/PersonalRoutes'
import { getCookie } from './shared/lib/helpers/helpers'
import { _KEY_AUTH } from './shared/lib/constants/constants'
import { ROLES } from './shared/lib/constants/constants'

export default function App() {
	const cookieDataString = getCookie(_KEY_AUTH)
	const convertObj = cookieDataString ? JSON.parse(cookieDataString) : {}

	let Component
	if (convertObj?.isAuthenticated) {
		switch (convertObj?.role) {
			case ROLES.SUPER_ADMIN:
				Component = SuperAdminRoutes
				break
			case ROLES.OWNER:
				Component = OwnerRoutes
				break
			case ROLES.ADMIN:
				Component = AdminRoutes
				break
			case ROLES.MASTER:
				Component = MasterRoutes
				break
			case ROLES.PERSONAl_MASTER:
				Component = PersonalRoutes
				break
			default:
				Component = UserRoutes
		}
	} else {
		Component = UserRoutes
	}

	return <Component />
}
