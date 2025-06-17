import { ModalComponent } from '../../../UI/Modal/Modal'
import { DoubleScrollTimePicker } from '../../../shared/double-time-picker'
import { useEffect, useState } from 'react'
import { InoiSearchSelect } from '../../../shared/search-select'
import { useGetUserAdminSelectQuery } from '../../../../store/services/user.service'
import {
	calculateEndTime,
	countDuration,
} from '../../../../shared/lib/helpers/helpers'
import {
	useGetMasterQuery,
	useGetMasterServicesSelectQuery,
} from '../../../../store/services/master.service'
import { translateDuration } from '../../../../shared/lib/helpers/helpers'
import { InoiMultiSelect } from '../../../shared/multi-select'
import { TextArea } from '../../../UI/Inputs/TextArea/TextArea'
import {
	APPOINTMENT_STATUS,
	ROLES,
} from '../../../../shared/lib/constants/constants'
import { InoiSelect } from '../../../UI/select'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { usePostAppointmentAdminOrMasterMutation } from '../../../../store/services/calendar.service'
import { toast } from 'react-hot-toast'
import { Button } from '../../../UI/Buttons/Button/Button'
import dayjs from 'dayjs'
import { useGetUsersSelect } from '../../../../shared/queries/users'

interface CreateModalProps {
	active: boolean
	handleClose: () => void
	data?: Data | null
	setCreateUser: (active: boolean) => void
}

interface Data {
	startTime: string
	endTime: string
	startDate: string
	master: {
		masterId: { name: string; masterId: string }
		startTime: string
		endTime: string
		freeTimes: {
			startTime: string
			endTime: string
		}[]
		breaks: {
			startTime: string
			endTime: string
		}[]
	}
}

