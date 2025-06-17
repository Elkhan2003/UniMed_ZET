import { useState } from 'react'
import { Flex, Tooltip } from 'antd'
import clsx from 'clsx'
import {
	useDeleteSchedulesDaysMutation,
	useGetSchedulesEntitiesWeeklyQuery,
	usePutSchedulesDaysMutation,
} from '../../../store/queries/schedule.service'
import { WEEK } from '../../../shared/lib/constants/constants'
import { IBreak, ScheduleEntity } from '../../../common/schedules'
import { DeleteOutlined, EditOutlined} from '@ant-design/icons'
import { DoubleScrollTimePicker } from '../../shared/double-time-picker'
import { DeleteModal } from '../../UI/Modal/DeleteModal/DeleteModal'
import { Slots } from '../Slots'
import { getMonday, getSunday } from '../../../shared/lib/helpers/helpers'
import { DateScroll } from '../../UI/dateScroll'

interface ScheduleProps {
	branchId: number | undefined
	entity: any
	setSlots: any
	setModal: any
}

export const ScheduleData = ({
	branchId = undefined,
	entity,
	setSlots,
	setModal,
}: ScheduleProps) => {
	const [deleteSchedules] = useDeleteSchedulesDaysMutation()
	const [putSchedules] = usePutSchedulesDaysMutation()

	const [startDate, setStartDate] = useState(
		getMonday(new Date().toISOString().slice(0, 10))
	)
	const [endDate, setEndDate] = useState(
		getSunday(new Date().toISOString().slice(0, 10))
	)

	const { data, isLoading } = useGetSchedulesEntitiesWeeklyQuery(
		{
			entityId: Number(branchId),
			startWeek: startDate,
			entity: entity,
		},
		{ skip: branchId === undefined }
	)

	const schedule: any = data?.dayScheduleResponses || []

	const times = schedule
		?.filter((item: any) => item.workingDay)
		?.map((item: any) => ({
			startTime: item?.startTime,
			endTime: item.endTime,
		}))

	const minStartTime = times?.reduce(
		(min: any, current: any) =>
			current?.startTime < min ? current?.startTime : min,
		times[0]?.startTime
	)
	const maxEndTime = times?.reduce(
		(max: any, current: any) =>
			current?.endTime > max ? current?.endTime : max,
		times[0]?.endTime
	)

	const [editActive, setEditActive] = useState(false)
	const [deleteActive, setDeleteActive] = useState(false)

	const [scheduleId, setScheduleId] = useState<number>(0)

	const [editModal, setEditModal] = useState({
		startTime: '',
		endTime: '',
	})

	const handleClose = () => {
		setEditActive(false)
	}

	const clickEditIcon = (item: ScheduleEntity) => {
		setEditModal({
			...editModal,
			startTime: item?.startTime.slice(0, 5),
			endTime: item.endTime.slice(0, 5),
		})
		setScheduleId(item.id)
		setEditActive(true)
	}

	const handleEdit = async ({
		startTime,
		endTime,
	}: {
		startTime: string
		endTime: string
	}) => {
		const { toast } = await import('react-hot-toast')
		try {
			await putSchedules({ startTime, endTime, scheduleId })
			toast.success('Рабочий день успешно изменен')
		} catch (error) {
			toast.error('Произошла оишбка')
		}
	}

	const clickDeleteIcon = (item: ScheduleEntity) => {
		setDeleteActive(true)
		setScheduleId(item.id)
	}

	const handleDelete = async () => {
		const { toast } = await import('react-hot-toast')
		try {
			setDeleteActive(false)
			await deleteSchedules({ scheduleId })
			toast.success('Рабочий день успешно удален')
		} catch (error) {
			toast.error('Произошла оишбка')
		}
	}

	const calculatePositions = ({
		startTime,
		endTime,
	}: {
		startTime: string
		endTime: string
	}) => {
		const range =
			Number(maxEndTime.split(':')[0]) - Number(minStartTime.split(':')[0])
		const left =
			Number(startTime.split(':')[0]) - Number(minStartTime.split(':')[0])

		const right =
			Number(maxEndTime.split(':')[0]) - Number(endTime.split(':')[0])

		const leftPercent = left !== 0 ? (left / range) * 100 : 0
		const rightPercent = right !== 0 ? (right / range) * 100 : 0
		return { leftPercent: leftPercent, rightPercent: rightPercent }
	}

	return (
		<Flex align="center" className="w-full" gap={10}>
			<Slots
				entityId={Number(branchId)}
				entityType={entity}
				setSlots={setSlots}
				setModal={setModal}
			/>
			{editActive && (
				<DoubleScrollTimePicker
					active={editActive}
					title="Редактирование"
					setSelectedTimes={handleEdit}
					startSelectedTime={editModal?.startTime}
					endSelectedTime={editModal.endTime}
					handleClose={handleClose}
				/>
			)}
			<DeleteModal
				active={deleteActive}
				handleClose={() => {
					setDeleteActive(false)
				}}
				okText="Удалить"
				handleTrueClick={handleDelete}
				title="Удалить рабочий день"
			/>
			{isLoading || schedule === undefined ? (
				<Flex vertical gap={10} className="w-full">
					{WEEK.map((item: string, index: number) => (
						<Flex key={index} className="w-full" gap={10} align="center">
							<p className="min-w-6 text-[#101010] text-[14px] font-[500]">
								{item}:
							</p>
							<div
								className={clsx(
									' transition-all duration-200 w-full rounded-[12px] h-[30px] bg-[#F2F2F1]',
									{ 'animate-pulse': isLoading }
								)}
							/>
						</Flex>
					))}
				</Flex>
			) : (
				<Flex align="end" vertical className="w-full" gap={10}>
					<DateScroll
						startDate={startDate}
						endDate={endDate}
						setStartDate={setStartDate}
						setEndDate={setEndDate}
					/>
					<Flex vertical gap={10} className="w-full">
						{schedule?.map((item: ScheduleEntity, index: number) => {
							const { leftPercent, rightPercent } =
								item.workingDay && calculatePositions(item)
							return (
								<Flex key={index} className="w-full" gap={10} align="center">
									<p className="min-w-6 text-[#101010] text-[16px] font-[500] myfont">
										{WEEK[index]}:
									</p>
									<div className="w-full rounded-[8px] h-[30px] relative">
										<div className="absolute inset-0 w-full rounded-[12px] h-[30px] bg-[#F2F2F1]" />
										{item.workingDay && (
											<Flex
												style={{
													position: 'absolute',
													left: `${leftPercent}%`,
													right: `${rightPercent}%`,
												}}
												justify="end"
												align="center"
												className="rounded-[12px] h-[30px] bg-myviolet px-4 transition-all duration-700"
											>
												<p className="text-white myfont font-[500] text-[16px]">
													<span>{item?.startTime.slice(0, 5)}</span> -{' '}
													<span>{item?.endTime.slice(0, 5)}</span>
												</p>
											</Flex>
										)}
										{item.workingDay &&
											item.breaks?.length &&
											item.breaks.map((breakitem: IBreak) => {
												const { leftPercent, rightPercent } =
													item.workingDay && calculatePositions(breakitem)
												const text = `${breakitem?.startTime.slice(
													0,
													5
												)}-${breakitem?.endTime.slice(0, 5)}`
												return (
													<Flex
														style={{
															position: 'absolute',
															left: `${leftPercent}%`,
															right: `${rightPercent}%`,
														}}
														justify="center"
														align="center"
														className="rounded-[12px] h-[30px] bg-gray-400 transition-all duration-700"
													>
														<Tooltip placement="top" title={text}>
															<p className="text-white myfont font-[500] text-xs truncate">
																{text}
															</p>
														</Tooltip>
													</Flex>
												)
											})}
									</div>
									<div className="!min-w-6 !w-6 flex items-center gap-[5px]">
										{item.workingDay && (
											<>
												<EditOutlined onClick={() => clickEditIcon(item)} />
												<DeleteOutlined
													className="text-[#FF5E5E]"
													onClick={() => clickDeleteIcon(item)}
												/>
											</>
										)}
									</div>
								</Flex>
							)
						})}
					</Flex>
				</Flex>
			)}
		</Flex>
	)
}
