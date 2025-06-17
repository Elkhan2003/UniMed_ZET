import React from 'react'
import { useGetCommonReportQuery } from '../../../store/services/report.service'
import Loading from '../../loading'

export const CommonReports = ({
	startDate,
	endDate,
	branchId,
}: {
	startDate: string
	endDate: string
	branchId: number
}) => {
	const { data, isLoading } = useGetCommonReportQuery(
		{
			branchId,
			startDate,
			endDate,
		},
		{ skip: !branchId }
	)

	const reportData = data || {
		appointmentReport: {
			appointmentCount: 0,
			invoiceIssued: 0,
			paid: 0,
			notPaid: 0,
			partialPaid: 0,
			discount: 0,
		},
		sharedMoney: {
			cash: 0,
			withoutCash: 0,
			grCode: 0,
			discount: 0,
			totalAccount: 0,
		},
	}

	if (isLoading) {
		return (
			<div className="w-full h-[calc(100vh-145px)] flex items-center justify-center">
				<Loading />
			</div>
		)
	}

	const ReportRow = ({ label, value }: { label: string; value: number }) => (
		<div
			style={{ borderBottom: '1px solid #F2F2F1' }}
			className="flex justify-between items-center h-[55px] px-6 py-4 text-[14px] text-[#101010]"
		>
			<span>{label}</span>
			<span>{value}</span>
		</div>
	)

	return (
		<div
			style={{
				border: '1px solid #F2F2F1',
				boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.02)',
				backdropFilter: 'blur(100px)',
			}}
			className="w-full h-fit bg-white border-solid rounded-[16px] overflow-hidden"
		>
			<div className="grid grid-cols-2 gap-0">
				<div
					style={{ borderRight: '1px solid #F2F2F1' }}
					className="col-span-1"
				>
					<div
						style={{ borderBottom: '1px solid #F2F2F1' }}
						className="py-5 px-6 bg-[#F9F9F9] font-[600] text-[14px]"
					>
						Визиты
						<span className="float-right">
							{reportData.appointmentReport.appointmentCount}
						</span>
					</div>
					<ReportRow
						label="Выставлен счёт"
						value={reportData.appointmentReport.invoiceIssued}
					/>
					<ReportRow
						label="Оплачено"
						value={reportData.appointmentReport?.paid}
					/>
					<ReportRow
						label="Не оплачено"
						value={reportData.appointmentReport.notPaid}
					/>
					<ReportRow
						label="Частично оплачено"
						value={reportData.appointmentReport.partialPaid || 0}
					/>
					<ReportRow
						label="Скидка"
						value={reportData.appointmentReport.discount}
					/>
				</div>
				<div className="col-span-1">
					<div
						style={{ borderBottom: '1px solid #F2F2F1' }}
						className="py-5 px-6 bg-[#F9F9F9] font-[600] text-[14px]"
					>
						Общие деньги
					</div>
					<ReportRow label="Наличный" value={reportData.sharedMoney?.cash} />
					<ReportRow
						label="Без наличный"
						value={reportData.sharedMoney?.withoutCash}
					/>
					<ReportRow label="QR-код" value={reportData.sharedMoney?.mbank} />
					<ReportRow label="Скидка" value={reportData.sharedMoney?.discount} />
					<ReportRow
						label="Общий счёт"
						value={reportData.sharedMoney?.totalAccount}
					/>
				</div>
			</div>
		</div>
	)
}

export default CommonReports
