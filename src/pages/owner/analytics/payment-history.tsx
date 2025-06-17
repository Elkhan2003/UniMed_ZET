import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { useGetReportPaymentsQuery } from '../../../store/services/report.service'
import DatePicker from '../../../components/UI/DatePicker/DatePicker'
import { Table } from '../../../components/UI/Tables/Table/Table'
import { getPaymentType, formatDate } from '../../../shared/lib/helpers/helpers'
import { useGetBranchesSelectQuery } from '../../../store/services/branch.service'
import { LonelySelect } from '../../../components/UI/Selects/LonelySelect/LonelySelect'

export const PaymentHistoryPage = () => {
	const [startDate, setStartDate] = useState<any>(
		new Date().toISOString().substring(0, 10)
	)
	const [endDate, setEndDate] = useState(
		new Date().toISOString().substring(0, 10)
	)
	const [paginationValue, setPaginationValue] = useState<any>({
		page: 1,
		pageSize: 7,
		totalPages: 1,
	})

	const { branchAdminMasterJwt } = useSelector(
		(state: RootState) => state.branch
	)

	const { role } = useSelector((state: RootState) => state.auth)

	const [id, setId] = useState<any>(null)

	const { data: branches = [], isLoading } = useGetBranchesSelectQuery(
		undefined,
		{ skip: role === 'ADMIN' }
	)

	useEffect(() => {
		if (branches.length > 0) {
			setId({
				label: branches[0].address,
				value: branches[0].id,
			})
		}
	}, [branches])

	// Skip the query until we have a valid branch id
	const hasValidBranchId =
		(role === 'ADMIN' && branchAdminMasterJwt?.branchId) ||
		(role !== 'ADMIN' && id?.value)

	const { data, isLoading: DataLoading } = useGetReportPaymentsQuery(
		{
			branchId: role === 'ADMIN' ? branchAdminMasterJwt?.branchId : id?.value,
			page: paginationValue.page,
			size: paginationValue.pageSize,
			start: startDate,
			end: endDate,
		},
		{
			skip: !hasValidBranchId,
		}
	)

	useEffect(() => {
		if (data) {
			setPaginationValue({ ...paginationValue, totalPages: data.totalPages })
		}
	}, [data])

	const paginationChange = (obj: any) => {
		setPaginationValue(obj)
	}

	const HEADER_PAYMENTS = [
		{
			headerName: 'ID',
			field: 'appointmentId',
			flex: 1,
		},
		{
			headerName: 'Время записи',
			field: 'appointmentDateTime',
			flex: 5,
			valueGetter: ({ row }: any) => {
				return `${formatDate(row.appointmentDateTime.slice(0, 10))} | ${row.appointmentDateTime.slice(11, 16)}`
			},
		},
		{
			headerName: 'Оплаченная дата',
			field: 'payedDate',
			flex: 5,
			valueGetter: ({ row }: any) => {
				return `${formatDate(row.payedDate.slice(0, 10))} | ${row.payedDate.slice(11, 16)}`
			},
		},
		{
			headerName: 'Специалист',
			field: 'masterFullName',
			flex: 5,
		},
		{
			headerName: 'Клиент',
			field: 'userFullName',
			flex: 5,
		},
		{
			headerName: 'Оплачено',
			field: 'payed',
			flex: 3,
			valueGetter: ({ row }: any) => {
				return `${row.payed} сом`
			},
		},
		{
			headerName: 'Тип оплаты',
			field: 'paymentType',
			flex: 3,
			valueGetter: ({ row }: any) => {
				return getPaymentType(row.paymentType)
			},
		},
	]

	return (
		<div className="xs:mt-[-20px]">
			<div className="flex items-end justify-start gap-4 sm:flex-col-reverse sm:items-start xs:ml-4 sm:gap-1 mb-3">
				<div className="flex items-center justify-between gap-4">
					<DatePicker
						label="Начало"
						value={startDate}
						onChange={(e: any) => setStartDate(e.target.value)}
					/>
					<DatePicker
						label="Конец"
						value={endDate}
						onChange={(e: any) => setEndDate(e.target.value)}
					/>
				</div>
				{role === 'OWNER' && (
					<div className="max-w-[250px] sm:w-full">
						<LonelySelect
							value={id}
							options={branches.map((item: any) => ({
								label: item.address,
								value: item.id,
							}))}
							onChange={(e: any) => setId(e)}
							isClearable={false}
							isLoading={isLoading}
							noOptionsMessage={() => 'Нет вариантов'}
							placeholder=""
							label="Филиалы"
						/>
					</div>
				)}
			</div>
			<div className="w-full">
				<Table
					columns={HEADER_PAYMENTS}
					data={data?.content}
					loading={DataLoading}
					pagination={false}
					index={true}
					onClickCard={(row: any) => false}
					paginationChange={paginationChange}
					paginationValue={paginationValue}
				/>
			</div>
		</div>
	)
}
