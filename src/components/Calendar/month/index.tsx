import React, { useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { AppointmentStatusColor } from '../../../shared/lib/helpers/helpers'
import { Details } from '../modals/details'
import { CreateModal } from '../modals/create'
import Loading from '../../../pages/loading'
import { Dropdown } from 'antd'
import { IoClose } from 'react-icons/io5'
import { blocked } from '../../../shared/lib/constants/constants'

dayjs.locale('ru')

export const CalendarMonth = ({
	currentDate,
	dataCalendar,
	isLoading,
	filteredMasters,
	setCreateUser,
}: {
	currentDate: dayjs.Dayjs
	dataCalendar: any
	isLoading: boolean
	filteredMasters: number[]
	setCreateUser: (active: boolean) => void
}) => {
	const [active, setActive] = useState(false)
	const [activeDetails, setActiveDetails] = useState(false)
	const [openIndex, setOpenIndex] = useState<number | null>(null)
	const [appointmentId, setAppointmentId] = useState(0)
	const [createData, setCreateData] = useState({
		startTime: '8:00',
		endTime: '9:00',
		startDate: '',
		master: {
			masterId: { name: '', masterId: '' },
			startTime: '',
			endTime: '',
			freeTimes: Array.from({ length: 11 }, (_, i) => {
				const start = dayjs()
					.hour(8 + i)
					.minute(0)
				return {
					startTime: start.format('HH:mm'),
					endTime: start.add(1, 'hour').format('HH:mm'),
				}
			}),
			breaks: [],
		},
	})

	const startOfMonth = currentDate.startOf('month')
	const startDay = (startOfMonth.day() + 6) % 7

	const daysInMonth = currentDate.daysInMonth()
	const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7

	const daysArray = Array.from({ length: totalCells }, (_, i) => {
		const dayOffset = i - startDay
		const date = startOfMonth.add(dayOffset, 'day')
		const isCurrentMonth = date.month() === currentDate.month()
		const isSelected = date.isSame(currentDate, 'day')
		return {
			date,
			isCurrentMonth,
			isSelected,
		}
	})

	const groupedByDate = dataCalendar
		.filter((item: any) => filteredMasters.includes(item?.master?.id))
		.reduce(
			(acc: any, appointment: any) => {
				const dateKey = dayjs(appointment.startTime).format('YYYY-MM-DD')

				if (!acc[dateKey]) {
					acc[dateKey] = []
				}

				acc[dateKey].push(appointment)
				return acc
			},
			{} as Record<string, typeof dataCalendar>
		)

	return (
		<div className="w-full h-full flex flex-col">
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
			<div className="w-full h-[50px] grid grid-cols-7 items-center text-center font-[600] text-[14px] text-[#101010] bg-[#E8EAED] rounded-t-[24px]">
				{[
					'Понедельник',
					'Вторник',
					'Среда',
					'Четверг',
					'Пятница',
					'Суббота',
					'Воскресенье',
				].map((day) => (
					<p key={day}>{day}</p>
				))}
			</div>
			{isLoading ? (
				<div className="w-full h-full flex items-center justify-center">
					<Loading />
				</div>
			) : (
				<>
					<div className="w-full h-full grid grid-cols-7 text-center rounded-b-[24px] overflow-hidden">
						{daysArray.map(({ date, isCurrentMonth, isSelected }, index) => {
							const currentAppointments =
								groupedByDate[date.format('YYYY-MM-DD')] || []
							const isMore = currentAppointments.length > 4
							const slicedAppointments = isMore
								? currentAppointments.slice(0, 4)
								: currentAppointments
							const lastAppointments = currentAppointments.slice(
								4,
								currentAppointments.length
							)
							return (
								<div
									key={index}
									className={`w-full h-full text-[12px] font-[500] transition-all relative
									${isSelected ? 'bg-gray-100' : ''}
									${!isSelected && isCurrentMonth ? 'text-[#101010] hover:bg-gray-50' : ''}
									${!isCurrentMonth ? 'pointer-events-none' : 'cursor-pointer'}
								`}
									style={{
										borderBottom: '1px solid #E8EAED',
										borderRight: '1px solid #E8EAED',
										background: !isCurrentMonth ? blocked : '',
									}}
									onClick={() => {
										setActive(true)
									}}
								>
									<p className="text-[12px] text-[#101010] leading-3 absolute top-2 right-2">
										{date.date()}
									</p>
									<div className="absolute top-6 left-0 right-0 bottom-0 px-1">
										{slicedAppointments?.map((appointment: any) => {
											const currentColor = AppointmentStatusColor(
												appointment.appointmentStatus
											)
											return (
												<div
													style={{
														backgroundColor: currentColor + '30',
														borderLeft: `2px solid ${currentColor}`,
														color: currentColor,
													}}
													onClick={(e) => {
														e.stopPropagation()
														setAppointmentId(appointment.id)
														setActiveDetails(true)
													}}
													className="w-full h-[15px] rounded-[6px] overflow-hidden overflow-x-hidden"
												>
													<p className="text-[11px]">
														<span>{appointment.user.firstName}</span>{' '}
														<span>{appointment.user.lastName}</span>
														<span>
															{dayjs(appointment.startTime).format('HH:mm')} -{' '}
															{dayjs(appointment.endTime).format('HH:mm')}
														</span>
													</p>
												</div>
											)
										})}
									</div>
									<div className="absolute bottom-1 left-0 right-0 w-full px-1 flex items-center justify-between">
										{isMore && (
											<Dropdown
												open={openIndex === index}
												onOpenChange={(open) => {
													setOpenIndex(open ? index : null)
												}}
												overlay={
													<div
														style={{
															boxShadow: '1px 3px 10px 1px rgba(0, 0, 0, 0.1)',
														}}
														className="w-[170px] h-full bg-white rounded-[10px] p-2 border-[1px] border-[#E8EAED] border-solid"
													>
														<div className="flex items-center justify-between">
															<p className="text-[#101010] text-[13px] font-[600]">
																Все записи
															</p>
															<div
																onClick={(e) => {
																	e.stopPropagation()
																	setOpenIndex(null)
																}}
																className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
															>
																<IoClose />
															</div>
														</div>
														<div className="flex flex-col">
															{currentAppointments.map((appointment: any) => {
																return (
																	<div
																		onClick={(e) => {
																			e.stopPropagation()
																			setOpenIndex(null)
																			setAppointmentId(appointment.id)
																			setActiveDetails(true)
																		}}
																		className="w-full h-fit flex items-center gap-1 mb-1 hover:bg-gray-100 rounded-[6px] px-1 py-[1px]"
																	>
																		<div
																			style={{
																				backgroundColor: AppointmentStatusColor(
																					appointment.appointmentStatus
																				),
																			}}
																			className="w-2 h-2 min-w-[8px] rounded-full"
																		></div>
																		<p className="text-[12px] text-[#101010] cursor-pointer line-clamp-1 whitespace-nowrap overflow-x-auto max-w-full">
																			{appointment.user.firstName}{' '}
																			{appointment.user.lastName}
																		</p>
																	</div>
																)
															})}
														</div>
													</div>
												}
												trigger={['click']}
											>
												<p
													onClick={(e) => {
														e.stopPropagation()
														setOpenIndex(openIndex === index ? null : index)
													}}
													className="text-[12px] text-[#4E4E4E80]"
												>
													{lastAppointments.length} еще
												</p>
											</Dropdown>
										)}
									</div>
								</div>
							)
						})}
					</div>
				</>
			)}
		</div>
	)
}
