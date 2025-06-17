import { useEffect, useState } from 'react'
import Widget from '../../../../components/UI/Widget'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { getCookie } from '../../../../shared/lib/helpers/helpers'
import { _KEY_AUTH, isLoadingSx } from '../../../../shared/lib/constants/constants'
import { useNavigate } from 'react-router-dom'
import { FirstBlock } from './firstBlock'
import { Backdrop, CircularProgress } from '@mui/material'
import { SecondBlock } from './secondBlock'
import TarrifService from '../../../../store/queries/tarrif.service'

declare global {
	interface Window {
		PayBox: any
	}
}

interface SunMenuProps {
	active: boolean
	handleClose: () => void
	tarif: any
	stuffCount: number
	isActive: boolean
}

export const SubMenu = ({
	active,
	handleClose,
	tarif,
	stuffCount,
	isActive,
}: SunMenuProps) => {
	const [fetchSubscriptions] =
		TarrifService.useLazyGetSubscriptionsCurrentQuery()
	const navigate = useNavigate()
	const cookieDataString = getCookie(_KEY_AUTH)
	const convertObj = cookieDataString ? JSON.parse(cookieDataString) : {}

	const { role } = useSelector((state: RootState) => state.auth)
	const { ownerData } = useSelector((state: RootState) => state.ownerCompany)
	const { individualData } = useSelector((state: RootState) => state.individual)

	const [step, setStep] = useState(0)
	const [checked1, setChecked1] = useState(false)
	const [checked2, setChecked2] = useState(false)

	const [isNavigation, setIsNavigating] = useState(false)

	useEffect(() => {
		setIsNavigating(false)
	}, [active])

	const isWidgetLogic = async () => {
		const widgetIframe = document.querySelector('iframe[src*="freedompay"]')
		if (widgetIframe === null || !widgetIframe) {
			setTimeout(async () => {
				await fetchSubscriptions(
					role === 'OWNER' ? ownerData?.id : individualData?.companyId
				)
				handleClose()
				setIsNavigating(false)
				navigate('/subscription?payment=current-tariff')
			}, 3000)
		}
	}

	useEffect(() => {
		let intervalId: NodeJS.Timeout | null = null

		if (isNavigation) {
			intervalId = setInterval(isWidgetLogic, 1500)
		}

		return () => {
			if (intervalId) clearInterval(intervalId)
		}
	}, [isNavigation])

	const next = () => {
		switch (step) {
			case 0:
				setStep(1)
				break
			case 1:
				if (checked1) {
					handleFreedomPayment()
				}
				break
			default:
				break
		}
	}

	const prev = () => {
		if (step === 0) {
			setStep(0)
			setChecked1(false)
			setChecked2(false)
			handleClose()
		}
		if (step === 1) setStep(0)
		if (step === 2) setStep(1)
		if (step === 3) setStep(2)
	}

	const forEmail =
		role === 'OWNER'
			? ownerData?.email || 'unicornsoftllc@gmail.com'
			: individualData?.email || 'unicornsoftllc@gmail.com'

	const handleFreedomPayment = () => {
		try {
			const data = {
				token: '2Okn4suYm3i1tocpChzYybOT028rVHF9',
				payment: {
					amount: tarif.price,
					language: 'ru',
					description: 'text',
					currency: 'KGS',
					param1: role === 'OWNER' ? ownerData?.id : individualData?.companyId,
					param2: isActive ? stuffCount : tarif?.id || '',
					param3: convertObj?.token || '',
					options: {
						callbacks: {
							result_url: isActive
								? 'https://subscription.unibook.ai/api/v2/subscriptions/payment-per-user'
								: 'https://subscription.unibook.ai/api/v2/subscriptions/payment-status',
						},
						user: {
							email: forEmail,
							phone:
								role === 'OWNER'
									? ownerData?.phoneNumber
									: individualData?.phoneNumber,
						},
					},
				},
				successCallback: async function (payment: any) {
					setIsNavigating(true)
					// handleClose()
				},
				errorCallback: async function (payment: any) {
					setIsNavigating(false)
					handleClose()
				},
			}
			const widget = new window.PayBox(data)
			widget.create()
		} catch (error) {
			setIsNavigating(false)
			handleClose()
			alert('Не удалось инициализировать платежную систему')
		}
	}

	return (
		<>
			<Backdrop sx={isLoadingSx} open={isNavigation}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<Widget
				active={active}
				handleClose={() => {
					setStep(0)
					setChecked1(false)
					setChecked2(false)
					handleClose()
				}}
				back={prev}
			>
				{step === 0 && (
					<FirstBlock
						checked1={checked1}
						setChecked1={setChecked1}
						next={next}
					/>
				)}
				{step === 1 && (
					<SecondBlock
						checked2={checked2}
						setChecked2={setChecked2}
						next={next}
					/>
				)}
			</Widget>
		</>
	)
}
