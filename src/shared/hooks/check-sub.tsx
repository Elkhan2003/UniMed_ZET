import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { ROLES } from '../lib/constants/constants'

/**
 * Custom hook to check subscription status using existing Redux state
 * @returns An object with isExpired flag
 */

export const useSubscriptionStatus = () => {
	const [isExpired, setIsExpired] = useState(false)
	const { role } = useSelector((state: RootState) => state.auth)
	const { tarriff } = useSelector((state: RootState) => state.ownerCompany)

	const shouldCheckSubscription =
		role === 'OWNER' || role === ROLES.PERSONAl_MASTER

	useEffect(() => {
		if (shouldCheckSubscription && tarriff) {
			setIsExpired(tarriff.status === 'EXPIRED')
		} else {
			setIsExpired(false)
		}
	}, [tarriff, shouldCheckSubscription])

	return {
		isExpired,
		subscriptionData: tarriff,
	}
}
