import React, { useState } from 'react'
import { useGetMarketingsQuery } from '../../../store/services/report.service'
import { SmsModal } from './sms-modal'
import { SlTable } from '../../../components/shared/sl-table'
import dayjs from 'dayjs'

type ClientStatus = 'REGULAR' | 'INACTIVE' | 'ONE_TIME' | string

interface ClientData {
	id: number
	firstName: string
	lastName: string
	phoneNumber: string
	lastAppointmentDate?: string
	totalSpent: number
	appointmentsCount: number
	averageBill: number
	visitsPerMonth: number
	status: ClientStatus
	lastAppointmentStartDateTime?: string | null
	lastAppointmentEndDateTime?: string | null
	lastAppointmentPrice: number
}

interface ContactButtonsProps {
	click: () => void
	setPhone: (phone: string) => void
	setTypeChat: (typeChat: string) => void
	phone: string
}

interface ExpandedRowProps {
	record: ClientData
	click: () => void
	setPhone: (phone: string) => void
	setTypeChat: (typeChat: string) => void
}

const statusColors: Record<ClientStatus, string> = {
	REGULAR: '#DFFFE1',
	INACTIVE: '#FFF8DB',
	ONE_TIME: '#FFDEEE',
}

const statusColorsLabels: Record<ClientStatus, string> = {
	REGULAR: '#3FC24C',
	INACTIVE: '#FF8A24',
	ONE_TIME: '#FF99D4',
}

const statusLabels: Record<ClientStatus, string> = {
	REGULAR: 'Постоянный',
	INACTIVE: 'Спящий',
	ONE_TIME: 'Разовые',
}

const formatDate = (dateString?: string | null): string => {
	if (!dateString) return ''
	const date = new Date(dateString)
	return date.toLocaleDateString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
}

const formatTimeRange = (
	startDateString?: string | null,
	endDateString?: string | null
): string => {
	if (!startDateString || !endDateString) return ''

	const start = new Date(startDateString)
	const end = new Date(endDateString)

	const startTime = start.toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	})

	const endTime = end.toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	})

	return `${startTime}-${endTime}`
}

const ContactButtons: React.FC<ContactButtonsProps> = ({
	click,
	setPhone,
	setTypeChat,
	phone,
}) => (
	<div className="flex space-x-2 mt-1">
		<a
			onClick={() => {
				setPhone(phone)
				setTypeChat('WHATSAPP')
				click()
			}}
			className="flex items-center justify-center w-8 h-8 bg-[#E8EAED] rounded-full"
		>
			<img src="/Whatsapp.png" alt="WhatsApp" className="w-6 h-6" />
		</a>
		<a
			onClick={() => {
				setPhone(phone)
				setTypeChat('TELEGRAM')
				click()
			}}
			className="flex items-center justify-center w-8 h-8 bg-[#E8EAED] rounded-full"
		>
			<img src="/Telegram.png" alt="Telegram" className="w-5 h-5" />
		</a>
	</div>
)

export const MarketingAllsPage: React.FC<{
	branchId: string
	status: string
	pagination: {
		page: number
		size: number
	}
	tabs: {
		id: number
		value: string
		label: string
	}[]
	setPagination: (pagination: { page: number; size: number }) => void
}> = ({ branchId, status, pagination }) => {
	const [type, setType] = useState('')

	const [activeSms, setActiveSms] = useState(false)
	const [phone, setPhone] = useState('')
	const [typeChat, setTypeChat] = useState('')

	const { data: clientsData = [], isLoading } = useGetMarketingsQuery(
		{
			branchId: branchId,
			status: status.toUpperCase(),
			page: pagination.page,
			size: pagination.size,
		},
		{ skip: !branchId }
	)

	const displayData: ClientData[] = clientsData.length > 0 ? clientsData : []

	const stop = [
		{
			id: 0,
			firstName: 'string',
			lastName: 'string',
			phoneNumber: '+996504244527',
			totalSpent: 10,
			appointmentsCount: 0,
			status: 'REGULAR',
			firstAppointmentDate: '2025-05-19T07:45:31.789Z',
			visitsPerMonth: 0,
			averageBill: 0,
			startDateTime: '2025-05-19T07:45:31.789Z',
			sum: 0,
		},
		{
			id: 0,
			firstName: 'string',
			lastName: 'string',
			phoneNumber: '+996502950200',
			totalSpent: 0,
			appointmentsCount: 0,
			status: 'REGULAR',
			firstAppointmentDate: '2025-05-19T07:45:31.789Z',
			visitsPerMonth: 0,
			averageBill: 0,
			startDateTime: '2025-05-19T07:45:31.789Z',
			sum: 0,
		},
	]

	const MarketingColumns: any[] = [
		{
			title: '№',
			dataIndex: 'id',
			width: 50,
		},
		{
			title: 'ФИО клиента',
			dataIndex: 'firstName',
		},
		{
			title: 'Визиты',
			dataIndex: 'appointmentsCount',
		},
		{
			title: 'Внесено денег',
			dataIndex: 'totalSpent',
		},
		{
			title: 'Средний чек',
			dataIndex: 'averageBill',
		},
		{
			title: 'Частота визитов',
			dataIndex: 'visitsPerMonth',
		},
		{
			title: 'Статус',
			dataIndex: 'status',
			render: (status: ClientStatus) => (
				<div
					className="px-[8px] py-[3px] rounded-[16px] flex items-center justify-center text-[13px]"
					style={{
						backgroundColor: statusColors[status],
						color: statusColorsLabels[status],
					}}
				>
					{statusLabels[status]}
				</div>
			),
		},
	]

	return (
		<div className="w-full h-full">
			<SmsModal
				active={activeSms}
				handleClose={() => setActiveSms(false)}
				typeSms={type}
				phone={phone}
				typeChat={typeChat}
			/>
			<SlTable
				columns={MarketingColumns}
				dataSource={stop}
				loading={isLoading}
				expandedRowRender={(record) => (
					<div className="w-full flex items-center gap-[20px] pl-[200px] py-[20px]">
						<div className="w-[150px]">
							<p className="text-[14px] font-[600] text-[#101010]">
								Последний визит:
							</p>
							<p>Название услуги</p>
						</div>
						<div className="w-[150px]">
							<p className="text-[14px] font-[600] text-[#101010]">Дата:</p>
							<p>{dayjs(record.startDateTime).format('DD.MM.YYYY')}</p>
						</div>
						<div className="w-[150px]">
							<p className="text-[14px] font-[600] text-[#101010]">
								Внесено денег:
							</p>
							<p>{record.sum} с</p>
						</div>
						<div className="w-[150px]">
							<p className="text-[14px] font-[600] text-[#101010]">
								Связаться:
							</p>
							<ContactButtons
								click={() => {
									setType(record.status.toLowerCase())
									setActiveSms(true)
								}}
								setPhone={setPhone}
								setTypeChat={setTypeChat}
								phone={record.phoneNumber}
							/>
						</div>
					</div>
				)}
			/>
		</div>
	)
}

export default MarketingAllsPage
