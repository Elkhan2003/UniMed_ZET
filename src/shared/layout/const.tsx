import { _KEY_AUTH } from '../lib/constants/constants'
import { COOKIE } from '../lib/constants/constants'
import { deleteCookie } from '../lib/helpers/helpers'
import {
	CalendarOutlined,
	ScissorOutlined,
	ClockCircleOutlined,
	UserOutlined,
	BookOutlined,
	FileDoneOutlined,
	CameraOutlined,
	InstagramOutlined,
	SettingOutlined,
	WalletOutlined,
	BarChartOutlined,
} from '@ant-design/icons'
import { ROLES } from '../lib/constants/constants'
import { ADMIN_ROUTES, PERSONAL_ROUTES } from '../lib/constants/routes'

import { ReactComponent as Branches } from '../../assets/icons/layout/branches.svg'
import { ReactComponent as Marketing } from '../../assets/icons/layout/marketing.svg'
import { ReactComponent as Reports } from '../../assets/icons/layout/reports.svg'
import { ReactComponent as Analytics } from '../../assets/icons/layout/analytics.svg'
import { ReactComponent as Subscription } from '../../assets/icons/layout/subscription.svg'
import { ReactComponent as Setting } from '../../assets/icons/layout/setting.svg'
import { ReactComponent as Employees } from '../../assets/icons/layout/employees.svg'
import { ReactComponent as Calendar } from '../../assets/icons/layout/calendar.svg'
import { ReactComponent as Services } from '../../assets/icons/layout/services.svg'
import { ReactComponent as Clients } from '../../assets/icons/layout/clients.svg'
import { ReactComponent as Appointments } from '../../assets/icons/layout/appointments.svg'
import { ReactComponent as Warehouse } from '../../assets/icons/layout/stock.svg'

import { adminLinks, ownerLinks, personalLinks } from '../links'
import { useEffect } from 'react'
import { useState } from 'react'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

export const logout = async (dispatch?: any, navigate?: any, setOpen?: any) => {
	try {
		await deleteCookie(_KEY_AUTH, `.${COOKIE}`)
		window.location.href = '/'
	} catch (error) {
		console.error('Ошибка при выходе', error)
	}
}

const PersonalItems = [
	{
		name: 'Календарь',
		link: PERSONAL_ROUTES.CALENDAR.path,
		icon: <CalendarOutlined />,
	},
	{
		name: 'Услуги',
		link: PERSONAL_ROUTES.SERVICE.path,
		icon: <ScissorOutlined />,
	},
	{
		name: 'График работы',
		link: PERSONAL_ROUTES.SCHEDULE.path,
		icon: <ClockCircleOutlined />,
	},
	{
		name: 'Клиенты',
		link: PERSONAL_ROUTES.CLIENTS.path,
		icon: <UserOutlined />,
	},
	{
		name: 'Визиты',
		link: PERSONAL_ROUTES.VISITS.path,
		icon: <FileDoneOutlined />,
	},
	{
		name: 'Мои работы, Баннер',
		link: PERSONAL_ROUTES.WORKS.path,
		icon: <CameraOutlined />,
	},
	{
		name: 'Соц сети',
		link: PERSONAL_ROUTES.SOCIAL.path,
		icon: <InstagramOutlined />,
	},
	{
		name: 'Отчеты',
		link: `${PERSONAL_ROUTES.REPORTS.path}`,
		icon: <BookOutlined />,
	},
	{
		name: 'Аналитика',
		link: personalLinks.analytics,
		icon: <BarChartOutlined />,
	},
	{
		name: 'Подписка',
		link: PERSONAL_ROUTES.SUBSCRIPTION.path,
		icon: <WalletOutlined />,
	},
	{
		name: 'Настройки',
		link: PERSONAL_ROUTES.SETTINGS.path,
		icon: <SettingOutlined />,
	},
]

// export const AdminItems = () => {

// 	const { branchAdminMasterJwt } = useSelector(
// 		(state: RootState) => state.branch
// 	)

// 	return [
// 		{
// 			name: 'Календарь',
// 			link: '/',
// 			icon: <Calendar />,
// 		},
// 		{
// 			name: 'Специалисты',
// 			link: `/${branchAdminMasterJwt?.branchId}/masters`,
// 			icon: <Employees />,
// 		},
// 		{
// 			name: 'Услуги',
// 			link: `/${branchAdminMasterJwt?.branchId}/services`,
// 			icon: <Services />,
// 		},
// 		{ name: 'Клиенты', link: '/users', icon: <Clients /> },
// 		{ name: 'Отчеты', link: '/reports', icon: <Reports /> },
// 		{
// 			name: 'Настройки',
// 			link: '/settings',
// 			icon: <Setting />,
// 		},
// 	]
// }

