import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AnyAction } from '@reduxjs/toolkit'
import { useDropzone } from 'react-dropzone'
import { Skeleton } from '@mui/material'
import styles from './style.module.css'
import { LayoutContent } from '../../../../components/UI/LayoutContent'
import { StyledTabs } from '../../../../components/UI/StyledTabs'
import { ScheduleData } from '../../../../components/Schedule/ScheduleData'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { AddSchedule } from '../../../../components/Schedule/AddSchedule'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { OWNER_ROUTES } from '../../../../shared/lib/constants/routes'
import { EditAffilate } from '../../edit/affiliate'
import { useGetUnitsQuery } from '../../../../store/services/branch.service'
import toast from 'react-hot-toast'
import { postBranchesImage } from '../../../../store/features/branchWork-slice'
import { useGetSingleBranchQuery } from '../../../../store/services/single.branch.service'

export const InnerAffiliatePage = () => {
	const params = useParams()
	console.log(params)
	const {
		data: singleBranch,
		isLoading: isLoadingBranch,
		refetch,
	} = useGetSingleBranchQuery(Number(params.id))

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { pathname } = useLocation()
	const activeTab = pathname.split('/')[3]
	const { data: Units = [] } = useGetUnitsQuery()

	const [openModal, setOpenModal] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

	const onDrop = useCallback(
		async (acceptedFiles: any) => {
			if (acceptedFiles.length !== 0) {
				await dispatch(
					postBranchesImage({
						branchId: Number(params.id),
						workImageLinks: acceptedFiles[0],
					}) as unknown as AnyAction
				)
				refetch()
			} else {
				toast.error('Только одну можно фото загрузить')
			}
		},
		[dispatch, params.id]
	)

	const { getRootProps, getInputProps } = useDropzone({ onDrop })

	const TabsValue = [
		{
			value: 'Админы',
			to: 'admins',
		},
		{
			value: 'Специалисты',
			to: 'masters',
		},
		{
			value: 'Услуги',
			to: 'services',
		},
		{
			value: 'Удобства',
			to: 'facilities',
		},
		{
			value: 'Наши работы',
			to: 'ourworks',
		},
		{
			value: 'Баннер',
			to: 'sample',
		},
	]
	const handleTabChange = (key: any) => {
		navigate(key)
	}

	const close = () => {
		setOpenModal(!openModal)
	}

	const handlePrev = () => {
		navigate('/affiliate')
	}

	const handleAddBranch = () => {
		navigate(OWNER_ROUTES.AFFILIATECREATE.path)
	}

	const address = singleBranch?.addresses?.find(
		(item: any) =>
			item.geographicUnitType === 'RESIDENTIAL_AREA' ||
			item.geographicUnitType === 'ADDRESS'
	)

	const [slots, setSlots] = useState({})

	return (
		<div className="w-full bg-white min-h-[calc(100vh-45px)] overflow-auto">
			<LayoutContent style={{ paddingTop: '0' }}>
				<section
					className="flex justify-between items-center h-[84px] mb-3 pb-3 pt-2"
					style={{ borderBottom: '1px solid #D8DADC' }}
				>
					<h1 className="text-2xl font-medium">Филиалы</h1>
				</section>

				<section className="flex w-full justify-between items-center gap-2.5 text-sm font-medium mb-[19px]">
					<div
						className="flex items-center cursor-pointer gap-2.5"
						onClick={handlePrev}
					>
						<ArrowBackIcon />
						<span>Назад</span>
					</div>
					<div className={styles.action_wrapper}>
						<Button
							minWidth="140px"
							borderRadius="16px"
							onClick={() => setOpenModal(!openModal)}
						>
							Создать график
						</Button>
						<Button
							minWidth="226px"
							borderRadius="16px"
							onClick={() => setIsOpen(true)}
						>
							Редактировать филиал
						</Button>
					</div>
					<AddSchedule
						open={openModal}
						entityId={Number(params?.id) || 0}
						entityType={'BRANCH'}
						close={close}
						slots={slots}
					/>
					<EditAffilate
						onSuccess={() => refetch()}
						isOpen={Boolean(isOpen)}
						setIsOpen={setIsOpen}
						Units={Units}
						branchId={singleBranch?.id}
					/>
				</section>

				<div className={styles.container_main_master_inner_page}>
					<article style={{ minWidth: 'fit-content' }}>
						<h1 className="text-xl font-medium text-[#101010] mb-5 max-w-[400px]">
							{address?.name}
						</h1>
						<div className="flex flex-col gap-2">
							{isLoadingBranch ? (
								<Skeleton
									variant="rectangular"
									width={150}
									height={150}
									sx={{ borderRadius: '50%' }}
								/>
							) : (
								<div
									className={styles.container_master_avatar}
									{...getRootProps()}
								>
									<input
										className={styles.container_image}
										{...getInputProps()}
									/>
									<img
										className={styles.container_master_image}
										src={singleBranch?.image}
										alt="No user"
									/>
								</div>
							)}

							<div className={styles.master_fullname_title}>
								<div className="mt-2">
									<div className="block text-base font-medium">
										{isLoadingBranch ? (
											<Skeleton
												variant="rectangular"
												width={200}
												sx={{ borderRadius: '6px' }}
											/>
										) : (
											`Телефон: ${singleBranch?.phoneNumber}`
										)}
									</div>
									{singleBranch?.addresses && (
										<>
											{isLoadingBranch ? (
												<Skeleton
													variant="rectangular"
													width={200}
													sx={{ borderRadius: '6px', mt: 1 }}
												/>
											) : (
												<span className="block text-base font-medium max-w-[300px]">
													Адрес:{' '}
													{singleBranch.addresses
														.filter(
															(item: any) =>
																item.geographicUnitType === 'DISTRICT'
														)
														.map((item: any) => item.name)
														.join(', ')}{' '}
													{singleBranch.addresses
														.filter(
															(item: any) =>
																item.geographicUnitType === 'ADDRESS' ||
																item.geographicUnitType === 'RESIDENTIAL_AREA'
														)
														.map((item: any) => item.name)
														.join(', ')}
												</span>
											)}
											{isLoadingBranch ? (
												<Skeleton
													variant="rectangular"
													width={200}
													sx={{ borderRadius: '6px', mt: 1 }}
												/>
											) : (
												<span className="block text-base font-medium">
													Страна:{' '}
													{singleBranch.addresses
														.filter(
															(item: any) =>
																item.geographicUnitType === 'COUNTRY'
														)
														.map((item: any) => item.name)
														.join(', ')}{' '}
													{singleBranch.addresses
														.filter(
															(item: any) =>
																item.geographicUnitType === 'REGION'
														)
														.map((item: any) => item.name)
														.join(', ')}
												</span>
											)}
										</>
									)}
								</div>
							</div>
						</div>
					</article>
					<ScheduleData
						entity="BRANCH"
						branchId={Number(params.id)}
						setSlots={setSlots}
						setModal={setOpenModal}
					/>
				</div>
				<div>
					<StyledTabs defaultActiveKey={activeTab} onChange={handleTabChange}>
						{TabsValue.map((tab) => (
							<StyledTabs.TabPane tab={tab.value} key={tab.to} />
						))}
					</StyledTabs>
					<Outlet />
				</div>
			</LayoutContent>
		</div>
	)
}
