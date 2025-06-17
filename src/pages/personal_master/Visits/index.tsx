import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMasterAppoinment } from '../../../store/features/calendar-slice'
import { AnyAction } from '@reduxjs/toolkit'
import { RootState } from '../../../store'
import { putAppointmentCancel } from '../../../store/features/appointment'
import { DeleteModal } from '../../../components/UI/Modal/DeleteModal/DeleteModal'
import { StyledTable } from '../../../components/UI/StyledTable'
import { getColumns } from './consts'
import { useGetMasterProfileQuery } from '../../../store/services/master.service'
import { Details } from '../../../components/Calendar/modals/details'

export default function PersonalVisits() {
	const { data, isLoading } = useGetMasterProfileQuery()

	const { dataMaster, isLoadingCalendar } = useSelector(
		(state: RootState) => state.calendar
	)

	const [paginationAppointments, setPaginationAppointments] = useState({
		page: 1,
		pageSize: 10,
	})
	const [deleteId, setDeleteId] = useState<number | null>(null)
	const [deleteModal, setDeleteModal] = useState(false)
	const [active, setActive] = useState(false)
	const [appointmentId, setAppointmentId] = useState(0)

	const dispatch = useDispatch()

	function handleSuccessDelete() {
		dispatch(
			putAppointmentCancel({
				appointmentId: Number(deleteId),
				masterID: data?.masterId,
				page: paginationAppointments.page,
				size: paginationAppointments.pageSize,
			}) as unknown as AnyAction
		)
		setDeleteModal(false)
	}

	function handleCancelDelete() {
		setDeleteId(null)
		setDeleteModal(false)
	}

	const handleTableChange = (pagination: any) => {
		setPaginationAppointments({
			page: pagination.current,
			pageSize: pagination.pageSize,
		})
	}

	useEffect(() => {
		if (data?.masterId) {
			dispatch(
				getMasterAppoinment({
					size: paginationAppointments.pageSize,
					page: paginationAppointments.page,
					masterID: data?.masterId,
				}) as unknown as AnyAction
			)
		}
	}, [data, paginationAppointments, dispatch])

	return (
		<div  className='w-full bg-white p-[20px]  min-h-[calc(100vh-45px)]'>
			<DeleteModal
				active={deleteModal}
				handleClose={handleCancelDelete}
				handleTrueClick={handleSuccessDelete}
				title="Отменить"
				okText="Отменить"
			/>
			<Details
				active={active}
				appointmentId={appointmentId}
				handleClose={() => setActive(false)}
				onSuccess={() => {
					dispatch(
						getMasterAppoinment({
							size: paginationAppointments.pageSize,
							page: paginationAppointments.page,
							masterID: data?.masterId,
						}) as unknown as AnyAction
					)
				}}
			/>
			{/* <LayoutContent> */}
				<StyledTable
					columns={getColumns((id: number) => {
						setAppointmentId(id)
						setActive(true)
					})}
					dataSource={dataMaster?.content}
					loading={isLoadingCalendar || isLoading}
					pagination={{
						current: paginationAppointments.page,
						pageSize: paginationAppointments.pageSize,
						total: dataMaster?.totalElements,
						onChange: (page, pageSize) =>
							setPaginationAppointments({ page, pageSize }),
						showSizeChanger: false,
					}}
					onRow={(record: any) => ({
						onClick: () => {
							setAppointmentId(record.id)
							setActive(true)
						},
					})}
					onChange={handleTableChange}
					rowKey="id"
				/>
			{/* </LayoutContent> */}
		</div>
	)
}
