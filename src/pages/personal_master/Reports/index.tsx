import { Flex } from 'antd'
import { StyledTabs } from '../../../components/UI/StyledTabs'
import {
	Outlet,
	useLocation,
	useNavigate,
	useSearchParams,
} from 'react-router-dom'
import { useEffect } from 'react'

export const PersonalReportPage = () => {
	const [searchparam, setSearchParams] = useSearchParams()
	const { pathname } = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		if (
			!pathname.includes('/all') &&
			!pathname.includes('/all') &&
			!pathname.includes('/clients') &&
			!pathname.includes('/services') &&
			!pathname.includes('/stuffs')
		) {
			navigate('day')
		}
	}, [])

	const TabsValue = [
		{
            value: 'Отчет за день',
            to: 'day',
        },
		{
			value: 'Общее',
			to: 'alls',
		},
		{
			value: 'Клиенты',
			to: 'clients',
		},
		{
			value: 'Услуги',
			to: 'services',
		},
	]

	const add = `?date-type=${searchparam.get('date-type') || 'WEEK'}`

	return (
		<Flex
			vertical
			gap={10}
			className="w-full h-full min-h-[calc(100vh-45px)] px-4 bg-white"
		>
			<StyledTabs
				defaultActiveKey={pathname.split('/')[2]}
				onChange={(key) => navigate(`${key}${add}`)}
			>
				{TabsValue.map((tab) => (
					<StyledTabs.TabPane tab={tab.value} key={tab.to} />
				))}
			</StyledTabs>
			<Outlet />
		</Flex>
	)
}
