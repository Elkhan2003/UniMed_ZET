import { useEffect, useState } from 'react'
import { Flex } from 'antd'
import { ModalComponent } from '../../UI/Modal/Modal'
import { usePostSchedulesMutation } from '../../../store/queries/schedule.service'
import { IBreak, IPostSchedules } from '../../../common/schedules'
import { Button } from '../../UI/Buttons/Button/Button'
import { DAY_OF_WEEK, WEEK } from '../../../shared/lib/constants/constants'
import clsx from 'clsx'
import { MdOutlineArrowForwardIos } from 'react-icons/md'
import { ScrollTimePicker } from '../../shared/time-picker'
import { DeleteOutlined } from '@ant-design/icons'
import { NewDatePicker } from '../../shared/date-picker'
import { Copy } from '../../../assets/icons/Copy'
import { dataControl } from './const '
import toast from 'react-hot-toast'

interface Props {
	open: boolean
	close: () => void
	entityId: number
	entityType: 'MASTER' | 'USER' | 'ADMIN' | 'BRANCH'
	slots: any
}

export const AddSchedule = ({
	open,
	close,
	entityId,
	entityType,
	slots,
}: Props) => {
	const [openTime, setOpenTime] = useState(false)
	const [timeData, setTimeData] = useState({
		time: '00:00',
		title: '',
		index: 0,
		type: 'startTime',
	})
	const [validation, setValidation] = useState(true)
	const [edit, setEdit] = useState({ open: false, mainIndex: 0, innerIndex: 0 })
	const [breakModalsStart, setBreakModalsStart] = useState(false)
	const [breakModalsEnd, setBreakModalsEnd] = useState(false)
	const [breakIndexFor, setBreakIndexFor] = useState(0)
	const [innerIndex, setInnerIndex] = useState(0)
	const [data, setData] = useState<IPostSchedules>(dataControl)

	const [postSchedules, { isLoading }] = usePostSchedulesMutation()

	const handleClose = () => {
		setData(dataControl)
		close()
	}

	const handlePost = async () => {
		try {
			const res: any = await postSchedules({
				...data,
				entityId: entityId,
				entityType: entityType,
			})
			if (res['error']) {
				toast.error(res?.error?.data?.message || 'Произошла ошибка!')
			} else {
				toast.success('График успешно создан')
				handleClose()
			}
		} catch (error: any) {
			toast.error(error?.data?.message || 'Произошла ошибка!')
		}
	}

	const changeWorkingDay = (index: number, workingDay: boolean) => {
		setData((prevData: any) => {
			const updatedDayScheduleRequests = prevData.dayScheduleRequests.map(
				(request: any, idx: any) =>
					idx === index
						? {
								...request,
								workingDay: !workingDay,
								startTime: !workingDay ? request.startTime : '',
								endTime: !workingDay ? request.endTime : '',
								breakRequest: !workingDay ? request.breakRequest : [],
							}
						: request
			)

			return {
				...prevData,
				dayScheduleRequests: updatedDayScheduleRequests,
			}
		})
	}

	const selectSpecificTime = (rev: any) => {
		const updatedDayScheduleRequests = [...data.dayScheduleRequests]
		updatedDayScheduleRequests[timeData.index] = {
			...updatedDayScheduleRequests[timeData.index],
			startTime:
				timeData.type === 'startTime'
					? rev
					: updatedDayScheduleRequests[timeData.index].startTime,
			endTime:
				timeData.type === 'endTime'
					? rev
					: updatedDayScheduleRequests[timeData.index].endTime,
		}
		setData({
			...data,
			dayScheduleRequests: updatedDayScheduleRequests,
		})
	}

	const selectBreakStart = (rev: any) => {
		let breaks
		const updatedDayScheduleRequests = [...data.dayScheduleRequests]
		breaks = [...data.dayScheduleRequests[breakIndexFor].breakRequest]
		breaks[innerIndex] = {
			...breaks[innerIndex],
			startTime: rev,
			comment: '',
			isScheduleBreak: false,
		}

		updatedDayScheduleRequests[breakIndexFor] = {
			...updatedDayScheduleRequests[breakIndexFor],
			breakRequest: breaks,
		}

		setData({
			...data,
			dayScheduleRequests: updatedDayScheduleRequests,
		})
		if (!breaks[innerIndex].endTime) {
			setBreakModalsEnd(true)
		}
	}

	const selectBreakEnd = (rev: any) => {
		let breaks = []
		const updatedDayScheduleRequests = [...data.dayScheduleRequests]
		breaks = [...data.dayScheduleRequests[breakIndexFor].breakRequest]
		breaks[innerIndex] = { ...breaks[innerIndex], endTime: rev }

		updatedDayScheduleRequests[breakIndexFor] = {
			...updatedDayScheduleRequests[breakIndexFor],
			breakRequest: breaks,
		}

		setData({
			...data,
			dayScheduleRequests: updatedDayScheduleRequests,
		})
	}

	const addInterval = (index: number) => {
		setBreakIndexFor(index)
		setInnerIndex(data.dayScheduleRequests[index].breakRequest.length)
		setBreakModalsStart(true)
	}

	const clickChm = (title: string, index: number, type: string) => {
		const res: any = data.dayScheduleRequests[index]
		setTimeData({
			time: res[type],
			title: title,
			index: index,
			type: type,
		})
		setOpenTime(true)
	}

	const clickThm = (index: number, breakIndex: number, type: string) => {
		setBreakIndexFor(index)
		setInnerIndex(breakIndex)
		setBreakModalsEnd(true)
	}

	const clickDhm = (index: number, breakIndex: number, type: string) => {
		setBreakIndexFor(index)
		setInnerIndex(breakIndex)
		setBreakModalsStart(true)
	}

	const closeEdit = () => {
		setEdit({ open: false, mainIndex: 0, innerIndex: 0 })
	}

	const deleteBreak = (index: number, breakIndex: number) => {
		let breaks
		const updatedDayScheduleRequests = [...data.dayScheduleRequests]
		breaks = [
			...data.dayScheduleRequests[breakIndexFor].breakRequest.filter(
				(item: IBreak, index: number) => index !== breakIndex
			),
		]

		updatedDayScheduleRequests[index] = {
			...updatedDayScheduleRequests[index],
			breakRequest: breaks,
		}

		setData({
			...data,
			dayScheduleRequests: updatedDayScheduleRequests,
		})
	}

	const canApplyToAll =
		data.dayScheduleRequests[0].startTime && data.dayScheduleRequests[0].endTime

	function handleApplyToAll() {
		if (!canApplyToAll) return

		const updatedDayScheduleRequests = data.dayScheduleRequests.filter(
			(dayScheduleRequest) =>
				dayScheduleRequest.startTime !== '' && dayScheduleRequest.endTime !== ''
		)

		if (updatedDayScheduleRequests.length === 0) return

		const templateScheduleRequest = updatedDayScheduleRequests[0]

		const updatedDayScheduleResponse = data.dayScheduleRequests.map(
			(dayScheduleRequest) => ({
				...dayScheduleRequest,
				startTime: templateScheduleRequest.startTime,
				endTime: templateScheduleRequest.endTime,
				workingDay: templateScheduleRequest.workingDay,
				breakRequest: templateScheduleRequest.breakRequest.map((breakReq) => ({
					...breakReq,
				})),
			})
		)

		setData({
			...data,
			dayScheduleRequests: updatedDayScheduleResponse,
		})
	}

	useEffect(() => {
		let isValid = true
		data.dayScheduleRequests.forEach((item: any) => {
			if (item.workingDay && item.startTime && item.endTime) {
				isValid = false
			}
		})
		setValidation(isValid)
	}, [data])

	useEffect(() => {
		if (slots && slots?.dayScheduleResponses) {
			const newDayScheduleResponses = DAY_OF_WEEK.map((day) => {
				const found = slots.dayScheduleResponses.find(
					(item: any) => item.dayOfWeek === day
				)
				return found
					? {
							startTime: found.startTime,
							endTime: found.endTime,
							dayOfWeek: day,
							workingDay: found.workingDay,
							breakRequest: found.breaks === null ? [] : found.breaks,
						}
					: {
							startTime: '',
							endTime: '',
							dayOfWeek: day,
							workingDay: false,
							breakRequest: [],
						}
			})
			setData({
				entityId: 0,
				entityType: '',
				startDate: slots.startDate,
				endDate: slots.endDate,
				dayScheduleRequests: newDayScheduleResponses,
			})
		}
	}, [slots, open])

	return (
		<ModalComponent
			active={open}
			handleClose={handleClose}
			title="График работы"
		>
			<ScrollTimePicker
				active={openTime}
				handleClose={() => setOpenTime(false)}
				title={timeData.title}
				setSelectedTime={selectSpecificTime}
				selectedTime="08:00"
			/>
			<ScrollTimePicker
				active={breakModalsStart}
				handleClose={() => setBreakModalsStart(false)}
				title="Начало интервала"
				setSelectedTime={selectBreakStart}
				selectedTime="13:00"
			/>
			<ScrollTimePicker
				active={breakModalsEnd}
				handleClose={() => setBreakModalsEnd(false)}
				title="Конец интервала"
				setSelectedTime={selectBreakEnd}
				selectedTime="14:00"
			/>
			<Flex
				vertical
				gap={10}
				className="w-[400px] max-h-[90vh] overflow-y-auto"
			>
				<p className="text-[14px] font-[500]">Выберите дату</p>
				<Flex gap={10}>
					<NewDatePicker
						setDate={(date) =>
							setData({
								...data,
								startDate: date,
							})
						}
						label="От"
						date={new Date(data.startDate)}
					/>
					<NewDatePicker
						setDate={(date) =>
							setData({
								...data,
								endDate: date,
							})
						}
						label="До"
						date={new Date(data.endDate)}
					/>
				</Flex>
				<p className="text-[14px] font-[500]">
					Выберите дни недели и время работы
				</p>
				{data.dayScheduleRequests?.map((item, index) => {
					return (
						<Flex vertical gap={item.workingDay ? 5 : 0}>
							<Flex gap={10}>
								<Flex
									align="center"
									justify="center"
									className={clsx(
										'w-10 h-10 min-w-10 rounded-full text-[16px] font-[500] cursor-pointer',
										{ 'bg-[#F2F2F1] text-[#4E4E4E80]': !item.workingDay },
										{ 'bg-myviolet text-white': item.workingDay }
									)}
									onClick={() => changeWorkingDay(index, item.workingDay)}
								>
									{WEEK[index]}
								</Flex>
								<Flex
									justify="space-between"
									align="center"
									className="w-full h-10 min-h-10 max-h-10 border-[1px] border-[#D8DADC] border-solid rounded-[10px] px-[10px]"
								>
									<Flex
										align="center"
										justify="center"
										gap={10}
										className={clsx(
											'h-full text-[#D8DADC] text-[16px] font-[500] py-1',
											{ 'pointer-events-none': !item.workingDay }
										)}
									>
										<p
											onClick={() =>
												clickChm('Начало рабочего дня', index, 'startTime')
											}
											className={clsx(
												'h-full flex items-center hover:bg-gray-50 px-1 rounded-lg cursor-pointer',
												{
													'text-black': item.workingDay && item.startTime,
													'text-[#D8DADC]': !item.workingDay,
												}
											)}
										>
											{item.startTime?.slice(0, 5) || 'ЧЧ:ММ'}
										</p>
										<p>-</p>
										<p
											onClick={() =>
												clickChm('Конец рабочего дня', index, 'endTime')
											}
											className={clsx(
												'h-full flex items-center hover:bg-gray-50 px-1 rounded-lg cursor-pointer',
												{
													'text-black': item.workingDay && item.endTime,
													'text-[#D8DADC]': !item.workingDay,
												}
											)}
										>
											{item.endTime?.slice(0, 5) || 'ЧЧ:ММ'}
										</p>
									</Flex>
									<MdOutlineArrowForwardIos
										size={18}
										className="text-[#D8DADC]"
									/>
								</Flex>
							</Flex>
							{item.breakRequest &&
								item.breakRequest.map((breakItem, breakIndex) => (
									<Flex justify="end" gap={10} className="pl-20">
										<Flex
											align="center"
											gap={10}
											className="h-full w-full text-myviolet text-[16px] font-[500] py-1 border-[1px] border-[#D8DADC] border-solid rounded-[10px] px-[10px]"
										>
											<p
												onClick={() => clickDhm(index, breakIndex, 'startTime')}
												className={clsx(
													'h-full flex items-center hover:bg-gray-50 px-1 rounded-lg cursor-pointer',
													{
														'text-myviolet':
															!breakItem.isScheduleBreak && breakItem.startTime,
														'text-[#D8DADC]': !breakItem.isScheduleBreak,
													}
												)}
											>
												{breakItem.startTime?.slice(0, 5) || 'ЧЧ:ММ'}
											</p>
											<p>-</p>
											<p
												onClick={() => clickThm(index, breakIndex, 'endTime')}
												className={clsx(
													'h-full flex items-center hover:bg-gray-50 px-1 rounded-lg cursor-pointer',
													{
														'text-myviolet':
															!breakItem.isScheduleBreak && breakItem.endTime,
														'text-[#D8DADC]': !breakItem.isScheduleBreak,
													}
												)}
											>
												{breakItem.endTime?.slice(0, 5) || 'ЧЧ:ММ'}
											</p>
										</Flex>
										<DeleteOutlined
											onClick={() => deleteBreak(index, breakIndex)}
										/>
									</Flex>
								))}
							{item.workingDay && item.startTime && item.endTime && (
								<p
									onClick={() => addInterval(index)}
									className="text-myviolet font-[600] text-[13px] text-center cursor-pointer"
								>
									+Добавить интервал
								</p>
							)}
						</Flex>
					)
				})}
				<Flex onClick={handleApplyToAll} className="mt-3" gap={10}>
					<Copy color={canApplyToAll ? 'var(--myviolet)' : 'gray'} />
					<p
						className={clsx('text-[14px] font-[500]', {
							'text-myviolet': canApplyToAll,
						})}
					>
						Применить ко всем
					</p>
				</Flex>
				<Flex gap={10}>
					<Button
						border="1px solid #D8DADC"
						backgroundColor="transparent"
						color="black"
						onClick={handleClose}
					>
						Отмена
					</Button>
					<Button
						isLoading={isLoading}
						disabled={validation}
						onClick={handlePost}
					>
						Сохранить
					</Button>
				</Flex>
			</Flex>
		</ModalComponent>
	)
}
