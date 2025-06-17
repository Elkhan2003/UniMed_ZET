import { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
	deleteMasterServices,
	putMasterServicesAdd,
} from '../../../../../../../store/features/master-slice'
import { useParams } from 'react-router-dom'
import { AnyAction } from '@reduxjs/toolkit'
import styles from './Services.module.css'
import { IconButton } from '@mui/material'
import { Table } from '../../../../../../../components/UI/Tables/Table/Table'
import { translateObject } from '../../../../../../../shared/lib/helpers/helpers'
import { AiOutlineDelete } from 'react-icons/ai'
import { MultiSelect } from '../../../../../../../components/UI/Selects/MultiSelect/MultiSelect'
import { Button } from '../../../../../../../components/UI/Buttons/Button/Button'
import { DeleteModal } from '../../../../../../../components/UI/Modal/DeleteModal/DeleteModal'
import { useGetServicesSelectQuery } from '../../../../../../../store/services/service.service'
import { useGetMasterServicesSelectQuery } from '../../../../../../../store/services/master.service'

interface ServiceInsideInnerPage {
	id: number
	name: string
	price: number
	duration: number
}

interface ServiceInisdePageProps {
	id: number
	name: string
	serviceResponses: ServiceInsideInnerPage[]
}

interface ServicePageProps {
	id: number
	name: string
	icon: string
	subCategoryServices: ServiceInisdePageProps[]
}

export const Service = () => {
	const { id, masterID } = useParams()
	const [selectedMasterServices, setSelectedMasterServices] = useState([])
	const [deleteId, setDeleteId] = useState(NaN)
	const [deleteModal, setDeleteModal] = useState(false)

	const dispatch = useDispatch()

	const { data: serviceSelect = [], refetch: refetchService } =
		useGetServicesSelectQuery(id, {
			skip: !id,
		})

	const { data: dataMasterServices = [], refetch: refetchMasterService } =
		useGetMasterServicesSelectQuery({
			masterId: masterID,
		})

	async function handlePostMasterServices() {
		setSelectedMasterServices([])
		await dispatch(
			putMasterServicesAdd({
				serviceIds: translateObject(selectedMasterServices),
				masterId: masterID,
			}) as unknown as AnyAction
		)
		await refetchMasterService()
		await refetchService()
	}

	async function handleDeleteServices(id: any) {
		setDeleteId(id.row.id)
		setDeleteModal(true)
	}

	async function handleSuccessDelete() {
		await dispatch(
			deleteMasterServices({
				masterID,
				serviceIds: deleteId,
			}) as unknown as AnyAction
		)
		setDeleteModal(false)
		await refetchMasterService()
		await refetchService()
	}

	function handleCancelDelete() {
		setDeleteId(NaN)
		setDeleteModal(false)
	}

	const HEADER_SERVICES = [
		{ headerName: '№', field: 'index', flex: 5 },
		{ headerName: 'Название', field: 'name', flex: 10 },
		{ headerName: 'Цена', field: 'price', flex: 5 },
		{ headerName: 'Длительность', field: 'duration', flex: 5 },
		{
			headerName: 'Действие',
			field: 'action',
			flex: 5,
			renderCell: (item: ServicePageProps) => {
				return (
					<IconButton
						onClick={() => handleDeleteServices(item)}
						children={<AiOutlineDelete cursor="pointer" size={22} />}
					/>
				)
			},
		},
	]

	const arrayServiceMy = dataMasterServices?.map((item: any) => item.id)
	const finalArray = serviceSelect?.filter(
		(item: any) => !arrayServiceMy?.includes(item.id)
	)

	async function handleAddAll() {
		setSelectedMasterServices([])
		await dispatch(
			putMasterServicesAdd({
				serviceIds: finalArray.map((item: any) => item.id),
				masterId: masterID,
			}) as unknown as AnyAction
		)
		await refetchMasterService()
		await refetchService()
	}

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
					label="Услуги"
					placeholder="Услуги"
					noOptionsMessage={() => 'Нет услуги'}
					isClearable={true}
					options={finalArray.map((item: any) => {
						return { label: item.name, value: item.id }
					})}
					value={selectedMasterServices}
					onChange={(e) => setSelectedMasterServices(e)}
				/>
				<Button
					disabled={selectedMasterServices.length === 0}
					width="120px"
					onClick={handlePostMasterServices}
				>
					Добавить
				</Button>
				<Button
					disabled={finalArray.length === 0}
					width="200px"
					onClick={handleAddAll}
				>
					Добавить все
				</Button>
			</div>
			<div>
				<Table
					columns={HEADER_SERVICES}
					data={dataMasterServices}
					index={true}
					loading={false}
					pagination={true}
				/>
			</div>
		</>
	)
}
