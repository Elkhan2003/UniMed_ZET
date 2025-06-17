import { Route, Routes } from 'react-router'
import { USER_ROUTES } from '../lib/constants/routes'  
import { NotFoundPage } from '../../pages/error/error-404/NotFoundPage'
import LoginPage from '../../components/LoginPage'

export const UserRoutes = () => {
	return (
		<Routes>
			<Route path={USER_ROUTES.DEFAULT.path} element={<LoginPage />} />
			<Route
				path={USER_ROUTES.NOT_FOUND_PAGE.path}
				element={<NotFoundPage />}
			/>
		</Routes>
	)
}
