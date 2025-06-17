import { useState, useEffect } from 'react'
import { Flex } from 'antd'
import { LayoutContent } from '../../../components/UI/LayoutContent'
import { Button } from '../../../components/UI/Buttons/Button/Button'
import { StyledTitle } from '../../../shared/styles'
import { AddService } from './AddService'
import { SubService } from './SubService'
import { useSelector } from 'react-redux'

import { EditService } from './EditService'
import { DeleteModal } from '../../../components/UI/Modal/DeleteModal/DeleteModal'
import { RootState } from '../../../store'
import {
	useDeleteCategoryServiceMutation,
	useGetServiceByMasterQuery,
} from '../../../store/queries/services.master.service'
import { ServicesAccordion } from '../../../components/UI/Accordion/ServicesAccordion'
import { ServiceResponse } from '../../../common/service'
import { Backdrop, CircularProgress } from '@mui/material'
import { isLoadingSx, ROLES } from '../../../shared/lib/constants/constants'
import { useParams } from 'react-router-dom'
import { useGetServiceCategoryQuery } from '../../../store/queries/service.category.service'
import toast from 'react-hot-toast'

interface DataService {
	name: string
	price: number
	duration: number
	description: string
	image: string
	type: boolean
	branchId: number | undefined
	categoryId: number
}

export default function PersonalService() {
	const { role } = useSelector((state: RootState) => state.auth)
	const { id } = useParams()
	const { branchAdminMasterJwt } = useSelector(
		(state: RootState) => state.branch
	)

	const { individualData } = useSelector((state: RootState) => state.individual)
	const { ownerData } = useSelector((state: RootState) => state.ownerCompany)

	const categoryData =
		role === ROLES.OWNER
			? ownerData?.category
			: role === ROLES.ADMIN
				? branchAdminMasterJwt?.categoryType
				: individualData?.categoryType

	const branchId =
		role === ROLES.OWNER
			? Number(id)
			: role === ROLES.ADMIN
				? branchAdminMasterJwt?.branchId
				: individualData?.branchId

	const { data: servicesByMaster } = useGetServiceByMasterQuery(
		{
			branchId: Number(branchId),
			category: categoryData,
		},
		{ skip: !branchId || !categoryData }
	)

	const { data: servicesByMasterData } = useGetServiceCategoryQuery(
		{
			category: categoryData,
		},
		{ skip: !categoryData }
	)

	const [deleteCategoryService, { isLoading, error: errorDelete }] =
		useDeleteCategoryServiceMutation()

	const [deleteModal, setDeleteModal] = useState(false)
	const [deleteId, setDeleteId] = useState<number>(0)
	const [editId, setEditId] = useState<null | number>(null)

	const [validation, setValidation] = useState(true)
	const [dataServices, setDataServices] = useState<DataService>({
		name: '',
		price: 0,
		duration: 30,
		description: '',
		image: '',
		type: false,
		branchId: 0,
		categoryId: 1,
	})

	const handleClose = () => {
		setDataServices({
			name: '',
			price: 0,
			duration: 30,
			description: '',
			image: '',
			type: false,
			branchId: 0,
			categoryId: 0,
		})
	}

	const [modal, setModal] = useState({
		add: false,
		edit: false,
		sub: false,
	})

	useEffect(() => {
		setValidation(
			dataServices.name === '' ? true : dataServices.price === 0 ? true : false
		)
	}, [dataServices])

	const handleDelete = (id: any) => {
		setDeleteId(id)
		setDeleteModal(true)
	}

	const handleUpdateModal = (service: ServiceResponse, subId: number) => {
		setModal((prev: any) => {
			return {
				...prev,
				edit: true,
			}
		})
		setDataServices({ ...dataServices, ...service })
		setEditId(service.id)
	}

	async function handleSuccessDelete() {
		try {
			const result = await deleteCategoryService({
				servicesId: deleteId,
			})

			if ('error' in result) {
				throw new Error(
					result.error?.data?.message || 'Произошла ошибка при удалении.'
				)
			}

			setDeleteModal(false)
			toast.success('Успешно удалено!')
		} catch (error: any) {
			console.error(error)
			setDeleteModal(false)
			toast.error(error.message || 'Произошла ошибка!')
		}
	}

	const handleAddCategoryService = (id: number) => {
		setModal((prev: any) => {
			return {
				...prev,
				sub: true,
			}
		})
		setDataServices({ ...dataServices, categoryId: id })
	}

	return (
		<div className="w-full h-full">
			<Backdrop sx={isLoadingSx} open={isLoading}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<DeleteModal
				active={deleteModal}
				handleClose={() => setDeleteModal(false)}
				handleTrueClick={handleSuccessDelete}
				title="Удаление услуги"
			/>

			<AddService
				active={modal.add}
				title="Добавление услуги"
				handleClose={() => {
					setModal({ ...modal, add: false })
					handleClose()
				}}
				dataServices={dataServices}
				setDataServices={setDataServices}
				services={servicesByMasterData}
				validation={validation}
				branchId={branchId ? Number(branchId) : 0}
			/>

			<EditService
				active={modal.edit}
				title="Добавить услуги"
				handleClose={() => {
					setModal({ ...modal, edit: false })
					handleClose()
				}}
				dataServices={dataServices}
				setDataServices={setDataServices}
				services={servicesByMasterData}
				branchId={branchId}
				editId={editId}
				validation={validation}
			/>
			<SubService
				active={modal.sub}
				title="Добавить услуги"
				handleClose={() => {
					setModal({ ...modal, sub: false })
					handleClose()
				}}
				dataServices={dataServices}
				setDataServices={setDataServices}
				branchId={branchId}
				validation={validation}
			/>
			<Flex justify="space-between">
				<StyledTitle>Услуги</StyledTitle>
				<Button onClick={() => setModal({ ...modal, add: true })} width="150px">
					Добавить
				</Button>
			</Flex>
			{Array.isArray(servicesByMaster) && servicesByMaster.length > 0 ? (
				<ServicesAccordion
					data={servicesByMaster}
					onDeleteService={handleDelete}
					onAddCategoryService={handleAddCategoryService}
					onUpdateCategory={handleUpdateModal}
				/>
			) : (
				<p
					style={{
						textAlign: 'center',
						color: '#888',
						marginTop: '20px',
						fontSize: '16px',
					}}
				>
					Нет услуг
				</p>
			)}
		</div>
	)
}
