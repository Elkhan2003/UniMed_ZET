import { useState, useEffect } from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import { useSearchParams } from 'react-router-dom'
import HistorySubscription from './HistorySubscription'
import CurrentTarif from './CurrentTarif'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

export const Subscription = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const param = searchParams.get('payment')
	const [activePage, setActivePage] = useState<number>(
		param === 'history-tariff' ? 1 : 0
	)

	const { role } = useSelector((state: RootState) => state.auth)
	const { ownerData } = useSelector((state: RootState) => state.ownerCompany)
	const { individualData } = useSelector((state: RootState) => state.individual)

	const masterData =
		role === 'OWNER' ? ownerData?.id : individualData?.companyId

	const components = [
		{
			name: 'Текущий тариф',
			component: <CurrentTarif />,
		},
		{
			name: 'История оплаты',
			component: <HistorySubscription masterData={masterData} />,
		},
	]

	useEffect(() => {
		if (!param) {
			searchParams.set('payment', 'current-tariff')
			setSearchParams(searchParams)
		}
	}, [])

	const handleSelectParams = (i: number) => {
		setActivePage(i)
		const param = i === 0 ? 'current-tariff' : 'history-tariff'
		searchParams.set('payment', param)
		setSearchParams(searchParams)
	}

	return (
		<>
			<div className="w-full min-h-[calc(100vh-60px)] flex  bg-white">
				<div
					style={{ borderRight: '1px solid gainsboro' }}
					className="w-[200px] max-w-[200px] min-w-[200px] min-h-100vh flex flex-col bg-white px-2"
				>
					<div className="w-full h-[80px] flex items-center gap-2">
						<p className="text-lg font-[500]   ml-[20px]">Подписка</p>
					</div>
					<div className="flex flex-col gap-2">
						{components.map((item, i) => (
							<div
								key={i}
								onClick={() => handleSelectParams(i)}
								className={`w-full flex items-center justify-between ${
									i === activePage ? 'bg-gray-100' : 'hover:bg-gray-50'
								} rounded-lg cursor-pointer p-2`}
							>
								<p className="text-sm">{item.name}</p>
								<IoIosArrowForward size={20} className="text-[#4E4E4E80]" />
							</div>
						))}
					</div>
				</div>
				<div className="w-full min-h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-y-auto">
					{components[activePage].component}
				</div>
			</div>
		</>
	)
}
