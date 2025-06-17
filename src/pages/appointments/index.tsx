import { useState } from 'react'

import { Dropdown } from 'antd'
import ReusableTabs from '../../components/shared/sl-tab'
import { RangePicker } from '../../components/shared/range-picker'
import { ReactComponent as CalendarIcon } from '../../assets/icons/CalendarMini.svg'
import { useSearchParams } from 'react-router-dom'
import { RxReload } from 'react-icons/rx'

const tabs = [
	{ id: 0, label: 'День', value: 'day' },
	{ id: 1, label: 'Неделя', value: 'week' },
	{ id: 2, label: 'Месяц', value: 'month' },
]

export const AppointmentsPage = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [activeTab, setActiveTab] = useState(
		tabs.findIndex((item) => item.value === searchParams.get('tab')) >= 0
			? tabs.findIndex((item) => item.value === searchParams.get('tab'))
			: 0
	)

	const [spinning, setSpinning] = useState(false)

	const handleTabChange = (id: string | number) => {
		setActiveTab(typeof id === 'string' ? parseInt(id) : id)
	}

	return (
		<div className="w-full h-[calc(100vh-60px)] px-[10px]">
			<div
				style={{
					borderBottom: '1.5px solid #D8DADC',
				}}
				className="w-full h-[50px] flex items-center justify-between"
			>
				<div className="flex items-center justify-between gap-[20px]">
					<p className="text-[#101010] text-[20px]">Записи</p>
					<div className="max-w-[300px] min-w-[300px]">
						<ReusableTabs
							tabs={tabs}
							searchParams={searchParams}
							setSearchParams={setSearchParams}
							active={activeTab}
							onChange={handleTabChange}
						/>
					</div>
				</div>
				<div className="flex items-center gap-4">
					<div
						className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-[#D8DADC] cursor-pointer"
						onClick={() => setSpinning(!spinning)}
					>
						<RxReload
							color="#101010"
							width={18}
							height={18}
							className={`${spinning ? 'animate-spin' : ''} transition-all duration-300`}
						/>
					</div>
					{/* <Dropdown
						overlay={
							<RangePicker
								startDate={startDate}
								endDate={endDate}
								setStartDate={(date) => setStartDate(date)}
								setEndDate={(date) => setEndDate(date)}
								setOpenCalendar={setOpenCalendar}
							/>
						}
						trigger={['click']}
						open={openCalendar}
						onOpenChange={setOpenCalendar}
					>
						<div className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-[#D8DADC] cursor-pointer">
							<CalendarIcon />
						</div>
					</Dropdown> */}
				</div>
			</div>
		</div>
	)
}
