import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './Master.module.css'
import { IconButton } from '@mui/material'
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { Button } from '../../../../../../components/UI/Buttons/Button/Button'
import { MasterAddModal } from './masterAddModal/MasterAddModal'
import { MasterUpdateModal } from './masterUpdateModal/MasterUpdateModal'
import { useNavigate } from 'react-router'
import { DeleteModal } from '../../../../../../components/UI/Modal/DeleteModal/DeleteModal'
import { RootState } from '../../../../../../store'
import { useParams } from 'react-router-dom'
import { Avatar } from '@mui/material'
import toast from 'react-hot-toast'
import { useLazyGetMasterInfoQuery } from '../../../../../../store/services/master.service'

//rtk query

import {
	useGetMasterQuery,
	useDeleteMasterMutation,
} from '../../../../../../store/services/master.service'
import { StyledTitle } from '../../../../../../shared/styles'
import { Table } from '../../../../../../components/UI/Tables/Table/Table'
import { COMPENSATION_TYPE } from '../../../../../../shared/lib/constants/constants'

interface MasterTableDataProps {
	firstName: string
	lastName: string
	experience: string
	phoneNumber: string
	description: string
	id: number
	index: number | string
	row: any
}

export const MasterPage = () => {
	const { id } = useParams()

	const { branchAdminMasterJwt } = useSelector(
		(state: RootState) => state.branch
	)

	const { role } = useSelector((state: RootState) => state.auth)

	const {
		data: dataMaster = [],
		isLoading: isLoadingMaster,
		refetch,
	} = useGetMasterQuery({ branchId: id }, { skip: !id })
	const [getMasterInfo] = useLazyGetMasterInfoQuery()

	useEffect(() => {
		refetch()
	}, [])

	const [deleteMaster] = useDeleteMasterMutation()

	const [masterData, setMasterData] = useState({
		firstName: '',
		lastName: '',
		experience: '',
		authInfoRequest: {
			phoneNumber: '+996',
			password: '',
		},
		salaryRateRequest: {
			amount: '',
			compensationType: { label: 'Фиксированный', value: 'FIXED' },
		},
	})
	const [descriptionMaster, setDescriptionMaster] = useState<string>('')
	const [masterModal, setMasterModal] = useState({
		masterModalAdd: false,
		masterModalUpdate: false,
	})
	const [deleteModal, setDeleteModal] = useState(false)
	const [deleteId, setDeleteId] = useState(NaN)
	const [validationMaster, setValidationMaster] = useState(true)
	const [masterId, setMasterId] = useState(0)

	const navigate = useNavigate()

	function handleDelete(masterId: any, event: React.MouseEvent) {
		event.stopPropagation()
		setDeleteId(masterId)
		setDeleteModal(true)
	}

	async function handleSuccessDelete() {
		try {
			const response: any = await deleteMaster({ masterId: deleteId })
			setDeleteModal(false)
			toast.success('Специалист успешно удален')
		} catch (error) {
			toast.error('Произошла ошибка')
		} finally {
			setDeleteModal(false)
		}
	}

	function handleCancelDelete() {
		setDeleteId(NaN)
		setDeleteModal(false)
	}

	async function handleUpdate(
		row: MasterTableDataProps,
		event: React.MouseEvent
	) {
		event.stopPropagation()
		const response = await getMasterInfo({ masterId: row.id })
		setMasterModal({
			masterModalAdd: false,
			masterModalUpdate: true,
		})
		setMasterId(row.id)
		setDescriptionMaster(row.description)
		setMasterData({
			firstName: row.firstName,
			lastName: row.lastName,
			experience: response.data.experience,
			authInfoRequest: {
				phoneNumber: row.phoneNumber,
				password: '',
			},
			salaryRateRequest: {
				amount: response?.data?.salaryRate?.amount,
				compensationType: {
					label: COMPENSATION_TYPE.filter(
						(item: any) =>
							item.value === response.data.salaryRate.compensationType
					)[0].label,
					value: response.data.salaryRate.compensationType,
				},
			},
		})
	}

	function handleToGo(masterId: number) {
		if (role === 'ADMIN') {
			navigate(
				`/${branchAdminMasterJwt?.branchId}/master/${masterId}/appoinments`
			)
		} else {
			navigate(`/${id}/master/${masterId}/appoinments`)
		}
	}

	useEffect(() => {
		setValidationMaster(
			masterData.firstName === ''
				? true
				: masterData.authInfoRequest.phoneNumber === '+996'
					? true
					: !masterData.salaryRateRequest.amount
						? true
						: false
		)
	}, [masterData, descriptionMaster])

	type HeaderDataItem = {
		headerName: string
		field: string
		flex: number
		valueGetter?: ({ row }: MasterTableDataProps) => string
		renderCell?: ({ row }: MasterTableDataProps) => React.ReactNode
	}

	const HEADER_DATA_MASTER: HeaderDataItem[] = [
		{
			headerName: '№',
			field: 'index',
			flex: 5,
		},
		{
			headerName: 'Фото',
			field: 'avatar',
			flex: 10,
			renderCell: (item: any) => {
				return <Avatar alt="Remy Sharp" src={item.row.avatar} />
			},
		},
		{
			headerName: 'Специалист',
			field: 'label',
			flex: 20,
			valueGetter: ({ row }: MasterTableDataProps) => {
				return `${row.firstName} ${row.lastName}`
			},
		},
		{
			headerName: 'Телефон',
			field: 'phoneNumber',
			flex: 15,
		},
		{
			headerName: 'Рейтинг',
			field: 'rating',
			flex: 10,
			valueGetter: ({ row }: MasterTableDataProps) => {
				return `${row.rating.toFixed(2)}`
			},
		},
		{
			headerName: 'Стаж',
			field: 'experience',
			flex: 5,
			valueGetter: ({ row }: MasterTableDataProps) => {
				return `${row.experience} год`
			},
		},
		{
			headerName: 'Действие',
			field: 'action',
			flex: 10,
			renderCell: ({ row }: MasterTableDataProps) => {
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
		<div className={styles.container_master_page}>
			<MasterAddModal
				masterModal={masterModal}
				setMasterModal={setMasterModal}
				masterData={masterData}
				setMasterData={setMasterData}
				validationMaster={validationMaster}
			/>
			<MasterUpdateModal
				masterModal={masterModal}
				setMasterModal={setMasterModal}
				masterData={masterData}
				setMasterData={setMasterData}
				masterId={masterId}
				validationMaster={validationMaster}
				descriptionMaster={descriptionMaster}
				setDescriptionMaster={setDescriptionMaster}
				refetch={refetch}
			/>
			<DeleteModal
				active={deleteModal}
				handleClose={handleCancelDelete}
				handleTrueClick={handleSuccessDelete}
				title="удалить"
			/>
			<div className={styles.container_master_header}>
				<StyledTitle>Специалисты</StyledTitle>
				<Button
					width="180px"
					onClick={() =>
						setMasterModal({
							masterModalAdd: true,
							masterModalUpdate: false,
						})
					}
				>
					Добавить Специалиста
				</Button>
			</div>
			<div className="overflow-y-scroll">
				<Table
					columns={HEADER_DATA_MASTER}
					data={dataMaster}
					loading={isLoadingMaster}
					pagination={true}
					index={true}
					onClickCard={(row: any) => handleToGo(row.id)}
				/>
			</div>
		</div>
	)
}
