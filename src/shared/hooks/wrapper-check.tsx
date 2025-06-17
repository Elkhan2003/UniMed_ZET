import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSubscriptionStatus } from './check-sub'
import { SubscriptionExpiredPage } from '../../pages/expired'

const EXEMPT_ROUTES = ['/subscription', 'profile']

export const SubscriptionCheckWrapper = ({ children }: any) => {
	const { isExpired } = useSubscriptionStatus()
	const location = useLocation()

	const isExemptRoute = EXEMPT_ROUTES.some(
		(route) =>
			location.pathname === route || location.pathname.startsWith(route + '/')
	)

	if (isExpired && !isExemptRoute) {
		return <SubscriptionExpiredPage />
	}

	return children
}
