import { useEffect, useState } from 'react'
import { MultiSelect } from '../../../../../../../components/UI/Selects/MultiSelect/MultiSelect'
import { Button } from '../../../../../../../components/UI/Buttons/Button/Button'
import { Table } from '../../../../../../../components/UI/Tables/Table/Table'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
	deleteSpecializationMaster,
	getSpecializationsMaster,
	getSpecializationsMasterSelect,
	postSpecializationMaster,
} from '../../../../../../../store/features/specialization-slice'
import { AnyAction } from '@reduxjs/toolkit'
import { RootState } from '../../../../../../../store'
import { IconButton } from '@mui/material'
import { AiOutlineDelete } from 'react-icons/ai'
import { translateObject } from '../../../../../../../shared/lib/helpers/helpers'
import { DeleteModal } from '../../../../../../../components/UI/Modal/DeleteModal/DeleteModal'
import styles from './Specialization.module.css'
import { useGetCopmanyOwnerQuery } from '../../../../../../../store/services/branch.service'
import { ROLES } from '../../../../../../../shared/lib/constants/constants'

interface specializationSelectProps {
	id: number
	name: string
}

export const Specialization = () => {
	const { role } = useSelector((state: RootState) => state.auth)
	const { data: owner } = useGetCopmanyOwnerQuery(undefined, {
		skip: role !== ROLES.OWNER,
	})
	const { branchAdminMasterJwt } = useSelector(
		(state: RootState) => state.branch
	)
	const { masterSpecialization, masterSpecializationSelect = [] } = useSelector(
		(state: RootState) => state.specialization
	)

	const categoryType =
		role === ROLES.OWNER ? owner?.category : branchAdminMasterJwt?.categoryType

	const [specializationsSelect, setSpecializationsSelect] = useState([])
	const [deleteId, setDeleteId] = useState(NaN)
	const [deleteModal, setDeleteModal] = useState(false)

	const { masterID } = useParams()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(
			getSpecializationsMaster({
				masterID,
			}) as unknown as AnyAction
		)
		if (categoryType) {
			dispatch(
				getSpecializationsMasterSelect({
					category: categoryType,
					masterID,
				}) as unknown as AnyAction
			)
		}
	}, [dispatch, masterID, branchAdminMasterJwt, categoryType])

	function handleClickPost() {
		setSpecializationsSelect([])
		dispatch(
			postSpecializationMaster({
				masterID,
				specializationsSelect: translateObject(specializationsSelect),
				category: categoryType,
			}) as unknown as AnyAction
		)
	}

	function handleClickDelete(specializationsID: number) {
		setDeleteId(specializationsID)
		setDeleteModal(true)
	}

	function handleSuccessDelete() {
		dispatch(
			deleteSpecializationMaster({
				masterID,
				specializationsID: deleteId,
				category: categoryType,
			}) as unknown as AnyAction
		)
		setDeleteModal(false)
	}

	function handleCancelDelete() {
		setDeleteId(NaN)
		setDeleteModal(false)
	}

	const HEADER_SPECIALIZATION = [
		{ headerName: '№', field: 'index', flex: 5 },
		{ headerName: 'Название', field: 'name', flex: 10 },
		{
			headerName: 'Действие',
			field: 'action',
			flex: 5,
			renderCell: (item: any) => {
				return (
					<IconButton
						onClick={() => handleClickDelete(item.row.id)}
						children={<AiOutlineDelete cursor="pointer" size={22} />}
					/>
				)
			},
		},
	]

	const ACCARDION_FIELDS = ['name']

	return (
		<>
			<DeleteModal
				active={deleteModal}
				handleClose={handleCancelDelete}
				handleTrueClick={handleSuccessDelete}
				title="удалить"
			/>
			<div className={styles.container_select}>
				<MultiSelect
					label="Cпециальность"
					placeholder="Cпециальность"
					noOptionsMessage={() => 'Нет специальности'}
					isClearable={true}
					options={masterSpecializationSelect.map(
						(item: specializationSelectProps) => {
							return { label: item.name, value: item.id }
						}
					)}
					value={specializationsSelect}
					onChange={(e) => setSpecializationsSelect(e)}
				/>
				<Button
					width="120px"
					disabled={specializationsSelect.length === 0}
					onClick={() => handleClickPost()}
				>
					Добавить
				</Button>
			</div>
			<div>
				<Table
					columns={HEADER_SPECIALIZATION}
					data={masterSpecialization}
					index={true}
					loading={false}
					pagination={true}
				/>
			</div>
		</>
	)
}