export const AdminItems = () => {
	const { branchAdminMasterJwt } = useSelector(
		(state: RootState) => state.branch
	)
	return [
		{ name: 'Календарь', link: adminLinks.calendar, icon: <Calendar /> },
		// { name: 'Записи', link: adminLinks.appointments, icon: <Appointments /> },
		{
			name: 'Специалисты',
			link: `${branchAdminMasterJwt?.branchId}/masters`,
			icon: <Employees />,
		},
		{ name: 'Услуги', link: adminLinks.services, icon: <Services /> },
		{ name: 'Клиенты', link: ADMIN_ROUTES.USERS.path, icon: <Clients /> },
		{ name: 'Отчеты', link: adminLinks.reports, icon: <Reports /> },
		{ name: 'Настройки', link: adminLinks.settings, icon: <Setting /> },
	]
}

export const getLayout = (role: string) => {
	let layout: {
		name: string
		link: string
		icon: React.JSX.Element
	}[] = []
	switch (role) {
		case ROLES.SUPER_ADMIN:
			layout = PersonalItems
			break
		// case ROLES.ADMIN:
		// 	layout = AdminItems()
		// 	break
		case ROLES.MASTER:
			layout = PersonalItems
			break
		case ROLES.PERSONAl_MASTER:
			layout = PersonalItems
			break
		default:
			layout = []
	}
	return layout
}

export const OwnerItems = [
	{ name: 'Главная', link: ownerLinks.analytics, icon: <Analytics /> },
	{
		name: 'Филиалы',
		link: ownerLinks.affiliate,
		icon: <Branches />,
	},
	// {
	// 	name: 'Записи',
	// 	link: ownerLinks.appointments,
	// 	icon: <Appointments />,
	// },
	// {
	// 	name: 'Сотрудники',
	// 	link: ownerLinks.employees,
	// 	icon: <Employees />,
	// },
	// {
	// 	name: 'Услуги',
	// 	link: ownerLinks.services,
	// 	icon: <Services />,
	// },
	{ name: 'Маркетинг', link: ownerLinks.marketing, icon: <Marketing /> },
	{ name: 'Отчеты', link: ownerLinks.reports, icon: <Reports /> },
	{
		name: 'Подписка',
		link: ownerLinks.subscription,
		icon: <Subscription />,
	},
	// {
	// 	name: 'Склад',
	// 	link: ownerLinks.stock,
	// 	icon: <Warehouse />,
	// },
	{
		name: 'Настройки',
		link: ownerLinks.settings,
		icon: <Setting />,
	},
]

export const TimeRemaining = ({ endDate }: { endDate: string }) => {
	const [timeLeft, setTimeLeft] = useState('')

	useEffect(() => {
		const updateTimer = () => {
			const end = dayjs(endDate)
			const now = dayjs()
			const diff = end.diff(now)

			if (diff <= 0) {
				setTimeLeft('Тариф истек')
				return
			}

			const dur = dayjs.duration(diff)

			const years = Math.floor(dur.asYears())
			const months = Math.floor(dur.asMonths() % 12)
			const days = dur.days()
			const hours = dur.hours()
			const minutes = dur.minutes()
			const seconds = dur.seconds()

			let result = ''

			function getPluralForm(
				number: number,
				one: string,
				few: string,
				many: string
			) {
				if (number % 10 === 1 && number % 100 !== 11) {
					return one
				} else if (
					number % 10 >= 2 &&
					number % 10 <= 4 &&
					(number % 100 < 10 || number % 100 >= 20)
				) {
					return few
				} else {
					return many
				}
			}

			if (years > 0) {
				const yearsText = getPluralForm(years, 'год', 'года', 'лет')
				const monthsText = getPluralForm(months, 'месяц', 'месяца', 'месяцев')
				result = `Осталось ${years} ${yearsText} ${months} ${monthsText}`
			} else if (months > 0) {
				const monthsText = getPluralForm(months, 'месяц', 'месяца', 'месяцев')
				const daysText = getPluralForm(days, 'день', 'дня', 'дней')
				result = `Осталось ${months} ${monthsText} ${days} ${daysText}`
			} else if (days > 0) {
				const daysText = getPluralForm(days, 'день', 'дня', 'дней')
				result = `Осталось ${days} ${daysText}`
			} else if (hours > 0) {
				const hoursText = getPluralForm(hours, 'час', 'часа', 'часов')
				result = `Осталось ${hours} ${hoursText}`
			} else if (minutes > 0) {
				const minutesText = getPluralForm(minutes, 'минута', 'минуты', 'минут')
				result = `Осталось ${minutes} ${minutesText}`
			} else {
				const secondsText = getPluralForm(
					seconds,
					'секунда',
					'секунды',
					'секунд'
				)
				result = `Осталось ${seconds} ${secondsText}`
			}

			setTimeLeft(result)
		}

		updateTimer()
		const timer = setInterval(updateTimer, 1000)

		return () => clearInterval(timer)
	}, [endDate])

	return timeLeft
}
