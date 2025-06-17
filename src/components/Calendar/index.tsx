import { useEffect, useState } from 'react'
import { CalendarDatePicker } from './date-picker'
import ReusableTabs from '../shared/sl-tab'
import dayjs from 'dayjs'
import { StuffSelector } from './stuff-selector'
import {
	useGetCalendarMasterScheduleQuery,
	useGetCalendarQuery,
} from '../../store/services/calendar.service'
import Loading from '../../pages/loading'
import { CalendarDay } from './day/index'
import { CalendarMonth } from './month'
import { CalendarWeek } from './week'
import { useGetSchedulesEntitiesWeeklyQuery } from '../../store/queries/schedule.service'
import { ROLES } from '../../shared/lib/constants/constants'
import { RootState } from '../../store'
import { useSelector } from 'react-redux'
import { generateTimeSlots } from './conts'
import { AddUser } from '../../assets/icons/addUser'
import { Button } from '../UI/Buttons/Button/Button'
import { RxReload } from 'react-icons/rx'
import { useSearchParams } from 'react-router-dom'
import { UsersCreate } from './modals/users-create'
import { CreateModal } from './modals/create'

const tabs = [
	{ id: 0, label: 'День', value: 'day' },
	{ id: 1, label: 'Неделя', value: 'week' },
	{ id: 2, label: 'Месяц', value: 'month' },
]

