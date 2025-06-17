import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ReusableTabs from '../../../components/shared/sl-tab'
import { CommonReports } from './common'
import { RangePicker } from '../../../components/shared/range-picker'
import { Dropdown } from 'antd'
import { ReactComponent as CalendarIcon } from '../../../assets/icons/CalendarMini.svg'
import { ReactComponent as DownloadIcon } from '../../../assets/icons/Download.svg'
import { RxReload } from 'react-icons/rx'
import { PaymentsReports } from './payments'
import { EmployeesReports } from './employees'
import { toast } from 'react-hot-toast'
import { RootState } from '../../../store'
import { useSelector } from 'react-redux'
import { ROLES } from '../../../shared/lib/constants/constants'

import config from '../../../config.json'
import dayjs from 'dayjs'
import { useOwnerStore } from '../../../shared/states/owner.store'

dayjs.locale('ru')

const tabsforadminowner = [
	{ id: 0, label: 'Общий отчёт', value: 'invoice' },
	{
		id: 1,
		label: 'Сотрудники',
		value: 'staff',
	},
	{ id: 2, label: 'История платежей', value: 'payments' },
]

const tabsforindividual = [
	{ id: 0, label: 'Общий отчёт', value: 'invoice' },
	{ id: 1, label: 'История платежей', value: 'payments' },
]

export const ReportsPage = () => {
	const ownerBranchId = useOwnerStore((state: any) => state.branchId)
	const [searchParams, setSearchParams] = useSearchParams()
	const { role, token } = useSelector((state: RootState) => state.auth)

	const tabs =
		role === ROLES.PERSONAl_MASTER ? tabsforindividual : tabsforadminowner

	const { branchAdminMasterJwt } = useSelector(
		(state: RootState) => state.branch
	)
	const { individualData } = useSelector((state: RootState) => state.individual)
	const branchId =
		role === ROLES.PERSONAl_MASTER
			? individualData?.branchId
			: role === ROLES.OWNER
				? ownerBranchId
				: branchAdminMasterJwt?.branchId

	const [activeTab, setActiveTab] = useState(
		tabs.findIndex((item) => item.value === searchParams.get('tab')) >= 0
			? tabs.findIndex((item) => item.value === searchParams.get('tab'))
			: 0
	)

	const [spinning, setSpinning] = useState(false)

	const [startDate, setStartDate] = useState<string | dayjs.Dayjs>(
		dayjs().subtract(1, 'year')
	)
	const [endDate, setEndDate] = useState<string | dayjs.Dayjs>(dayjs())
	const [openCalendar, setOpenCalendar] = useState(false)
	const handleTabChange = (id: string | number) => {
		setActiveTab(typeof id === 'string' ? parseInt(id) : id)
	}

	useEffect(() => {
		if (spinning) {
			setTimeout(() => {
				setSpinning(false)
			}, 2000)
		}
	}, [spinning])

	const handleDownloadPdf = async () => {
		try {
			const params = {
				branchId: branchId,
				startDate: dayjs(startDate).format('YYYY-MM-DD'),
				endDate: dayjs(endDate).format('YYYY-MM-DD'),
				api: tabs[activeTab].value,
			}

			const res = await fetch(
				`${config.API_URL}pdf/report/${tabs[activeTab].value}?${new URLSearchParams(params).toString()}`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			const response = await res.blob()

			const blob =
				response instanceof Blob
					? response
					: new Blob([response], { type: 'application/pdf' })

			const url = window.URL.createObjectURL(blob)

			const fileName = `${tabs[activeTab].label}-от-${dayjs(startDate).format('DD-MM-YYYY')}-до-${dayjs(endDate).format('DD-MM-YYYY')}-скачан-${dayjs().format('DD-MM-YYYY')}.pdf`
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', fileName)
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)

			setTimeout(() => {
				window.URL.revokeObjectURL(url)
			}, 100)

			toast.success('Отчёт скачан')
		} catch (error) {
			toast.error('Ошибка при загрузке PDF')
			console.error('PDF download error:', error)
		}
	}

	// Helper function to get current tab value
	const getCurrentTabValue = () => {
		return tabs[activeTab]?.value
	}

	return (
		<div className="w-full h-[calc(100vh-60px)] px-[15px] py-[10px]">
			<div
				style={{
					borderBottom: '1.5px solid #D8DADC',
				}}
				className="w-full h-[50px] flex items-center justify-between"
			>
				<div className="flex items-center justify-between gap-[20px]">
					<p className="text-[#101010] text-[20px]">Отчеты</p>
					<div className="max-w-[400px] min-w-[400px]">
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
					<div
						onClick={handleDownloadPdf}
						className="flex items-center justify-center rounded-full w-[38px] h-[38px] cursor-pointer bg-[#D8DADC]"
					>
						<DownloadIcon />
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
			<div className="py-6">
				{getCurrentTabValue() === 'invoice' && (
					<CommonReports
						branchId={branchId}
						startDate={dayjs(startDate).format('YYYY-MM-DD')}
						endDate={dayjs(endDate).format('YYYY-MM-DD')}
					/>
				)}
				{getCurrentTabValue() === 'staff' && (
					<EmployeesReports
						branchId={branchId}
						startDate={dayjs(startDate).format('YYYY-MM-DD')}
						endDate={dayjs(endDate).format('YYYY-MM-DD')}
					/>
				)}
				{getCurrentTabValue() === 'payments' && (
					<PaymentsReports
						branchId={branchId}
						startDate={dayjs(startDate).format('YYYY-MM-DD')}
						endDate={dayjs(endDate).format('YYYY-MM-DD')}
					/>
				)}
			</div>
		</div>
	)
}
