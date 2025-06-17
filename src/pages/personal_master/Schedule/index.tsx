import { useCallback, useEffect, useState } from 'react'
import { Button } from '../../../components/UI/Buttons/Button/Button'
import { putAvatarMaster } from '../../../store/features/master-slice'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from 'redux'
import { Backdrop, CircularProgress } from '@mui/material'
import { MasterUpdateModal } from '../../owner/affiliate/inner/Master/MasterPage/masterUpdateModal/MasterUpdateModal'
import { useDropzone } from 'react-dropzone'
import { LayoutContent } from '../../../components/UI/LayoutContent'
import { Flex } from 'antd'
import { StyledTitle } from '../../../shared/styles'
import { RootState } from '../../../store'
import { AddSchedule } from '../../../components/Schedule/AddSchedule'
import { ScheduleData } from '../../../components/Schedule/ScheduleData'
import { isLoadingSx } from '../../../shared/lib/constants/constants'
import { useGetMasterByIdQuery } from '../../../store/services/master.service'

export default function PersonalSchedule() {
	const { individualData } = useSelector((state: RootState) => state.individual)
	const masterID = individualData?.masterId || 0
	const isLoading = false

	const {
		data: dataMasterById,
		isLoading: isLoadingMaster,
		refetch,
	} = useGetMasterByIdQuery({ masterId: masterID }, { skip: !masterID })

	useEffect(() => {
		if (dataMasterById) {
			refetch()
		}
	}, [refetch])

	const [loading, setLoading] = useState(false)

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
		experience: {
			label: '1 год',
			value: 1,
		},
	})
	const [descriptionMaster, setDescriptionMaster] = useState<string>('')
	const [masterModal, setMasterModal] = useState({
		masterModalAdd: false,
		masterModalUpdate: false,
	})
	const [validationMaster, setValidationMaster] = useState(true)
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

	async function handleUpdate() {
		setMasterModal({
			masterModalAdd: false,
			masterModalUpdate: true,
		})
		if (dataMasterById) {
			setMasterData({
				firstName: dataMasterById.firstName,
				lastName: dataMasterById.lastName,
				authInfoRequest: {
					phoneNumber: dataMasterById.phoneNumber,
					password: '',
				},
				salaryRateRequest: {
					amount: 0,
					compensationType: { label: 'Фиксированный', value: 'FIXED' },
				},
				experience: dataMasterById.experience,
			})
			setDescriptionMaster(dataMasterById.description)
		}
	}

	const onDrop = useCallback(
		async (acceptedFiles: any) => {
			setLoading(true)
			try {
				await dispatch(
					putAvatarMaster({
						masterID,
						avatar: acceptedFiles[0],
					}) as unknown as AnyAction
				)
				await refetch()
			} catch (error) {
				console.error('Error while uploading avatar:', error)
			}
			setLoading(false)
		},
		[dispatch, masterID, refetch]
	)

	const { getRootProps, getInputProps } = useDropzone({ onDrop })

	const [modal, setModal] = useState(false)
	const [slots, setSlots] = useState({})

	const close = () => {
		setModal(false)
		setSlots({})
	}

	return (
		<div className="w-full">
			<Backdrop sx={isLoadingSx} open={loading}>
				<CircularProgress color="inherit" />
			</Backdrop>
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
				hide={true}
			/>
			<AddSchedule
				open={modal}
				entityId={individualData?.masterId || 0}
				entityType={'MASTER'}
				close={close}
				slots={slots}
			/>
			<LayoutContent>
				<div className="flex flex-col gap-[20px] ">
					<Flex justify="space-between">
						<StyledTitle>График работы</StyledTitle>
						<Flex gap={10}>
							<Button width="143px" onClick={() => setModal(true)}>
								Создать график
							</Button>
							<Button width="186px" onClick={() => handleUpdate()}>
								Редактировать профиль
							</Button>
						</Flex>
					</Flex>
					<Flex align="center" className="w-full" gap={10}>
						<Flex vertical align="center" gap={10} className="w-[200px]">
							<div
								className="relative w-[150px] h-[150px] rounded-full"
								{...getRootProps()}
							>
								<input
									className="w-[150px] h-[150px] rounded-full"
									{...getInputProps()}
								/>
								{loading || isLoading || isLoadingMaster ? (
									<div className="absolute top-0 left-0 w-[150px] h-[150px] rounded-full bg-gray-300 animate-pulse" />
								) : (
									<img
										className="w-[150px] h-[150px] rounded-full border-[1px] border-gray-300 border-solid object-cover shadow-md"
										src={dataMasterById?.avatar}
										alt={dataMasterById?.firstName}
									/>
								)}
							</div>
							<Flex
								vertical
								align="center"
								className="w-fit text-[14px] myfont"
							>
								<p className="text-[18px] leading-[18px]">
									{dataMasterById?.firstName}
								</p>
								<p className="text-[18px] leading-[19px]">
									{dataMasterById?.lastName}
								</p>
								<p className="mt-2">Стаж: {dataMasterById?.experience} лет</p>
								<p>{dataMasterById?.phoneNumber}</p>
							</Flex>
						</Flex>
						<ScheduleData
							entity="MASTER"
							branchId={individualData?.masterId || 0}
							setSlots={setSlots}
							setModal={setModal}
						/>
					</Flex>
				</div>
			</LayoutContent>
		</div>
	)
}
