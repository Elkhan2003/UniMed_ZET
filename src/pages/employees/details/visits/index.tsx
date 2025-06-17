import { useState } from 'react'
import { SlTable } from '../../../../components/shared/sl-table'
import { useGetStuffAppointmentsQuery } from '../../../../store/services/calendar.service'
import { convertStatus } from '../../../../shared/lib/helpers/helpers'
import dayjs from 'dayjs'

const columns = [
	{
		title: 'Дата',
		dataIndex: 'startTime',
		render: (_: any, record: any) => {
			return (
				<p>
					{dayjs(record.startTime).format('DD.MM.YYYY')} <br />
					{dayjs(record.startTime).format('HH:mm')}{' '}
					{dayjs(record.endTime).format('HH:mm')}
				</p>
			)
		},
		width: 120,
	},
	{
		title: 'Фото',
		dataIndex: 'user',
		render: (value: any) => {
			return (
				<img
					src={value.avatar}
					alt="avatar"
					className="w-[40px] h-[40px] min-w-[40px] rounded-full object-cover"
				/>
			)
		},
		width: 60,
	},
	{
		title: 'ФИО',
		dataIndex: 'user',
		render: (value: any) => {
			return (
				<p>
					{value.firstName} {value.lastName}
				</p>
			)
		},
	},
	{
		title: 'Услуги',
		dataIndex: 'services',
		render: (value: any) => {
			return (
				<>
					<p className="text-[14px] leading-[15px] font-[400] text-[#101010] line-clamp-3">
						{[...value, ...value].map((item: any) => item.name).join(', ')}
						<br />
					</p>
				</>
			)
		},
	},
	{
		title: 'Цена',
		dataIndex: 'services',
		render: (value: any) => {
			return (
				<p className="text-[14px] leading-[15px] font-[400] text-[#101010] whitespace-nowrap">
					{value.reduce((acc: number, item: any) => acc + item.price, 0)} с
				</p>
			)
		},
		width: 80,
	},
	{
		title: 'Статус',
		dataIndex: 'appointmentStatus',
		render: (value: any) => {
			return (
				<div className="w-[160px]">
					{convertStatus(value)}
				</div>
			)
		},
	},
]

export const Visits = ({ masterId }: { masterId: number }) => {
	const [pagination, setPagination] = useState({
		page: 1,
		size: 10,
	})
	const { data, isLoading } = useGetStuffAppointmentsQuery({
		masterId: 1,
		pagination: {
			page: pagination.page,
			size: pagination.size,
		},
		status: [],
	})

	return (
		<SlTable
			columns={columns}
			dataSource={data?.content || []}
			loading={isLoading}
			pagination={{
				total: data?.totalElements,
				page: pagination.page,
				size: pagination.size,
				onChange: (newPagination) => {
					setPagination(newPagination)
				},
			}}
		/>
	)
}
