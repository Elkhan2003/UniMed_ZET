import { useEffect, useRef, useState } from 'react'
import Loading from '../../../pages/loading'
import { Tooltip } from 'antd'
import dayjs from 'dayjs'
import { generateTimeSlots } from '../conts'
import { CreateModal } from '../modals/create'
import { Details } from '../modals/details'
import {
	convertPhoneNumber,
	TranslateAppointmentStatus,
} from '../../../shared/lib/helpers/helpers'
import { AppointmentStatusColor } from '../../../shared/lib/helpers/helpers'
import { PiWarningOctagonDuotone } from 'react-icons/pi'
import { blocked } from '../../../shared/lib/constants/constants'

export const CalendarWeek = ({
	masterSchedule,
	isLoading,
	dataCalendarWeek,
	choosedMaster,
	setCreateUser,
}: {
	masterSchedule: any
	isLoading: boolean
	dataCalendarWeek: any
	choosedMaster: any
	setCreateUser: (active: boolean) => void
}) => {
	const [active, setActive] = useState(false)
	const [activeDetails, setActiveDetails] = useState(false)
	const [appointmentId, setAppointmentId] = useState(0)
	const [createData, setCreateData] = useState<{
		startTime: string
		endTime: string
		startDate: string
		master: {
			masterId: { name: string; masterId: string }
			startTime: string
			endTime: string
			freeTimes: { startTime: string; endTime: string }[]
			breaks: { startTime: string; endTime: string }[]
		}
	} | null>(null)
	const [showScrollShadow, setShowScrollShadow] = useState(false)
	const [showBottomShadow, setShowBottomShadow] = useState(false)
	const [helpersData, setHelpersData] = useState<any>({
		timeSlots: [],
		earliest: null,
		latest: null,
	})
	const scrollRef = useRef<HTMLDivElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const target = e.currentTarget
		const scrollPosition = target.scrollTop
		const scrollThreshold = 20

		setShowScrollShadow(scrollPosition > scrollThreshold)

		const isNearBottom =
			target.scrollHeight - target.scrollTop - target.clientHeight <
			scrollThreshold
		setShowBottomShadow(
			!isNearBottom && target.scrollHeight > target.clientHeight
		)
	}

	useEffect(() => {
		if (scrollRef.current) {
			const target = scrollRef.current
			setShowBottomShadow(
				target.scrollHeight > target.clientHeight &&
					target.scrollHeight - target.scrollTop - target.clientHeight >= 20
			)
		}
	}, [masterSchedule, helpersData.timeSlots])

	const renderTimeSlots = () => {
		return (
			<div className="w-[45px] min-w-[45px] max-w-[45px] h-full">
				{helpersData?.timeSlots?.map((slot: string) => (
					<p
						key={slot}
						className="w-full h-[60px] text-center text-[12px] text-[#4E4E4E80]"
					>
						{slot}
					</p>
				))}
			</div>
		)
	}

	useEffect(() => {
		if (masterSchedule) {
			const earliest = masterSchedule?.dayScheduleResponses.reduce(
				(earliestItem: any, currentItem: any) => {
					return currentItem?.startTime < earliestItem?.startTime
						? currentItem
						: earliestItem
				},
				masterSchedule?.dayScheduleResponses[0]
			)

			const latest = masterSchedule?.dayScheduleResponses.reduce(
				(latestItem: any, currentItem: any) => {
					return currentItem?.endTime > latestItem?.endTime
						? currentItem
						: latestItem
				},
				masterSchedule?.dayScheduleResponses[0]
			)

			setHelpersData({
				timeSlots: generateTimeSlots(earliest?.startTime, latest?.endTime, 60),
				earliest: earliest,
				latest: latest,
			})
		}
	}, [masterSchedule])

	return (
		<div
			ref={containerRef}
			className="w-full h-full rounded-[24px] overflow-hidden relative"
		>
			<CreateModal
				active={active}
				handleClose={() => setActive(false)}
				data={createData}
				setCreateUser={setCreateUser}
			/>
			<Details
				active={activeDetails}
				handleClose={() => setActiveDetails(false)}
				appointmentId={appointmentId}
				onSuccess={() => setActiveDetails(false)}
			/>
			{isLoading && helpersData?.timeSlots?.length === 0 ? (
				<div className="w-full h-full flex items-center justify-center">
					<Loading />
				</div>
			) : masterSchedule ? (
				<>
					<div
						className={`w-full h-[60px] rounded-t-[24px] flex justify-between sticky top-0 bg-white z-20 transition-shadow duration-300 ${
							showScrollShadow ? 'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]' : ''
						}`}
					>
						<div
							style={{
								borderBottom: '1px solid #E8EAED',
							}}
							className="min-w-[45px] max-w-[45px] h-full"
						/>
						{[
							'Понедельник',
							'Вторник',
							'Среда',
							'Четверг',
							'Пятница',
							'Суббота',
							'Воскресенье',
						].map((day, index) => {
							const isToday = dayjs(masterSchedule?.startDate)
								.add(index, 'day')
								.isSame(dayjs(), 'day')
							return (
								<div
									style={{
										borderRight: `1px solid ${
											index + 1 === 7 ? 'transparent' : '#E8EAED'
										}`,
										borderBottom: '1px solid #E8EAED',
										borderTop: isToday ? '2px solid #FF4BAF' : 'none',
									}}
									key={day}
									className="w-full h-full flex flex-col items-center justify-center"
								>
									<p
										className={`text-[12px] leading-[18px] ${
											isToday ? 'text-[#FFC4E1]' : 'text-[#4E4E4E80]'
										}`}
									>
										{day}
									</p>
									<p
										className={`text-[20px] ${
											isToday ? 'text-[#FF99D4]' : 'text-[#101010]'
										} font-[500]`}
									>
										{dayjs(masterSchedule?.startDate)
											.add(index, 'day')
											.format('DD')}
									</p>
								</div>
							)
						})}
						<div
							style={{
								borderBottom: '1px solid #E8EAED',
							}}
							className="min-w-[45px] max-w-[45px] h-full"
						/>
					</div>

					<div
						className="w-full h-[calc(100%-60px)] max-h-[calc(100%-60px)] flex overflow-y-auto"
						ref={scrollRef}
						onScroll={handleScroll}
					>
						{renderTimeSlots()}
						<div className="w-full h-full flex relative">
							{masterSchedule?.dayScheduleResponses?.map(
								(item: any, filteredDataIndex: number) => {
									const filteredAppoinmentStatus = dataCalendarWeek.filter(
										(calendarItem: any) =>
											item.day ===
												dayjs(calendarItem?.startTime).format('YYYY-MM-DD') &&
											calendarItem?.master?.id === choosedMaster?.masterId
									)

									const today = dayjs().format('YYYY-MM-DD')

									const start = dayjs(
										`${today} ${helpersData.earliest?.startTime}`,
										'YYYY-MM-DD HH:mm:ss'
									)
									const end = dayjs(
										`${today} ${item?.startTime}`,
										'YYYY-MM-DD HH:mm:ss'
									)

									const diffInMinutes = end.diff(start, 'minute')

									return (
										<div
											key={item.id}
											className="w-full h-full flex flex-col relative"
										>
											{helpersData?.timeSlots?.map(
												(slot: any, timeSlotsIndex: number) => {
													const isBefore = dayjs(
														slot + ':00',
														'HH:mm:ss'
													).isBefore(dayjs(item?.startTime, 'HH:mm:ss'))
													const isAfter = dayjs(
														slot + ':00',
														'HH:mm:ss'
													).isAfter(dayjs(item?.endTime, 'HH:mm:ss'))
													dayjs(slot + ':00', 'HH:mm:ss').isBefore(
														dayjs(item?.endTime, 'HH:mm:ss')
													)
													return (
														<div
															style={{
																borderRight:
																	filteredDataIndex + 1 === 7
																		? 'none'
																		: '1px solid #E8EAED',
																borderBottom: '1px solid #E8EAED',
																background: isBefore || isAfter ? blocked : '',
															}}
															onClick={() => {
																setCreateData({
																	startTime: slot + ':00',
																	endTime:
																		helpersData?.timeSlots[timeSlotsIndex + 1],
																	startDate: item.day,
																	master: {
																		masterId: {
																			name: item.fullName,
																			masterId: item.masterId,
																		},
																		startTime: helpersData?.timeSlots[0],
																		endTime:
																			helpersData?.timeSlots[
																				helpersData?.timeSlots?.length - 1
																			],
																		freeTimes: helpersData?.timeSlots?.map(
																			(item: any) => {
																				return {
																					startTime: item,
																					endTime: item,
																				}
																			}
																		),
																		breaks: item.breaks,
																	},
																})
																setActive(true)
															}}
															key={slot}
															className="w-full h-[60px] min-h-[60px] max-h-[60px] hover:bg-[#F2F2F1]/50"
														></div>
													)
												}
											)}
											{filteredAppoinmentStatus?.map(
												(app: any, appIndex: number) => {
													const startTime: any = new Date(app.startTime)
													const endTime: any = new Date(app.endTime)
													const differenceInMilliseconds = endTime - startTime
													const height = differenceInMilliseconds / (1000 * 60)

													const startHours: any = new Date(
														app.startTime.split('T')[0] + 'T' + item?.startTime
													)

													const difference = startTime - startHours
													const top = difference / (1000 * 60)

													const currentColor = AppointmentStatusColor(
														app.appointmentStatus
													)

													return (
														<Tooltip
															color={currentColor}
															title={
																<div className="flex flex-col gap-[2px]">
																	<p className="text-white text-sm">
																		Клиент: {app.user.firstName}{' '}
																		{app.user.lastName}
																	</p>
																	<p className="text-white text-sm">
																		Телефон:{' '}
																		{convertPhoneNumber(app.user.phoneNumber)}
																	</p>
																	<p className="text-white text-sm">
																		Статус:{' '}
																		{TranslateAppointmentStatus(
																			app.appointmentStatus
																		)}
																	</p>
																	<p className="text-white text-sm">
																		Время:{' '}
																		{app.startTime.split('T')[1].slice(0, 5)} -{' '}
																		{app.endTime.split('T')[1].slice(0, 5)}
																	</p>
																	<div className="text-white flex items-center gap-4 text-sm">
																		{app.numberOfVisits < 2 ? (
																			<>
																				Первый визит{' '}
																				<PiWarningOctagonDuotone className="text-white w-5 h-5" />
																			</>
																		) : (
																			`Количество визитов : ${app.numberOfVisits}`
																		)}
																	</div>
																	{app.description &&
																		(() => {
																			const wordLimit = 50
																			const words = app.description.split(' ')
																			const isTruncated =
																				words.length > wordLimit
																			const truncatedText = words
																				.slice(0, wordLimit)
																				.join(' ')

																			return (
																				<p className="text-white text-sm">
																					Комментарий:{' '}
																					{isTruncated
																						? `${truncatedText}...`
																						: app.description}
																				</p>
																			)
																		})()}

																	{app.promocode && (
																		<div className="flex items-center gap-3 text-white text-sm">
																			Промокод
																			<PiWarningOctagonDuotone className="text-white w-5 h-5" />
																		</div>
																	)}
																</div>
															}
														>
															<div
																key={appIndex}
																style={{
																	height: `${height}px`,
																	top: top + diffInMinutes,
																	backgroundColor:
																		AppointmentStatusColor(
																			app.appointmentStatus
																		) + '30',
																	borderLeft: `2px solid ${currentColor}`,
																}}
																className="absolute rounded-[6px] overflow-hidden w-full px-2 cursor-pointer"
																onClick={(e) => {
																	e.stopPropagation()
																	setAppointmentId(app.id)
																	setActiveDetails(true)
																}}
																draggable
															>
																<p className="text-[12px] leading-3">
																	{dayjs(app.startTime).format('HH:mm')} -{' '}
																	{dayjs(app.endTime).format('HH:mm')}
																</p>
																<p className="text-[11px] leading-3">
																	{app.user.firstName} {app.user.lastName}
																</p>
															</div>
														</Tooltip>
													)
												}
											)}
										</div>
									)
								}
							)}
						</div>
						{renderTimeSlots()}
					</div>

					{showBottomShadow && (
						<div
							className="absolute bottom-0 left-0 right-0 h-[10px] z-10 pointer-events-none"
							style={{
								background:
									'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
								borderRadius: '0 0 24px 24px',
							}}
						></div>
					)}
				</>
			) : (
				<div className="w-full h-full flex items-center justify-center">
					<p className="text-[#4E4E4E80] text-[16px] leading-[18px]">
						Выберите сотрудника
					</p>
				</div>
			)}
		</div>
	)
}
