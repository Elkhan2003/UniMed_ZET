import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Outlet, useLocation } from 'react-router-dom'
import { Button } from '../../../../../../components/UI/Buttons/Button/Button'
import { putAvatarMaster } from '../../../../../../store/features/master-slice'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from 'redux'
import { Skeleton } from '@mui/material'
import styles from './MasterInnerPage.module.css'
import NotUser from '../../../../../../assets/image/noUser.svg'
import { MasterUpdateModal } from '../MasterPage/masterUpdateModal/MasterUpdateModal'
import { RootState } from '../../../../../../store'
import { useDropzone } from 'react-dropzone'
import { useGetMasterByIdQuery } from '../../../../../../store/services/master.service'
import { useLazyGetMasterInfoQuery } from '../../../../../../store/services/master.service'
import { StyledTitle } from '../../../../../../shared/styles'
import { Flex } from 'antd'
import { StyledTabs } from '../../../../../../components/UI/StyledTabs'
import { ScheduleData } from '../../../../../../components/Schedule/ScheduleData'
import { AddSchedule } from '../../../../../../components/Schedule/AddSchedule'
import { COMPENSATION_TYPE } from '../../../../../../shared/lib/constants/constants'

export const MasterInnerPage = () => {
	const { branchAdminMasterJwt } = useSelector(
		(state: RootState) => state.branch
	)

	const { masterID, id } = useParams()
	const { role } = useSelector((state: RootState) => state.auth)

	const {
		data: dataMasterById,
		isLoading: isLoadingMaster,
		refetch,
	} = useGetMasterByIdQuery({ masterId: masterID }, { skip: !masterID })
	const navigate = useNavigate()
	const location = useLocation()

	const activeTab = location.pathname.split('/')[4]

	const handleTabChange = (key: any) => {
		navigate(`${key}`)
	}
	const [getMasterInfo] = useLazyGetMasterInfoQuery()

	const [startDate, setStartDate] = useState(
		getMonday(new Date().toISOString().slice(0, 10))
	)
	const [endDate, setEndDate] = useState(
		getSunday(new Date().toISOString().slice(0, 10))
	)
	const [masterData, setMasterData] = useState({
		firstName: '',
		lastName: '',
		authInfoRequest: {
			phoneNumber: '+996',
			password: '',
		},
		salaryRateRequest: {
			amount: 0,
			compensationType: { label: 'Фиксированный', value: 'FIXED' },
		},
		experience: 0,
	})
	const [descriptionMaster, setDescriptionMaster] = useState<string>('')
	const [masterModal, setMasterModal] = useState({
		masterModalAdd: false,
		masterModalUpdate: false,
	})
	const [validationMaster, setValidationMaster] = useState(true)
	const [masterScheduleModal, setMasterScheduleModal] = useState(false)

	const dispatch = useDispatch()

	useEffect(() => {
		setValidationMaster(
			masterData.firstName === ''
				? true
				: masterData.authInfoRequest.phoneNumber === '+996'
					? true
					: false
		)
	}, [masterData])

	function getMonday(date: string) {
		const inputDate = new Date(date)
		const dayOfWeek = inputDate.getDay()

		if (dayOfWeek === 1) {
			return inputDate.toISOString().slice(0, 10)
		} else {
			const monday = new Date(inputDate)
			monday.setDate(inputDate.getDate() - ((dayOfWeek + 7) % 7) + 1)
			return monday.toISOString().slice(0, 10)
		}
	}

	function getSunday(date: string) {
		const inputDate = new Date(date)
		const dayOfWeek = inputDate.getDay()
		if (dayOfWeek === 0) {
			return inputDate.toISOString().slice(0, 10)
		} else {
			const sunday = new Date(inputDate)
			const daysUntilNextSunday = 7 - dayOfWeek
			sunday.setDate(inputDate.getDate() + daysUntilNextSunday)
			return sunday.toISOString().slice(0, 10)
		}
	}

	async function handleUpdate() {
		setMasterModal({
			masterModalAdd: false,
			masterModalUpdate: true,
		})
		if (dataMasterById) {
			const response = await getMasterInfo({ masterId: dataMasterById.id })
			setMasterData({
				firstName: dataMasterById.firstName,
				lastName: dataMasterById.lastName,
				authInfoRequest: {
					phoneNumber: response.data.phoneNumber,
					password: '',
				},
				salaryRateRequest: {
					amount: Number(response?.data?.salaryRate?.amount),
					compensationType: {
						label: COMPENSATION_TYPE.filter(
							(item: any) =>
								item.value === response.data.salaryRate.compensationType
						)[0].label,
						value: response.data.salaryRate.compensationType,
					},
				},
				experience: dataMasterById.experience,
			})
			setDescriptionMaster(dataMasterById.description)
		}
	}

	const TabsValue = [
		{
			value: 'Визиты',
			to: 'appoinments',
		},
		{
			value: 'Услуги',
			to: 'service',
		},
		{
			value: 'Специальность',
			to: 'specialization',
		},
		{
			value: 'Отзывы',
			to: 'rewievs',
		},
		{
			value: 'О Специалисте',
			to: 'about-master',
		},
		{
			value: 'Доступ',
			to: 'privilage',
		},
	]

	const onDrop = useCallback(
		async (acceptedFiles: any) => {
			await dispatch(
				putAvatarMaster({
					masterID,
					avatar: acceptedFiles[0],
				}) as unknown as AnyAction
			)
			await refetch()
		},
		[dispatch, refetch, masterID]
	)

	const { getRootProps, getInputProps } = useDropzone({ onDrop })

	const [slots, setSlots] = useState({})

	return (
		<div className="w-full bg-white p-[20px] min-h-[calc(100vh-45px)]">
			<MasterUpdateModal
				masterModal={masterModal}
				setMasterModal={setMasterModal}
				masterData={masterData}
				setMasterData={setMasterData}
				masterId={masterID}
				validationMaster={validationMaster}
				descriptionMaster={descriptionMaster}
				setDescriptionMaster={setDescriptionMaster}
				refetch={refetch}
			/>
			<AddSchedule
				open={masterScheduleModal}
				entityId={Number(masterID) || 0}
				entityType={'MASTER'}
				close={() => {
					setMasterScheduleModal(false)
				}}
				slots={slots}
			/>
			<div className="flex flex-col gap-[20px] ">
				<Flex justify="space-between">
					<StyledTitle>
						<span
							onClick={() =>
								navigate(
									role === 'ADMIN'
										? `/${branchAdminMasterJwt?.branchId}/masters`
										: `/affiliate/${id}/masters`
								)
							}
							className="underline cursor-pointer "
						>
							Специалисты
						</span>{' '}
						| График работы
					</StyledTitle>
					<Flex gap={10}>
						<Button
							width="170px"
							borderRadius="16px"
							onClick={() => setMasterScheduleModal(true)}
						>
							Создать график
						</Button>
						<Button
							width="236px"
							borderRadius="16px"
							onClick={() => handleUpdate()}
						>
							Редактировать профиль
						</Button>
					</Flex>
				</Flex>

				<Flex align="center" className="w-full" gap={10}>
					<Flex
						className="w-fit min-w-[200px]"
						vertical
						align="center"
						justify="center"
					>
						<div className={styles.container_master_avatar} {...getRootProps()}>
							<input className={styles.container_image} {...getInputProps()} />
							<img
								className={styles.container_master_image}
								src={isLoadingMaster ? NotUser : dataMasterById?.avatar}
								alt=""
							/>
						</div>
						<Flex vertical justify="center" align="center" className="w-full">
							{isLoadingMaster ? (
								<Skeleton
									variant="rectangular"
									width={
										window.innerWidth < 769
											? 150
											: window.innerWidth < 450
												? 50
												: 200
									}
									sx={{ borderRadius: '6px' }}
								/>
							) : (
								<>
									<p className="text-[18px]">{dataMasterById?.firstName}</p>
									<p className="text-[18px]">{dataMasterById?.lastName}</p>
								</>
							)}
							{isLoadingMaster ? (
								<Skeleton
									variant="rectangular"
									width={
										window.innerWidth < 769
											? 80
											: window.innerWidth < 450
												? 50
												: 140
									}
									sx={{ borderRadius: '6px' }}
								/>
							) : (
								<p className="text-[16px]">{dataMasterById?.phoneNumber}</p>
							)}
						</Flex>
					</Flex>
					<ScheduleData
						branchId={Number(masterID)}
						entity="MASTER"
						setModal={setMasterScheduleModal}
						setSlots={setSlots}
					/>
				</Flex>
				<div>
					<StyledTabs defaultActiveKey={activeTab} onChange={handleTabChange}>
						{TabsValue.map((tab) => (
							<StyledTabs.TabPane tab={tab.value} key={tab.to} />
						))}
					</StyledTabs>
					<Outlet />
				</div>
			</div>
		</div>
	)
}
