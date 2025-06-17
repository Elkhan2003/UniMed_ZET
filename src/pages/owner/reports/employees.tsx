import { SlTable } from '../../../components/shared/sl-table'
import { useGetReportEmployeesQuery } from '../../../store/services/report.service'

export const EmployeesReports = ({
	branchId,
	startDate,
	endDate,
}: {
	branchId: number
	startDate: string
	endDate: string
}) => {
	const { data, isLoading } = useGetReportEmployeesQuery(
		{
			branchId,
			startDate: startDate,
			endDate: endDate,
		},
		{ skip: !branchId }
	)
	return (
		<div className="w-full">
			<SlTable
				columns={[
					{
						title: '№',
						dataIndex: 'id',
						render: (_, __, index) => index + 1,
						width: 40
					},
					{ title: 'ФИО', dataIndex: 'fullName' },
					{ title: 'Визиты', dataIndex: 'quantityAppointment' },
					{ title: 'Сумма визита', dataIndex: 'appointmentSum' },
					{ title: 'Скидки', dataIndex: 'discount' },
					{ title: 'Ставка', dataIndex: 'salaryRateId' },
					{ title: 'Начислено', dataIndex: 'salary' },
					{ title: 'Доля, %', dataIndex: 'percent' },
					{ title: 'Оплачено', dataIndex: 'issuedSalary' },
					{ title: 'Остаток ЗП', dataIndex: 'remainderOfSalary' },
				]}
				dataSource={data ?? []}
				loading={isLoading}
			/>
		</div>
	)
}