export const CreateModal = ({
	active,
	handleClose,
	data,
	setCreateUser,
}: CreateModalProps) => {
	const { role } = useSelector((state: RootState) => state.auth)
	const { individualData } = useSelector((state: RootState) => state.individual)
	const { branchAdminMasterJwt } = useSelector(
		(state: RootState) => state.branch
	)

	const [postAppointmentAdminOrMaster] =
		usePostAppointmentAdminOrMasterMutation()

	const [searchValue, setSearchValue] = useState('')

	const [createState, setCreateState] = useState({
		masterId: { name: '', masterId: '' },
		serviceIds: [] as number[],
		notifiedTime: 'NONE',
		startDate: '',
		startTime: '',
		endTime: '',
		description: '',
		appointmentStatus: { value: 'CONFIRMED', name: 'Подтвержден' },
		userId: '',
		username: '',
		lastname: '',
		promocode: '',
		phoneNumber: '',
	})

	const { data: clients, refetch } = useGetUsersSelect({
		search: searchValue,
		enabled: active === true,
	})

	const { data: dataMasterByServiceSelect } = useGetMasterServicesSelectQuery(
		{ masterId: createState.masterId?.masterId },
		{ skip: !createState.masterId?.masterId }
	)
	const [scrollPicker, setScrollPicker] = useState(false)

	const lox =
		role === ROLES.PERSONAl_MASTER
			? individualData?.branchId
			: branchAdminMasterJwt?.branchId

	const { data: dataMaster = [] } = useGetMasterQuery(
		{ branchId: lox },
		{ skip: !lox }
	)

	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (data) {
			setCreateState({
				...createState,
				masterId: data?.master?.masterId,
				startTime: data?.startTime || '',
				endTime: data?.endTime || '',
			})
		}
	}, [data, active])

	async function handlePost() {
		if (data) {
			const { startTime, endTime, startDate } = data

			if (startTime && endTime) {
				setLoading(true)
				const appointmentDataMasterView = {
					masterId: createState.masterId?.masterId,
					serviceIds: createState.serviceIds,
					notifiedTime: createState.notifiedTime,
					startDate: startDate,
					startTime: createState.startTime,
					endTime: createState.endTime,
					description: createState.description,
					appointmentStatus: createState.appointmentStatus?.value,
					userId: createState.userId,
				}

				const message: any = await postAppointmentAdminOrMaster({
					postData: appointmentDataMasterView,
				})
				if (message['error']) {
					toast.error(message?.error?.data?.message)
				} else {
					toast.success('Запись успешна создана!')
				}
				refetch()
				handleClose()
				setCreateState({
					masterId: { name: '', masterId: '' },
					serviceIds: [] as number[],
					notifiedTime: 'NONE',
					startDate: '',
					startTime: '',
					endTime: '',
					description: '',
					appointmentStatus: { value: 'CONFIRMED', name: 'Подтвержден' },
					userId: '',
					username: '',
					lastname: '',
					promocode: '',
					phoneNumber: '',
				})
				setSearchValue('')
				setLoading(false)
			} else {
				toast.error('Нет свободного времени на эту услугу')
			}
		} else {
			console.error('Data is null')
		}
	}

	return (
		<ModalComponent
			active={active}
			handleClose={handleClose}
			title="Создать запись"
		>
			<div className="w-[400px] h-fit flex flex-col gap-[15px]">
				{scrollPicker && (
					<DoubleScrollTimePicker
						active={scrollPicker}
						handleClose={() => setScrollPicker(false)}
						title="Редактирование"
						startSelectedTime={createState.startTime.slice(0, 5)}
						endSelectedTime={createState.endTime.slice(0, 5)}
						setSelectedTimes={(times: any) =>
							setCreateState({
								...createState,
								startTime: times.startTime + ':00:00',
								endTime: times.endTime + ':00:00',
							})
						}
					/>
				)}
				<div>
					<div className="w-full flex justify-evenly">
						<p>Начало</p>
						<p>Конец</p>
					</div>
					<div
						onClick={() => setScrollPicker(true)}
						className="w-full flex items-center justify-evenly border-[1px] border-[#D8DADC] border-solid rounded-[8px] h-8 text-[17px] hover:bg-gray-50 active:bg-gray-50 cursor-pointer"
					>
						<p>{createState?.startTime?.slice(0, 5)}</p>
						<p>{createState?.endTime?.slice(0, 5)}</p>
					</div>
				</div>
				<InoiSearchSelect
					placeholder="Выберите клиента"
					title="Клиент"
					options={
						clients?.map((item: any) => {
							return {
								value: item.id,
								label: `${item?.firstName} ${item?.lastName || ''}`,
							}
						}) || []
					}
					value={searchValue}
					setValue={(e: any) => {
						setCreateState({
							...createState,
							userId: e.value,
						})
						setSearchValue(e.label)
					}}
					setSearchValue={setSearchValue}
					renderOption={(item: any) => item.label}
				/>
				{role !== ROLES.PERSONAl_MASTER && (
					<InoiSelect
						title="Специалист"
						required
						placeholder="Выберите Специалиста"
						value={createState.masterId?.name}
						options={
							dataMaster?.map((item: any) => {
								return {
									value: item.id,
									name: `${item?.firstName} ${item?.lastName || ''}`,
								}
							}) || []
						}
						setValue={(e: any) => {
							setCreateState({
								...createState,
								masterId: { name: e?.name || '', masterId: e?.value || '' },
								serviceIds:
									createState?.masterId?.masterId !== e.value
										? []
										: createState.serviceIds,
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
							if (createState.serviceIds?.includes(item.id)) {
								return {
									value: item.id,
									label: `${item?.name} ${translateDuration(item.duration)} ${item.price} сом`,
								}
							}
							return null
						})
						?.filter(Boolean)}
					options={
						dataMasterByServiceSelect?.filter(
							(item: any) => !createState.serviceIds?.includes(item.id)
						) || []
					}
					renderOption={(item: any) =>
						`${item?.name} ${translateDuration(item.duration)} ${item.price} сом`
					}
					setValue={(e: any) => {
						const copy = [...createState?.serviceIds]
						copy.push(e.id)
						const endTime = calculateEndTime(
							createState.startTime,
							countDuration(
								dataMasterByServiceSelect?.filter((item: any) =>
									copy?.includes(item.id)
								)
							)
						)
						setCreateState({
							...createState,
							serviceIds: copy,
							endTime: endTime,
						})
					}}
					clear={() => {
						const today = dayjs().format('YYYY-MM-DD')
						setCreateState({
							...createState,
							serviceIds: [],
							endTime: dayjs(
								`${today} ${createState?.startTime}`,
								'YYYY-MM-DD HH:mm:ss'
							)
								.add(30, 'minutes')
								.format('HH:mm'),
						})
					}}
					remove={(id: number) => {
						const newLox = createState?.serviceIds?.filter(
							(item: any) => item !== id
						)
						const endTime = calculateEndTime(
							createState.startTime,
							countDuration(
								dataMasterByServiceSelect?.filter((item: any) =>
									newLox?.includes(item.id)
								)
							)
						)
						setCreateState({
							...createState,
							serviceIds: newLox,
							endTime: endTime,
						})
					}}
				/>
				<InoiSelect
					title="Статус"
					required
					placeholder="Выберите статус"
					value={createState.appointmentStatus?.name}
					options={APPOINTMENT_STATUS?.map((item: any) => {
						return {
							value: item.value,
							name: item.label,
						}
					})}
					setValue={(e: any) => {
						setCreateState({ ...createState, appointmentStatus: e })
					}}
				/>
				<TextArea
					label="Комментарий"
					placeholder="Напишите комментарий"
					value={createState.description}
					onChange={(e) => setCreateState({ ...createState, description: e })}
				/>
				<div className="flex gap-2 items-center justify-end">
					<p
						onClick={() => setCreateUser(true)}
						className="text-[14px] text-myviolet w-full text-left cursor-pointer"
					>
						Добавить клиента
					</p>
					<Button width="120px" onClick={handleClose}>
						Отмена
					</Button>
					<Button
						onClick={handlePost}
						disabled={
							loading ||
							createState.serviceIds?.length === 0 ||
							createState.userId === '' ||
							(role !== ROLES.PERSONAl_MASTER &&
								createState.masterId?.masterId === '')
						}
						width="150px"
						isLoading={loading}
					>
						Сохранить
					</Button>
				</div>
			</div>
		</ModalComponent>
	)
}
