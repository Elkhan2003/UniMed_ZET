import { useState } from 'react'
import ReusableTabs from '../../components/shared/sl-tab'
import { useSearchParams } from 'react-router-dom'
import { RxReload } from 'react-icons/rx'
import {
	useGetNotifications,
	useReadNotificationById,
} from '../../shared/queries/notification-service.queries'
import { SlTable } from '../../components/shared/sl-table'
import dayjs from 'dayjs'
import { TranslateAppointmentStatus } from '../../shared/lib/helpers/helpers'
import { Details } from '../../components/Calendar/modals/details'

const tabs = [
	{ id: 0, label: 'Новые', value: 'send' },
	{ id: 1, label: 'Прочитанные', value: 'read' },
]

const columns = [
	{
		title: 'ФИО клиента',
		dataIndex: 'fullName',
		key: 'fullName',
	},
	{
		title: 'Телефон',
		dataIndex: 'phoneNumber',
		key: 'phoneNumber',
	},
	{
		title: 'Дата и время начала',
		dataIndex: 'startTime',
		key: 'startTime',
		render: (value: string) => dayjs(value).format('DD.MM.YYYY HH:mm'),
	},
	{
		title: 'Дата и время окончания',
		dataIndex: 'endTime',
		key: 'endTime',
		render: (value: string) => dayjs(value).format('DD.MM.YYYY HH:mm'),
	},
	{
		title: 'Статус записи',
		dataIndex: 'appointmentStatus',
		key: 'appointmentStatus',
		render: (status: string) => TranslateAppointmentStatus(status),
	},
	{
		title: 'Услуги',
		dataIndex: 'services',
		key: 'services',
		render: (services: string[]) => (
			<p className="text-[#101010] text-[13px] font-medium line-clamp-3">
				{services?.join(', ')}
			</p>
		),
	},
]

export const NotificationPage = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [pagination, setPagination] = useState({ page: 1, size: 10 })
	const [spinning, setSpinning] = useState(false)
	const [open, setOpen] = useState(false)
	const [appointmentId, setAppointmentId] = useState<number>(0)
	const [activeTab, setActiveTab] = useState(
		tabs.findIndex((item) => item.value === searchParams.get('tab')) >= 0
			? tabs.findIndex((item) => item.value === searchParams.get('tab'))
			: 0
	)

	const {
		data: notifications,
		isLoading,
		refetch,
	} = useGetNotifications(
		tabs[activeTab].value.toUpperCase(),
		[],
		pagination.page,
		pagination.size
	)

	const handleTabChange = (id: string | number) => {
		setActiveTab(typeof id === 'string' ? parseInt(id) : id)
	}

	const { mutate } = useReadNotificationById(appointmentId)

	const NotificationTest = () => {
		const handleShowNotification = () => {
			if ('Notification' in window) {
				Notification.requestPermission().then((permission) => {
					if (permission === 'granted') {
						new Notification('Уведомление сработало!', {
							body: 'Нажми на меня!',
							requireInteraction: true,
						})
					} else {
						alert('Уведомления запрещены.')
					}
				})
			} else {
				alert('Браузер не поддерживает уведомления.')
			}
		}

		return (
			<button onClick={handleShowNotification}>Показать уведомление</button>
		)
	}

	return (
		<div className="w-full h-[calc(100vh-60px)] px-[15px] py-[5px] flex flex-col gap-[15px] overflow-y-auto">
			<Details
				active={open}
				handleClose={() => {
					setOpen(false)
					if (appointmentId && activeTab === 0) mutate()
					refetch()
				}}
				appointmentId={appointmentId}
			/>
			<div
				style={{
					borderBottom: '1.5px solid #D8DADC',
				}}
				className="w-full h-[50px] flex items-center justify-between"
			>
				<div className="flex items-center justify-between gap-[20px]">
					<p className="text-[#101010] text-[20px]">Уведомления</p>
					<div className="max-w-[250px] min-w-[250px]">
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
						onClick={NotificationTest}
					>
						<RxReload
							color="#101010"
							width={18}
							height={18}
							className={`${spinning ? 'animate-spin' : ''} transition-all duration-300`}
						/>
					</div>
				</div>
			</div>
			<SlTable
				columns={columns}
				dataSource={notifications?.content}
				loading={isLoading}
				onRow={{
					onClick: (record) => {
						setAppointmentId(record.appointmentId)
						setOpen(true)
					},
				}}
				pagination={{
					total: notifications?.totalElements,
					page: pagination.page,
					size: pagination.size,
					onChange: (newPagination) => {
						setPagination(newPagination)
					},
				}}
			/>
		</div>
	)
}