export const Calendar = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [activeTab, setActiveTab] = useState(
		tabs.findIndex((item) => item.value === searchParams.get('tab')) >= 0
			? tabs.findIndex((item) => item.value === searchParams.get('tab'))
			: 0
	)
	const [currentDate, setCurrentDate] = useState(dayjs())
	const [filteredData, setFilteredData] = useState<any[]>([])
	const [timeSlots, setTimeSlots] = useState<any[]>([])
	const [choosedMaster, setChoosedMaster] = useState<any>(null)
	const [spinning, setSpinning] = useState(false)
	const [active, setActive] = useState(false)
	const [createModal, setCreateModal] = useState(false)
	const { role } = useSelector((state: any) => state.auth)
	const { individualData } = useSelector((state: RootState) => state.individual)
	const { branchAdminMasterJwt } = useSelector(
		(state: RootState) => state.branch
	)

	const branchId =
		role === ROLES.PERSONAl_MASTER
			? individualData?.masterId
			: branchAdminMasterJwt?.branchId

	const {
		data: dataCalendar = [],
		isLoading: isLoadingCalendar,
		refetch: refetchCalendar,
	} = useGetCalendarQuery(
		{
			startTime: currentDate.format('YYYY-MM-DD'),
			endTime: currentDate.add(1, 'day').format('YYYY-MM-DD'),
			masterID: [],
		},
		{ skip: !currentDate.format('YYYY-MM-DD') || activeTab !== 0 }
	)

	const {
		data: dataCalendarMonth = [],
		isLoading: isLoadingCalendarMonth,
		refetch: refetchCalendarMonth,
	} = useGetCalendarQuery(
		{
			startTime: currentDate.startOf('month').format('YYYY-MM-DD'),
			endTime: currentDate.endOf('month').format('YYYY-MM-DD'),
			masterID: [],
		},
		{ skip: !currentDate.format('YYYY-MM-DD') || activeTab !== 2 }
	)

	const {
		data: dataCalendarWeek = [],
		isLoading: isLoadingCalendarWeek,
		refetch: refetchCalendarWeek,
	} = useGetCalendarQuery(
		{
			startTime: currentDate.startOf('week').format('YYYY-MM-DD'),
			endTime: currentDate.endOf('week').format('YYYY-MM-DD'),
			masterID: [],
		},
		{ skip: !currentDate.format('YYYY-MM-DD') || activeTab !== 1 }
	)

	const {
		data: dataScheduleMaster,
		refetch: refetchMasterSchedule,
		isLoading: isLoadingScheduleMaster,
	} = useGetCalendarMasterScheduleQuery(
		{ day: currentDate.format('YYYY-MM-DD'), page: 1, size: 50 },
		{ skip: !currentDate && activeTab === 0 }
	)

	const {
		data: branchSchedule,
		isLoading: branchScheduleWeeklyLoading,
		refetch: refetchBranchSchedule,
	} = useGetSchedulesEntitiesWeeklyQuery(
		{
			entityId: branchId,
			startWeek: currentDate.format('YYYY-MM-DD'),
			entity: role === ROLES.PERSONAl_MASTER ? 'MASTER' : 'BRANCH',
		},
		{
			skip: !currentDate.format('YYYY-MM-DD') || !branchId,
		}
	)

	const { data: masterSchedule } = useGetSchedulesEntitiesWeeklyQuery(
		{
			entityId: choosedMaster?.masterId,
			startWeek: currentDate.format('YYYY-MM-DD'),
			entity: 'MASTER',
		},
		{
			skip: !choosedMaster,
		}
	)

	useEffect(() => {
		refetchMasterSchedule()
	}, [currentDate, activeTab])

	useEffect(() => {
		if (branchSchedule && activeTab === 0) {
			const currentDay = branchSchedule.dayScheduleResponses.find(
				(item: any) => item.day === currentDate.format('YYYY-MM-DD')
			)
			const timeSlots = generateTimeSlots(
				currentDay.startTime,
				currentDay.endTime,
				60
			)
			setTimeSlots(timeSlots)
		}
	}, [branchSchedule, activeTab])

	const handleTabChange = (id: string | number) => {
		setActiveTab(typeof id === 'string' ? parseInt(id) : id)
	}

	const handleReload = () => {
		setSpinning(true)
		switch (activeTab) {
			case 0:
				refetchCalendar()
				break
			case 1:
				refetchCalendarWeek()
				break
			case 2:
				refetchCalendarMonth()
				break
		}
		refetchBranchSchedule()

		setTimeout(() => {
			setSpinning(false)
		}, 2000)
	}

	return (
		<div className="w-full h-[calc(100vh-60px)] px-[15px] pb-[15px] flex flex-col gap-[20px]">
			<UsersCreate
				active={active}
				setActive={setActive}
				onSuccess={() => {
					handleReload()
				}}
			/>
			<CreateModal
				active={createModal}
				setCreateUser={setActive}
				handleClose={() => setCreateModal(false)}
				data={{
					startTime: currentDate.format('HH:mm'),
					endTime: currentDate.add(1, 'hour').format('HH:mm'),
					startDate: currentDate.format('YYYY-MM-DD'),
					master: {
						masterId: { name: '', masterId: '' },
						startTime: '',
						endTime: '',
						freeTimes: Array.from({ length: 11 }, (_, i) => {
							const start = dayjs()
								.hour(8 + i)
								.minute(0)
							return {
								startTime: start.format('HH:mm'),
								endTime: start.add(1, 'hour').format('HH:mm'),
							}
						}),
						breaks: [],
					},
				}}
			/>
			<div
				style={{
					borderBottom: '1.5px solid #D8DADC',
				}}
				className="w-full h-[50px] flex items-center justify-between"
			>
				<div className="flex items-center justify-between gap-[20px]">
					<p className="text-[#101010] text-[20px]">Календарь</p>
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
				<div className="flex items-center justify-between gap-[15px]">
					<div
						onClick={handleReload}
						className="h-[35px] w-[35px] min-w-[35px] flex items-center justify-center rounded-full bg-[#D8DADC] hover:shadow-lg cursor-pointer group"
					>
						<RxReload
							color="#101010"
							width={18}
							height={18}
							className={`${spinning ? 'animate-spin' : ''} transition-all duration-300`}
						/>
					</div>
					<div
						onClick={() => setActive(true)}
						className="h-[35px] min-w-[35px] w-[35px] flex items-center justify-center rounded-full bg-[#D8DADC] hover:shadow-lg cursor-pointer"
					>
						<AddUser color="#101010" width={18} height={18} />
					</div>
					<Button
						minWidth="140px"
						height="30px"
						fontSize="13px"
						borderRadius="24px"
						color="white"
						backgroundColor="#101010"
						onClick={() => setCreateModal(true)}
					>
						Создать запись
					</Button>
				</div>
			</div>
			<div className="w-full h-[calc(100%-70px)] flex gap-[15px]">
				<div className="w-[360px] bg-white rounded-[24px] p-[20px] flex flex-col gap-[15px]">
					<CalendarDatePicker
						currentDate={currentDate}
						setCurrentDate={setCurrentDate}
					/>
					<hr className="h-[1px] w-full bg-[#E8EAED]" />
					{isLoadingScheduleMaster || isLoadingCalendar ? (
						<div className="w-full h-full flex items-center justify-center">
							<Loading />
						</div>
					) : (
						<StuffSelector
							activeTab={activeTab}
							stuff={dataScheduleMaster?.content || []}
							filteredData={filteredData}
							setFilteredData={setFilteredData}
							setChoosedMaster={activeTab === 1 ? setChoosedMaster : undefined}
						/>
					)}
				</div>
				<div className="w-full h-full bg-white rounded-[24px]">
					{activeTab === 0 && (
						<CalendarDay
							currentDate={currentDate.format('YYYY-MM-DD')}
							timeSlots={timeSlots}
							filteredData={filteredData}
							isLoading={
								isLoadingScheduleMaster ||
								branchScheduleWeeklyLoading ||
								isLoadingCalendar
							}
							dataCalendar={dataCalendar}
							setCreateUser={setActive}
						/>
					)}
					{activeTab === 1 && (
						<CalendarWeek
							masterSchedule={masterSchedule}
							isLoading={isLoadingScheduleMaster || isLoadingCalendarWeek}
							dataCalendarWeek={dataCalendarWeek}
							choosedMaster={choosedMaster}
							setCreateUser={setActive}
						/>
					)}
					{activeTab === 2 && (
						<CalendarMonth
							setCreateUser={setActive}
							dataCalendar={dataCalendarMonth}
							currentDate={currentDate}
							isLoading={isLoadingCalendarMonth || isLoadingScheduleMaster}
							filteredMasters={filteredData.map((item: any) => item.masterId)}
						/>
					)}
				</div>
			</div>
		</div>
	)
}
