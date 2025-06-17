import { useEffect, useState } from 'react'
import { ModalComponent } from '../../../../components/UI/Modal/Modal'
import {
	calculateEndTime,
	countDuration,
	desctructWeek,
	TranslateAppointmentStatus,
	translateDuration,
	TranslateWeekShort,
} from '../../../../shared/lib/helpers/helpers'
import { startOfWeek, addDays } from 'date-fns'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { ROLES, TypeMonth } from '../../../../shared/lib/constants/constants'
import { DoubleScrollTimePicker } from '../../../../components/shared/double-time-picker'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { InoiSelect } from '../../../../components/UI/select'
import {
	useGetMasterQuery,
	useGetMasterServicesSelectQuery,
} from '../../../../store/services/master.service'
import { InoiMultiSelect } from '../../../../components/shared/multi-select'
import { TextArea } from '../../../../components/UI/Inputs/TextArea/TextArea'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { usePutAppointmentDataMutation } from '../../../../store/services/calendar.service'
import { APPOINTMENT_STATUS } from '../../../../shared/lib/constants/constants'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

interface EditProps {
	active: boolean
	handleClose: () => void
	data: any
	onSuccess?: () => void
}

export const EditModal = ({
	active,
	handleClose,
	data,
	onSuccess,
}: EditProps) => {
	const { role } = useSelector((state: RootState) => state.auth)
	const { individualData } = useSelector((state: RootState) => state.individual)
	const { branchAdminMasterJwt } = useSelector(
		(state: RootState) => state.branch
	)

	const lox =
		role === ROLES.PERSONAl_MASTER
			? individualData?.branchId
			: branchAdminMasterJwt?.branchId

	const [putAppointmentData] = usePutAppointmentDataMutation()

	const { data: dataMaster = [], refetch: refetchMaster } = useGetMasterQuery(
		{ branchId: lox },
		{ skip: !lox }
	)

	const { data: dataMasterByServiceSelect } = useGetMasterServicesSelectQuery(
		{ masterId: data?.master?.id },
		{ skip: !data?.master?.id }
	)

	const [scrollPicker, setScrollPicker] = useState(false)
	const [loading, setLoading] = useState(false)
	const [validationAppointments, setValidationAppointments] =
		useState<boolean>(true)
	const [editState, setEditState] = useState<any>({
		masterId: null,
		serviceIds: [],
		appointmentStatus: '',
		startDate: new Date(),
		startTime: '',
		endTime: '',
		description: '',
	})

	useEffect(() => {
		if (data) {
			setEditState({
				masterId: {
					name: `${data?.master?.firstName} ${data?.master?.lastName}`,
					value: data?.master?.id,
				},
				startTime: data?.startTime?.split('T')[1],
				endTime: data?.endTime?.split('T')[1],
				serviceIds: data?.services?.map((item: any) => item.id),
				appointmentStatus: {
					name: TranslateAppointmentStatus(data?.appointmentStatus),
					value: data?.appointmentStatus,
				},
				description: data?.description,
				startDate: new Date(data?.startTime),
			})
			setCurrentWeekStart(
				startOfWeek(new Date(data?.startTime), { weekStartsOn: 1 })
			)
		}
	}, [active])

	const [currentWeekStart, setCurrentWeekStart] = useState(
		startOfWeek(new Date(), { weekStartsOn: 1 })
	)

	function prevWeek() {
		setCurrentWeekStart((prev) => addDays(prev, -7))
	}

	function nextWeek() {
		setCurrentWeekStart((prev) => addDays(prev, 7))
	}

	const handlePut = async () => {
		try {
			setLoading(true)
			const response: any = await putAppointmentData({
				appointmentId: data?.id,
				appointmentData: {
					masterId: editState.masterId.value,
					serviceIds: editState.serviceIds,
					startTime: editState.startTime,
					endTime: editState.endTime,
					description: editState.description,
					appointmentStatus: editState.appointmentStatus.value,
					startDate: editState.startDate,
				},
			})
			if (response['data']) {
				toast.success('Запись успешно изменена!')
				onSuccess?.()
			}
			if (response['error']) {
				toast.error(response?.error?.data?.message || 'Произошла ошибка!')
			}
		} catch (error) {
			toast.error('Произошла ошибка!')
		} finally {
			setLoading(false)
			handleClose()
		}
	}

	useEffect(() => {
		const isInvalid =
			editState.masterId === null ||
			editState.masterId === '' ||
			editState.serviceIds.length === 0 ||
			editState.startDate === '' ||
			editState.startTime === '' ||
			editState.endTime === ''

		setValidationAppointments(isInvalid)
	}, [editState, active])

	return (
		<ModalComponent
			active={active}
			handleClose={handleClose}
			title={`Редактировать запись №${data?.id}`}
		>
			{scrollPicker && (
				<DoubleScrollTimePicker
					active={scrollPicker}
					handleClose={() => setScrollPicker(false)}
					title="Редактирование"
					startSelectedTime={editState.startTime.slice(0, 5)}
					endSelectedTime={editState.endTime.slice(0, 5)}
					setSelectedTimes={(times: any) =>
						setEditState({
							...editState,
							startTime: times.startTime + ':00',
							endTime: times.endTime + ':00',
						})
					}
				/>
			)}
			<div className="flex flex-col gap-[10px] w-[360px]">
				<div className="sm:w-full">
					<p className="text-md font-[500] noselect text-center">
						{
							TypeMonth[
								Number(
									currentWeekStart.toISOString().split('T')[0].split('-')[1]
								) - 1
							]
						}
					</p>
					<div className="flex items-center gap-2 mt-2">
						<IoIosArrowBack
							size={26}
							onClick={prevWeek}
							className="cursor-pointer sm:scale-75 min-w-[20px]"
						/>
						<div className="w-full flex items-center justify-between gap-2">
							{desctructWeek(currentWeekStart)?.map(
								(dayInfo: any, index: number) => {
									const isToday =
										dayInfo.date ===
										editState.startDate?.toISOString().split('T')[0]
									return (
										<div
											className={`${
												isToday && 'bg-myviolet text-white shadow'
											} w-8 h-11 rounded-md cursor-pointer flex flex-col items-center justify-center`}
											key={index}
											onClick={() =>
												setEditState({
													...editState,
													startDate: new Date(dayInfo.date),
												})
											}
										>
											<div className=" noselect">
												{TranslateWeekShort(dayInfo.dayOfWeek)}
											</div>
											<div className="noselect">{dayInfo.dayNumber}</div>
										</div>
									)
								}
							)}
						</div>
						<IoIosArrowForward
							size={26}
							onClick={nextWeek}
							className="cursor-pointer sm:scale-75 min-w-[20px]"
						/>
					</div>
				</div>
				<div>
					<div className="w-full flex justify-evenly">
						<p>Начало</p>
						<p>Конец</p>
					</div>
					<div
						onClick={() => setScrollPicker(true)}
						className="w-full flex items-center justify-evenly border-[1px] border-[#D8DADC] border-solid rounded-[8px] h-8 text-[17px] hover:bg-gray-50 active:bg-gray-50 cursor-pointer"
					>
						<p>{editState.startTime.slice(0, 5)}</p>
						<p>{editState.endTime.slice(0, 5)}</p>
					</div>
				</div>
				{role !== ROLES.PERSONAl_MASTER && (
					<InoiSelect
						title="Специалист"
						required
						placeholder="Выберите Специалиста"
						value={editState.masterId?.name}
						options={dataMaster?.map((item: any) => {
							return {
								value: item.id,
								name: `${item.firstName} ${item.lastName || ''}`,
							}
						})}
						setValue={(e: any) => {
							setEditState({
								...editState,
								masterId: {
									name: e?.name,
									value: e.value,
								},
							})
						}}
					/>
				)}
				<InoiMultiSelect
					title="Услуги"
					required
					placeholder="Выберите услуги"
					value={dataMasterByServiceSelect
						?.map((item: any) => {
							if (editState.serviceIds.includes(item.id)) {
								return {
									value: item.id,
									label: `${item?.name} ${translateDuration(item.duration)} ${item.price} сом`,
								}
							}
							return null
						})
						?.filter(Boolean)}
					options={dataMasterByServiceSelect?.filter(
						(item: any) => !editState.serviceIds.includes(item.id)
					)}
					renderOption={(item: any) =>
						`${item?.name} ${translateDuration(item.duration)} ${item.price} сом`
					}
					setValue={(e: any) => {
						const copy = [...editState.serviceIds]
						copy.push(e.id)
						const endTime = calculateEndTime(
							editState.startTime,
							countDuration(
								dataMasterByServiceSelect?.filter((item: any) =>
									copy.includes(item.id)
								)
							)
						)
						setEditState({
							...editState,
							serviceIds: copy,
							endTime: endTime,
						})
					}}
					clear={() => {
						const today = dayjs().format('YYYY-MM-DD')
						setEditState({
							...editState,
							serviceIds: [],
							endTime: dayjs(
								`${today} ${editState?.startTime}`,
								'YYYY-MM-DD HH:mm:ss'
							)
								.add(30, 'minutes')
								.format('HH:mm'),
						})
					}}
					remove={(id: number) => {
						const newLox = editState?.serviceIds?.filter(
							(item: any) => item !== id
						)
						const endTime = calculateEndTime(
							editState.startTime,
							countDuration(
								dataMasterByServiceSelect?.filter((item: any) =>
									newLox.includes(item.id)
								)
							)
						)
						setEditState({ ...editState, serviceIds: newLox, endTime: endTime })
					}}
				/>
				<InoiSelect
					title="Статус"
					required
					placeholder="Выберите статус"
					value={editState.appointmentStatus?.name}
					options={APPOINTMENT_STATUS?.map((item: any) => {
						return {
							value: item.value,
							name: item.label,
						}
					})}
					setValue={(e: any) => {
						setEditState({ ...editState, appointmentStatus: e })
					}}
				/>
				<TextArea
					label="Комментарий"
					placeholder="Напишите комментарий"
					value={editState.description}
					onChange={(e) => setEditState({ ...editState, description: e })}
				/>
				<div className="flex gap-2">
					<Button
						backgroundColor="white"
						color="var(--myviolet)"
						border="1px solid var(--myviolet)"
						onClick={handleClose}
						disabled={validationAppointments}
					>
						Отмена
					</Button>
					<Button
						onClick={handlePut}
						isLoading={loading}
						disabled={!editState.serviceIds.length}
					>
						Сохранить
					</Button>
				</div>
			</div>
		</ModalComponent>
	)
}
