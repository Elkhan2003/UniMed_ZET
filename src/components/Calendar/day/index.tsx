import { useState, useRef, useEffect } from 'react'
import Loading from '../../../pages/loading'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { CreateModal } from '../modals/create'
import { convertPhoneNumber } from '../../../shared/lib/helpers/helpers'
import { TranslateAppointmentStatus } from '../../../shared/lib/helpers/helpers'
import { Tooltip } from 'antd'
import { AppointmentStatusColor } from '../../../shared/lib/helpers/helpers'
import { PiWarningOctagonDuotone } from 'react-icons/pi'
import { Details } from '../modals/details/index'
import dayjs from 'dayjs'
import { IoMdClose } from 'react-icons/io'

export const CalendarDay = ({
	filteredData,
	isLoading,
	timeSlots,
	currentDate,
	dataCalendar,
	setCreateUser,
}: {
	filteredData: any[]
	isLoading: boolean
	timeSlots: string[]
	currentDate: string
	dataCalendar: any[]
	setCreateUser: (active: boolean) => void
}) => {
	const [active, setActive] = useState(false)
	const [activeDetails, setActiveDetails] = useState(false)
	const [showScrollShadow, setShowScrollShadow] = useState(false)
	const [showBottomShadow, setShowBottomShadow] = useState(false)
	const [showAvatar, setShowAvatar] = useState(false)
	const [avatar, setAvatar] = useState<string>('')
	const [appointmentId, setAppointmentId] = useState<number>(0)
	const scrollRef = useRef<HTMLDivElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const [currentGroup, setCurrentGroup] = useState<number>(0)
	const MAX_MASTERS_PER_GROUP = 5
	const totalGroups = Math.ceil(filteredData.length / MAX_MASTERS_PER_GROUP)
	const currentGroupData = filteredData.slice(
		currentGroup * MAX_MASTERS_PER_GROUP,
		(currentGroup + 1) * MAX_MASTERS_PER_GROUP
	)

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

	const handlePrevGroup = () => {
		if (currentGroup > 0) {
			setCurrentGroup(currentGroup - 1)
		}
	}

	const handleNextGroup = () => {
		if (currentGroup < totalGroups - 1) {
			setCurrentGroup(currentGroup + 1)
		}
	}

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
	}, [filteredData, timeSlots])

	useEffect(() => {
		setCurrentGroup(0)
	}, [filteredData.length])

	const renderTimeSlots = () => {
		return (
			<div className="w-[45px] min-w-[45px] max-w-[45px] h-full">
				{timeSlots.map((slot) => (
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

	const startHour = timeSlots[0] || '12:30'

	const showNavigation = filteredData.length > MAX_MASTERS_PER_GROUP
	const showLeftNav = showNavigation && currentGroup > 0
	const showRightNav = showNavigation && currentGroup < totalGroups - 1

	return (
		<>
			{showAvatar && (
				<div
					onClick={(e) => {
						e.stopPropagation()
						setShowAvatar(false)
					}}
					className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black/50"
				>
					<div className="relative w-fit h-fit">
						<img
							src={avatar}
							alt="avatar"
							className="w-auto h-auto max-h-[95vh] max-w-[95vw] object-cover"
						/>
						<div className="absolute top-[-20px] right-[-20px] bg-[#101010] rounded-full p-[5px]">
							<IoMdClose
								size={24}
								className="text-white cursor-pointer z-100"
								onClick={(e) => {
									e.stopPropagation()
									setShowAvatar(false)
								}}
							/>
						</div>
					</div>
				</div>
			)}
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
				{isLoading ? (
					<div className="w-full h-full flex items-center justify-center">
						<Loading />
					</div>
				) : filteredData.length > 0 ? (
					<>
						<div
							className={`w-full h-[60px] rounded-t-[24px] flex items-center justify-between sticky top-0 bg-white z-20 transition-shadow duration-300 ${
								showScrollShadow
									? 'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]'
									: ''
							}`}
						>
							<div
								style={{
									borderBottom: '1px solid #E8EAED',
								}}
								className="w-[45px] max-w-[45px] min-w-[45px] h-full flex items-center justify-center"
							>
								{showLeftNav ? (
									<div
										className="flex items-center justify-center bg-[#F2F2F1] rounded-full p-[5px] cursor-pointer"
										onClick={handlePrevGroup}
									>
										<MdKeyboardArrowLeft size={20} />
									</div>
								) : null}
							</div>
							{currentGroupData.map((item, index: number) => (
								<div
									key={item.id}
									style={{
										borderRight: `1px solid ${
											index + 1 === currentGroupData.length
												? 'transparent'
												: '#E8EAED'
										}`,
										borderBottom: '1px solid #E8EAED',
									}}
									className="w-full h-full flex items-center justify-center"
								>
									<Tooltip title={item.fullName}>
										<div className="w-full flex items-center justify-center gap-[10px]">
											<img
												src={item.avatar}
												alt={item.fullName}
												className="w-[32px] h-[32px] object-cover rounded-full cursor-pointer"
												onClick={() => {
													setAvatar(item.avatar)
													setShowAvatar(true)
												}}
											/>
											<div className="flex flex-col w-fit">
												<p className="text-[#101010] text-[14px] leading-[18px] w-fit">
													{item?.fullName?.split(' ')[0]}{' '}
													{item?.fullName?.split(' ')[1]?.slice(0, 1)}
												</p>
												<p className="text-[#4E4E4E80] text-[12px] space-x-[5px] leading-[16px] w-fit">
													<span>
														{item?.freeAndBreakResponse?.startTime?.slice(0, 5)}
													</span>
													<span>-</span>
													<span>
														{item?.freeAndBreakResponse?.endTime?.slice(0, 5)}
													</span>
												</p>
											</div>
										</div>
									</Tooltip>
								</div>
							))}
							<div
								style={{
									borderBottom: '1px solid #E8EAED',
								}}
								className="w-[45px] max-w-[45px] min-w-[45px] h-full flex items-center justify-center"
							>
								{showRightNav ? (
									<div
										className="flex items-center justify-center bg-[#F2F2F1] rounded-full p-[5px] cursor-pointer"
										onClick={handleNextGroup}
									>
										<MdKeyboardArrowRight size={20} />
									</div>
								) : null}
							</div>
						</div>

						<div
							className="w-full h-[calc(100%-60px)] max-h-[calc(100%-60px)] flex overflow-y-auto"
							ref={scrollRef}
							onScroll={handleScroll}
						>
							{renderTimeSlots()}
							<div className="w-full h-full flex">
								{currentGroupData.map((item, filteredDataIndex: number) => {
									const appointment = dataCalendar.filter(
										(appointmentItem: any) =>
											appointmentItem.master.id === item.masterId
									)
									const filteredAppoinmentStatus = appointment.filter(
										(element: any) => {
											return element.appointmentStatus !== 'CANCELED'
										}
									)

									const cancaledAppoinemtns = appointment.filter(
										(element: any) =>
											element.appointmentStatus === 'CANCELED' ||
											element.appointmentStatus === 'NOT_COME'
									)

									return (
										<div
											key={item.id}
											className="w-full h-full flex flex-col relative"
										>
											{timeSlots.map((slot, timeSlotsIndex: number) => {
												return (
													<div
														style={{
															borderRight:
																filteredDataIndex + 1 ===
																currentGroupData.length
																	? 'none'
																	: '1px solid #E8EAED',
															borderBottom:
																timeSlotsIndex === timeSlots.length - 1
																	? 'none'
																	: '1px solid #E8EAED',
														}}
														onClick={() => {
															setCreateData({
																startTime: slot + ':00',
																endTime: timeSlots[timeSlotsIndex + 1],
																startDate: currentDate,
																master: {
																	masterId: {
																		name: item.fullName,
																		masterId: item.masterId,
																	},
																	startTime:
																		item.freeAndBreakResponse.startTime,
																	endTime: item.freeAndBreakResponse.endTime,
																	freeTimes:
																		item.freeAndBreakResponse.freeTimes,
																	breaks: item.freeAndBreakResponse.breaks,
																},
															})
															setActive(true)
														}}
														key={slot}
														className="w-full h-[60px] min-h-[60px] max-h-[60px] hover:bg-[#F2F2F1]/50"
													></div>
												)
											})}
											{filteredAppoinmentStatus.map(
												(app: any, appIndex: number) => {
													const startTime: any = new Date(app.startTime)
													const endTime: any = new Date(app.endTime)
													const differenceInMilliseconds = endTime - startTime
													const height = differenceInMilliseconds / (1000 * 60)

													const startHours: any = new Date(
														app.startTime.split('T')[0] +
															'T' +
															startHour +
															':00'
													)

													const difference = startTime - startHours
													const top = difference / (1000 * 60)

													const start = app.startTime.split('T')[1].slice(0, 5)
													const end = app.endTime.split('T')[1].slice(0, 5)

													const currentColor = AppointmentStatusColor(
														app.appointmentStatus
													)

													return (
														<Tooltip
															color={currentColor}
															key={appIndex}
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
																	top: top,
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
																// onDragStart={(e) => handleDragStart(e, app)}
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
								})}
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
		</>
	)
}
