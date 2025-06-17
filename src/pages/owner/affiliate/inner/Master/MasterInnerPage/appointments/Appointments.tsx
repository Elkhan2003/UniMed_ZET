import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMasterAppoinment } from '../../../../../../../store/features/calendar-slice'
import { AnyAction } from '@reduxjs/toolkit'
import { Table } from '../../../../../../../components/UI/Tables/Table/Table'
import { useParams } from 'react-router-dom'
import {
	formatDateToRussian,
	TranslateAppointmentStatus,
} from '../../../../../../../shared/lib/helpers/helpers'
import { RootState } from '../../../../../../../store'
import { Details } from '../../../../../../../components/Calendar/modals/details'
import { RightOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'

interface MasterRowTableProps {
	appointmentId: number
	appointmentStatus: string
	description: string
	fullName: string
	id: number
	index: number
	userId: number
	startTime: string
	row: any
}

export const Appointments = () => {
	const { dataMaster, isLoadingCalendar } = useSelector(
		(state: RootState) => state.calendar
	)

	const [paginationAppointments, setPaginationAppointments] = useState({
		page: 1,
		pageSize: 10,
	})

	const [appointmentId, setAppointmentId] = useState(0)
	const [active, setActive] = useState(false)

	const { masterID } = useParams()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(
			getMasterAppoinment({
				size: paginationAppointments.pageSize,
				page: paginationAppointments.page,
				masterID: masterID,
			}) as unknown as AnyAction
		)
	}, [masterID, paginationAppointments, dispatch])

	const HEADER_MASTER_APPOINTMENTS = [
		{
			headerName: '№',
			field: 'index',
			flex: 5,
		},
		{
			headerName: 'ФИО',
			field: 'fullName',
			flex: 15,
			renderCell: ({ row }: MasterRowTableProps) => {
				return <p>{`${row.user.firstName} - ${row.user.lastName}`}</p>
			},
		},
		{
			headerName: 'Дата и время',
			field: 'startTime',
			flex: 10,
			renderCell: ({ row }: MasterRowTableProps) => {
				return (
					<p>
						<span>{formatDateToRussian(row?.startTime.split('T')[0])}</span>,{' '}
						<span>{`${row?.startTime.split('T')[1].slice(0, 5)} - ${row?.endTime.split('T')[1].slice(0, 5)}`}</span>
					</p>
				)
			},
		},
		{
			headerName: 'Комментарий',
			field: 'description',
			flex: 10,
			renderCell: ({ row }: MasterRowTableProps) => {
				return (
					<Tooltip title={<p>{row.description}</p>}>
						<p className="max-w-[200px] overflow-x-clip">{row.description}</p>
					</Tooltip>
				)
			},
		},
		{
			headerName: 'Статус',
			field: 'appointmentStatus',
			flex: 10,
			valueGetter: ({ row }: MasterRowTableProps) => {
				return TranslateAppointmentStatus(row.appointmentStatus)
			},
		},
		{
			headerName: 'Открыть',
			field: 'action',
			flex: 10,
			renderCell: ({ row }: MasterRowTableProps) => {
				return (
					<div>
						<div
							onClick={() => {
								setAppointmentId(row.id)
								setActive(true)
							}}
							className="rounded-[8px] w-fit p-1 px-2 bg-gray-200 hover:bg-gray-300 cursor-pointer z-20"
						>
							<RightOutlined />
						</div>
					</div>
				)
			},
		},
	]

	return (
		<div>
			<Details
				active={active}
				handleClose={() => setActive(false)}
				appointmentId={appointmentId}
				onSuccess={() => {
					dispatch(
						getMasterAppoinment({
							size: paginationAppointments.pageSize,
							page: paginationAppointments.page,
							masterID: masterID,
						}) as unknown as AnyAction
					)
				}}
			/>
			<Table
				data={dataMaster?.content}
				columns={HEADER_MASTER_APPOINTMENTS}
				index={true}
				pagination={false}
				loading={isLoadingCalendar}
				onClickCard={(row: any) => {
					setAppointmentId(row.id)
					setActive(true)
				}}
				paginationChange={setPaginationAppointments}
				paginationValue={paginationAppointments}
			/>
		</div>
	)
}
