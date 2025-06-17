import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SlTabs from '../../../components/shared/sl-tab'
import { MarketingAllsPage } from './common'
import { useOwnerStore } from '../../../shared/states/owner.store'

const tabs = [
	{ id: 0, label: 'Все клиенты', value: 'all' },
	{ id: 1, label: 'Постоянные', value: 'regular' },
	{ id: 2, label: 'Разовые', value: 'one_time' },
	{ id: 3, label: 'Спящие', value: 'inactive' },
]

export const TypeSmsMarketing: any = {
	regular:
		'Здравствуйте! Мы скучаем по вам! Пора побаловать себя — приходите на любимую процедуру. Запишитесь прямо сейчас, а мы вас порадуем приятным бонусом!',
	'one-time':
		'Здравствуйте! Вы были у нас впервые — надеемся, вам понравилось! Приглашаем повторить приятные впечатления. Запишитесь прямо сейчас и получите бонус при визите!',
	inactive:
		'Здравствуйте! Напоминаем, что вы являетесь клиентом салона [Название]. Если вы давно не посещали нас — сейчас отличное время обновить образ. Мы работаем для вашего комфорта. Будем рады видеть вас вновь.',
}

export const MarketingPage = () => {
	const branchId = useOwnerStore((state: any) => state.branchId)
	const [pagination, setPagination] = useState({
		page: 1,
		size: 10,
	})
	const [searchParams, setSearchParams] = useSearchParams()
	const [activeTab, setActiveTab] = useState(
		tabs.findIndex((item) => item.value === searchParams.get('tab')) >= 0
			? tabs.findIndex((item) => item.value === searchParams.get('tab'))
			: 0
	)

	const handleTabChange = (id: string | number) => {
		setActiveTab(typeof id === 'string' ? parseInt(id) : id)
	}

	return (
		<div className="w-full h-[calc(100vh-60px)] px-[15px] py-[10px] flex flex-col gap-[25px]">
			<div
				style={{
					borderBottom: '1.5px solid #D8DADC',
				}}
				className="w-full h-[50px] flex items-center justify-between"
			>
				<div className="flex items-center justify-between gap-[20px]">
					<p className="text-[#101010] text-[20px]">Маркетинг</p>
					<div className="max-w-[500px] min-w-[500px]">
						<SlTabs
							tabs={tabs}
							searchParams={searchParams}
							setSearchParams={setSearchParams}
							active={activeTab}
							onChange={handleTabChange}
						/>
					</div>
				</div>
			</div>
			<MarketingAllsPage
				tabs={tabs}
				pagination={pagination}
				setPagination={setPagination}
				branchId={branchId}
				status={tabs[activeTab].value === 'all' ? '' : tabs[activeTab].value}
			/>
		</div>
	)
}
