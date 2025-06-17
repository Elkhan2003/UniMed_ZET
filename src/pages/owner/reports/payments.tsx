import { useState } from 'react'
import { SlTable } from '../../../components/shared/sl-table'
import { useGetReportPaymentsQuery } from '../../../store/services/report.service'
import { convertPaymentType } from '../../../shared/lib/helpers/helpers'
import dayjs from 'dayjs'

dayjs.locale('ru')

export const PaymentsReports = ({
	branchId,
	startDate,
	endDate,
}: {
	branchId: number
	startDate: string
	endDate: string
}) => {
	const [pagination, setPagination] = useState({
		page: 1,
		size: 10,
	})
	const { data, isLoading } = useGetReportPaymentsQuery(
		{
			branchId,
			startDate: startDate,
			endDate: endDate,
			page: pagination.page,
			size: pagination.size,
		},
		{ skip: !branchId || !startDate || !endDate }
	)

	return (
		<div className="w-full">
			<SlTable
				columns={[
					{
						title: '№',
						dataIndex: 'id',
						render: (value, record, index) => index + 1,
						width: 100,
					},
					{ title: 'Фио', dataIndex: 'fullName' },
					{
						title: 'Дата',
						dataIndex: 'payedDate',
						render: (value) => dayjs(value).format('D MMMM YYYY, HH:mm'),
					},
					{ title: 'Оплачено', dataIndex: 'paid' },
					{
						title: 'Способ оплаты',
						dataIndex: 'paymentType',
						render: (value) => convertPaymentType(value),
					},
				]}
				dataSource={data?.content ?? []}
				loading={isLoading}
				pagination={{
					total: data?.totalElements ?? 0,
					page: (data?.pageable?.pageNumber + 1),
					size: data?.pageable?.pageSize ?? 10,
					onChange: (newPagination) => {
						setPagination(newPagination)
					},
				}}
			/>
		</div>
	)
}
