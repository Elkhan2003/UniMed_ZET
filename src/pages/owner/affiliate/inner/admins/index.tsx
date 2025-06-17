import { useEffect, useState } from 'react'
import { Table } from '../../../../../components/UI/Tables/Table/Table'
import { IconButton } from '@mui/material'
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../../store'
import { useParams } from 'react-router-dom'
import { adminsGetByBranchId } from '../../../../../store/features/admin-slice'
import { AnyAction } from '@reduxjs/toolkit'
import { EditAdmin } from './edit-admin'
import { adminsDelete } from '../../../../../store/features/admin-slice'
import { DeleteModal } from '../../../../../components/UI/Modal/DeleteModal/DeleteModal'
import { CreateAdmin } from './create-admin'
import { Button } from '../../../../../components/UI/Buttons/Button/Button'

export const AdminsOwner = () => {
	const { isLoadingAdmin, adminDataByBracn } = useSelector(
		(state: RootState) => state.admin
	)

	const dispatch = useDispatch()
	const { id } = useParams()

	useEffect(() => {
		dispatch(adminsGetByBranchId(id) as unknown as AnyAction)
	}, [id, dispatch])

	const [showEdit, setShowEdit] = useState(false)
	const [editData, setEditData] = useState()
	const [deleteId, setDeleteId] = useState<number>(0)
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
	const [open, setOpen] = useState(false)

	const handleDelete = (adminID: number, event: React.MouseEvent) => {
		setShowDeleteModal(true)
		setDeleteId(adminID)
	}

	const confirmDelete = async () => {
		await dispatch(adminsDelete({ adminId: deleteId }) as unknown as AnyAction)
		setShowDeleteModal(false)
		await dispatch(adminsGetByBranchId(id) as unknown as AnyAction)
	}

	const handleUpdate = (item: any, event: React.MouseEvent) => {
		setShowEdit(true)
		setEditData(item)
	}

	const HEADER_DATA_ADMINS = [
		{
			headerName: '№',
			field: 'id',
			flex: 20,
		},
		{
			headerName: 'Фио',
			field: 'fullName',
			flex: 20,
		},
		{
			headerName: 'Телефон',
			field: 'phoneNumber',
			flex: 20,
		},
		{
			headerName: 'Действие',
			field: 'action',
			flex: 10,
			renderCell: ({ row }: any) => {
				return (
					<div>
						<IconButton
							onClick={(event) => handleDelete(row.id, event)}
							children={<AiOutlineDelete cursor="pointer" size={22} />}
						/>
						<IconButton
							onClick={(event) => handleUpdate(row, event)}
							children={<AiOutlineEdit cursor="pointer" size={22} />}
						/>
					</div>
				)
			},
		},
	]
	return (
		<div className="overflow-y-scroll">
			<DeleteModal
				active={showDeleteModal}
				handleClose={() => setShowDeleteModal(false)}
				handleTrueClick={confirmDelete}
				title="Удалить Администратора"
			/>
			<CreateAdmin open={open} setOpen={setOpen} />
			<div className="flex justify-end mb-2">
				<Button width="120px" onClick={() => setOpen(true)}>
					Добавить
				</Button>
			</div>
			<Table
				columns={HEADER_DATA_ADMINS}
				data={adminDataByBracn}
				loading={isLoadingAdmin}
				pagination={false}
				index={true}
			/>
			<EditAdmin data={editData} open={showEdit} setOpen={setShowEdit} />
		</div>
	)
}
