import {
	convertStatus,
	formatDateToRussian,
	TranslateAppointmentStatus,
} from '../../../shared/lib/helpers/helpers'
import { RightOutlined } from '@ant-design/icons'

export const getColumns = (openAppointment: (id: number) => void) => {
	return [
		{
			title: 'Фио Клиента',
			dataIndex: 'fullName',
			key: 'fullName',
			render: (_: any, record: any) => (
				<p>{`${record.user.firstName}-${record.user.lastName}`}</p>
			),
		},
		{
			title: 'Дата и время',
			dataIndex: 'startTime',
			key: 'startTime',
			render: (_: any, record: any) => {
				return (
					<p>
						<span>{formatDateToRussian(record?.startTime.split('T')[0])}</span>{' '}
						-{' '}
						<span>{`${record?.startTime.split('T')[1].slice(0, 5)} - ${record?.endTime.split('T')[1].slice(0, 5)}`}</span>
					</p>
				)
			},
		},
		{
			title: 'Статус',
			dataIndex: 'appointmentStatus',
			key: 'appointmentStatus',
			render: (status: any) => TranslateAppointmentStatus(status),
		},
		{
			title: 'Открыть',
			key: 'actions',
			render: (_: any, record: any) => {
				return (
					<div
						onClick={() => openAppointment(record.id)}
						className="rounded-[8px] w-fit p-1 px-2 bg-gray-100 hover:bg-gray-200 cursor-pointer z-20"
					>
						<RightOutlined />
					</div>
				)
			},
		},
	]
}
