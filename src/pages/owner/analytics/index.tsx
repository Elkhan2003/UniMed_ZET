import { Dropdown } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import dayjs from 'dayjs'
import { RangePicker } from '../../../components/shared/range-picker'
import { RxReload } from 'react-icons/rx'
import { ReactComponent as CalendarIcon } from '../../../assets/icons/CalendarMini.svg'
import ReusableTabs from '../../../components/shared/sl-tab'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { ROLES } from '../../../shared/lib/constants/constants'
import SlTabsInline from '../../../components/shared/sl-tab-inline'
import { GeneralAnalytics } from './alls'
import { Clients } from './clients'
import { Stuffs } from './stuffs'
import { ServiceStatistic } from './services'
import { useGetAnalyticsQuery } from '../../../store/queries/company.service'

const tabs = [
	{ id: 0, label: 'день', value: 'day' },
	{ id: 1, label: 'неделя', value: 'week' },
	{ id: 2, label: 'месяц', value: 'month' },
	{ id: 3, label: 'год', value: 'year' },
]

const tabsInline = [
	{ id: 0, label: 'Общее', value: 'general' },
	{ id: 1, label: 'Клиенты', value: 'clients' },
	{ id: 2, label: 'Услуги', value: 'services' },
	{ id: 3, label: 'Сотрудники', value: 'employees' },
]

export const AnalyticsPage = () => {
	const [searchparam, setSearchParams] = useSearchParams()

	const { role } = useSelector((state: RootState) => state.auth)
	const { individualData } = useSelector((state: RootState) => state.individual)
	const { branchAdminMasterJwt } = useSelector(
		(state: RootState) => state.branch
	)
	const branchId =
		role === ROLES.OWNER
			? Number(searchparam.get('branchId'))
			: role === ROLES.PERSONAl_MASTER
				? individualData?.branchId
				: branchAdminMasterJwt?.branchId

	const [activeTab, setActiveTab] = useState(0)
	const [activeTabInline, setActiveTabInline] = useState(0)
	const [startDate, setStartDate] = useState<string | dayjs.Dayjs>(
		dayjs().subtract(1, 'year')
	)
	const [endDate, setEndDate] = useState<string | dayjs.Dayjs>(dayjs())

	const { data, isLoading } = useGetAnalyticsQuery(
		{
			branchId,
			dateType: tabs[activeTab].value.toUpperCase(),
			startDate: dayjs(startDate).format('YYYY-MM-DD'),
			endDate: dayjs(endDate).format('YYYY-MM-DD'),
		},
		{ skip: !startDate || !endDate || !tabs[activeTab].value }
	)

	const [spinning, setSpinning] = useState(false)
	const [openCalendar, setOpenCalendar] = useState(false)

	const handleTabChange = (id: string | number) => {
		setActiveTab(typeof id === 'string' ? parseInt(id) : id)
	}

	const handleTabInlineChange = (id: number | string) => {
		setActiveTabInline(Number(id))
	}

	return (
		<div className="w-full h-[calc(100vh-60px)] px-[15px] py-[10px] flex flex-col gap-[10px]">
			<div
				style={{
					borderBottom: '1.5px solid #D8DADC',
				}}
				className="w-full h-[50px] flex items-center justify-between"
			>
				<div className="flex items-center justify-between gap-[20px]">
					<p className="text-[#101010] text-[20px]">Аналитика</p>
					<div className="max-w-[350px] min-w-[350px]">
						<ReusableTabs
							tabs={tabs}
							searchParams={searchparam}
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
					<Dropdown
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
					</Dropdown>
				</div>
			</div>
			<div className="w-full">
				<SlTabsInline
					tabs={tabsInline.filter(
						(tab) =>
							tab.value !== 'employees' ||
							(role === ROLES.OWNER && tab.value === 'employees')
					)}
					searchParams={searchparam}
					setSearchParams={setSearchParams}
					active={activeTabInline}
					onChange={handleTabInlineChange}
				/>
			</div>
			<div className="w-full">
				{activeTabInline === 0 && (
					<GeneralAnalytics data={data} isLoading={isLoading} />
				)}
				{activeTabInline === 1 && <Clients data={data} isLoading={isLoading} />}
				{activeTabInline === 2 && (
					<ServiceStatistic data={data} isLoading={isLoading} />
				)}
				{activeTabInline === 3 && <Stuffs data={data} isLoading={isLoading} />}
			</div>
		</div>
	)
}
