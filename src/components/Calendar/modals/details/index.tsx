import { useEffect, useState } from 'react'
import { IoMdTime } from 'react-icons/io'
import {
	useCancelAppointmentMutation,
	useLazyGetAppointmentPaymentCalculateQuery,
	usePutAppointmentDataMutation,
} from '../../../../store/services/calendar.service'
import {
	AppointmentStatusLinear,
	convertPayment,
	convertStatus,
	filterTemplateByStatus,
	formatDateToRussian,
	formatPhoneNumber,
	formatServiceInfo,
	openWhatsAppChat,
} from '../../../../shared/lib/helpers/helpers'
import { TbDotsCircleHorizontal } from 'react-icons/tb'
import { ReactComponent as ServiceFolder } from '../../../../assets/icons/service-folder.svg'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { RiArrowRightSLine } from 'react-icons/ri'
import { UserAppointments } from '../user-appointments'
import { ReactComponent as Edit } from '../../../../assets/icons/Edit.svg'
import { ReactComponent as Paper } from '../../../../assets/icons/Paper Fail.svg'
import { ReactComponent as Whatsapp } from '../../../../assets/icons/соц сети.svg'
import { ReactComponent as Dollar } from '../../../../assets/icons/Dollar (USD).svg'
import { MdKeyboardArrowRight } from 'react-icons/md'
import toast from 'react-hot-toast'
import { useLazyGetTemplateQuery } from '../../../../store/services/push-template.service'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { EditModal } from '../edit'
import { ROLES } from '../../../../shared/lib/constants/constants'
import Loading from '../../../../pages/loading'
import { SlModal } from '../../../shared/sl-modal'
import { PayCreate } from '../pay/create'

import dayjs from 'dayjs'
import 'dayjs/locale/ru'

dayjs.locale('ru')

interface Details {
	appointmentId: number
	active: boolean
	handleClose: (props?: any) => void
	onSuccess?: any
	onOpen?: any
}

export const Details = ({
	appointmentId,
	active,
	handleClose,
	onSuccess = () => false,
	onOpen = (id: number) => false,
}: Details) => {
	const { individualData } = useSelector((state: RootState) => state.individual)
	const { branchAdminMasterJwt } = useSelector(
		(state: RootState) => state.branch
	)
	const { role } = useSelector((state: RootState) => state.auth)

	const [data, setData] = useState<any>(undefined)
	const [Templates, setTemplates] = useState<any>([])
	const [isLoading, setIsLoading] = useState(false)
	const [paymentModal, setPaymentModal] = useState(false)
	const [editModal, setEditModal] = useState(false)
	const [getPayment] = useLazyGetAppointmentPaymentCalculateQuery()
	const [getTemplate] = useLazyGetTemplateQuery()

	const handleGetApp = async () => {
		try {
			setIsLoading(true)
			const response = await getPayment({ appointmentId })
			setData(response.data)
		} catch (error) {
			toast.error('Произошла ошибка')
		} finally {
			setIsLoading(false)
		}
	}

	const handleGetTemp = async () => {
		try {
			const response = await getTemplate(
				role === ROLES.PERSONAl_MASTER
					? individualData?.branchId
					: branchAdminMasterJwt?.branchId
			)
			setTemplates(response.data)
		} catch (error) {
			toast.error('Произошла ошибка')
		}
	}

	useEffect(() => {
		if (appointmentId !== 0 && active === true) {
			handleGetApp()
			handleGetTemp()
			onOpen(appointmentId)
		}
	}, [active])

	const [cancel] = useCancelAppointmentMutation()
	const [putAppointment] = usePutAppointmentDataMutation()

	const [activeUser, setActiveUser] = useState(false)
	const [userId, setUserId] = useState(0)

	const handleCancel = async () => {
		try {
			const response: any = await cancel(appointmentId)
			if (response.data === null) {
				toast.success('Запись отменена!')
			}
			await handleGetApp()
			onSuccess()
		} catch (error) {
			toast.error('Произошла ошибка!')
		}
	}

	const handleAppointmentLinear = async () => {
		try {
			if (data?.appointment?.appointmentStatus === 'ARRIVE') {
				setPaymentModal(true)
			} else {
				const response: any = await putAppointment({
					appointmentId: appointmentId,
					appointmentData: {
						masterId: data?.appointment?.master?.id,
						serviceIds: data?.appointment?.services?.map(
							(service: any) => service.id
						),
						appointmentStatus: AppointmentStatusLinear(
							data?.appointment?.appointmentStatus
						).value,
						startDate: data?.appointment?.startTime?.split('T')[0],
						startTime: data?.appointment?.startTime?.split('T')[1],
						endTime: data?.appointment?.endTime?.split('T')[1],
						description: data?.appointment?.description || '',
						notifiedTime: 'NONE',
					},
				})
				if (response?.data?.id) {
					toast.success(
						AppointmentStatusLinear(data?.appointment?.appointmentStatus)
							.message
					)
				}
				await handleGetApp()
			}
		} catch (error) {
			toast.error('Произошла ошибка!')
		}
	}

	const allDuration = data?.appointment?.services?.reduce(
		(acc: any, curr: any) => acc + curr.duration,
		0
	)

	const currentTemplate = Templates?.find(
		(item: any) =>
			item.pushTemplateType ===
			filterTemplateByStatus(data?.appointment?.appointmentStatus)
	)

	const datas: any = data
		? {
				master_name: `${data?.appointment?.master?.firstName} ${data?.appointment?.master?.lastName || ''}`,
				phone_number: `${data?.appointment?.master?.phoneNumber}`,
				address: 'не указано',
				user_name: `${data?.appointment?.user?.firstName} ${data?.appointment?.user?.lastName || ''}`,
				services: `${data?.appointment?.services.map((item: any) => item?.name)}`,
				date: `${formatDateToRussian(data?.appointment?.startTime?.split('T')[0])}`,
				start_time: `${data?.appointment?.startTime?.split('T')[1]?.slice(0, 5)}`,
				end_time: `${data?.appointment?.endTime?.split('T')[1]?.slice(0, 5)}`,
			}
		: {}

	const formattedMessage = currentTemplate?.template?.replace(
		/\{([^}]+)\}/g,
		(_: any, key: any) => datas[key] || `{${key}}`
	)

	useEffect(() => {
		if (data) {
			setUserId(data.appointment.user.id)
		}
	}, [])

	const isBonusOrDiscount = (payment: string) => {
		if (payment === 'BONUS') return '%'
		if (payment === 'DISCOUNT') return '%'
		return 'сом'
	}

	const calculateTotalPaidWithDiscountOrBonus = (payments: any) => {
		const totalWithoutDiscountOrBonus = payments
			?.filter(
				(item: any) =>
					item.paymentType !== 'BONUS' && item.paymentType !== 'DISCOUNT'
			)
			.reduce((acc: any, curr: any) => acc + curr.amount, 0)

		const totalWithDiscountOrBonus = payments?.reduce((acc: any, curr: any) => {
			if (curr.paymentType === 'BONUS' || curr.paymentType === 'DISCOUNT') {
				return acc + (totalWithoutDiscountOrBonus * curr.amount) / 100
			}
			return acc + curr.amount
		}, 0)
		return totalWithDiscountOrBonus
	}

	return (
		<>
			<SlModal
				active={active}
				handleClose={handleClose}
				title="Детали записи"
				wrapperClassName="bg-[#F5F5F5] min-w-[550px] w-[550px]"
				headerClassName="bg-[#F5F5F5]"
			>
				{isLoading ? (
					<div className="w-full h-[86vh] flex items-center justify-center">
						<Loading />
					</div>
				) : (
					<div className="w-full space-y-3 relative">
						{data?.appointment?.appointmentStatus !== 'COMPLETED' && (
							<div
								onClick={() => setEditModal(true)}
								className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer fixed right-4 top-4"
							>
								<Edit />
							</div>
						)}
						<div className="px-[20px] py-[10px] rounded-[24px] bg-white space-y-2">
							<p className="text-[16px] font-[400] text-[#101010]">
								Запись №{appointmentId}
							</p>
							<div className="flex items-center gap-2">
								<div className="flex items-center justify-between">
									{convertStatus(data?.appointment?.appointmentStatus)}
								</div>
								{data?.paymentStatus === 'PARTIALLY' && (
									<div className="rounded-[16px] py-[6px] px-[10px] bg-[#FFDEC0]">
										<p className="text-[14px] text-[#FF8A24]">
											Частично оплачено
										</p>
									</div>
								)}
								{data?.paymentStatus === 'PAID' && (
									<div className="rounded-[16px] py-[6px] px-[10px] bg-[#D6FFD4]">
										<p className="text-[14px] text-[#3FC24C]">Оплачено</p>
									</div>
								)}
							</div>
							<div className="flex mb-[10px] justify-between items-center">
								<div className="flex gap-[10px]">
									<img
										className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] bg-[#F2F2F1] rounded-full mt-1 shadow-sm"
										alt={
											data?.appointment?.user?.firstName +
											data?.appointment?.user?.lastName
										}
										src={data?.appointment?.user?.avatar}
									/>
									<div>
										<h3 className="text-base font-medium">
											{data?.appointment?.user?.firstName}{' '}
											{data?.appointment?.user?.lastName}
										</h3>
										<p className="text-[#101010] text-[14px]">
											{formatPhoneNumber(data?.appointment?.user?.phoneNumber)}
										</p>
										<p className="text-[#4E4E4E80] text-[14px] leading-[14px]">
											Всего визитов: {data?.appointment?.numberOfVisits}
										</p>
									</div>
								</div>
								<div
									onClick={() => {
										setUserId(data?.appointment?.user?.id)
										setActiveUser(true)
									}}
									className="bg-[#F9F9F9] p-1 rounded-[8px] cursor-pointer"
								>
									<RiArrowRightSLine size={24} />
								</div>
							</div>
						</div>
						<div className="px-[20px] py-[10px] rounded-[24px] bg-white space-y-2">
							<div className="mb-4 flex gap-[10px]">
								<img
									className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full object-cover shadow-sm mt-1"
									src={data?.appointment?.master?.avatar}
									alt={data?.appointment?.master?.firstName}
								/>
								<div>
									<h3 className="text-base font-medium">
										{data?.appointment?.master?.firstName}{' '}
										{data?.appointment?.master?.lastName}
									</h3>

									<div className="flex flex-col">
										{data?.appointment?.master?.specialization?.map(
											(item: any) => (
												<p className="text-[#4E4E4E80] text-[14px] leading-[15px]">
													{item?.name},
												</p>
											)
										)}
									</div>
								</div>
							</div>
							<div className="mb-4 flex gap-[15px]">
								<IoMdTime
									strokeWidth={1}
									className="text-[#4E4E4E80] mt-1"
									size={24}
								/>
								<div>
									<p className="text-[#101010] text-base font-medium">
										{formatServiceInfo(data?.appointment)}
									</p>
									<p className="text-[#4E4E4E80] text-[14px] leading-[15px]">
										Продолжительность: {allDuration} минут
									</p>
								</div>
							</div>
							<div className="mb-4 flex gap-[15px]">
								<TbDotsCircleHorizontal
									className="text-[#4E4E4E80] mt-1"
									size={24}
									strokeWidth={1.3}
								/>
								<div>
									<p className="text-[14px] text-[#4E4E4E80] leading-[15px]">
										Комментарий
									</p>
									<p className="text-[15px]">
										{data?.appointment?.description || 'Нет комментария'}
									</p>
								</div>
							</div>
						</div>
						<div className="px-[20px] py-[10px] rounded-[24px] bg-white space-y-2">
							<div className="mb-4 space-y-2">
								<div className="flex items-center gap-[15px]">
									<ServiceFolder />
									<h4 className="text-[14px]">Список услуг</h4>
								</div>
								<p className="text-[14px] text-[#4E4E4E80] leading-[15px]">
									Всего услуг: {data?.appointment?.services.length}
								</p>
								{data?.appointment?.services?.map(
									(service: any, index: number) => (
										<div
											key={index}
											className="flex justify-between items-center"
										>
											<div className="flex w-full items-center gap-2">
												{service?.icon && (
													<img
														src={service.icon}
														className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full object-cover shadow-sm"
													/>
												)}
												<div className="w-full">
													<p className="text-base font-medium text-[#101010]">
														{service?.name}
													</p>
													<p className="text-[14px] font-medium text-[#4E4E4E80]">
														{service.duration} минут
													</p>
												</div>
											</div>

											<span className="text-[14px] font-medium text-[#4E4E4E80] whitespace-nowrap">
												Цена: {service.price} сом
											</span>
										</div>
									)
								)}
							</div>
						</div>
						{data?.appointment?.appointmentStatus === 'CANCELED' ||
						data?.appointment?.appointmentStatus === 'COMPLETED' ||
						data?.appointment?.appointmentStatus === 'NOT_COME' ? (
							<></>
						) : (
							<Button borderRadius="16px" onClick={handleAppointmentLinear}>
								{
									AppointmentStatusLinear(data?.appointment?.appointmentStatus)
										.label
								}
							</Button>
						)}
						{(data?.paymentStatus === 'PAID' ||
							data?.paymentStatus === 'PARTIALLY') && (
							<>
								{data?.paymentGroups?.map(
									(item: any, paymentGroupIndex: number) => (
										<div className="w-full flex flex-col bg-white rounded-[24px] p-[10px] relative">
											<div className="absolute top-[10px] right-[10px] rounded-full bg-[#F2F2F1] p-2 cursor-pointer">
												<Edit
													style={{
														width: '18px',
														height: '18px',
													}}
												/>
											</div>
											<div className="flex items-center gap-[10px]">
												<IoMdTime
													strokeWidth={1}
													className="text-[#4E4E4E80] mt-1 ml-[2px]"
													size={20}
												/>
												<p className="text-[14px] text-[#101010] mt-1">
													{dayjs(data?.appointment?.startTime).format(
														'dddd, D MMMM YYYY, HH:mm'
													)}
												</p>
											</div>
											<div className="w-full flex gap-[10px]">
												<Dollar />
												<p className="text-[16px] text-[#101010]">
													К оплате:{' '}
													{paymentGroupIndex === 0
														? data?.totalAmount
														: calculateTotalPaidWithDiscountOrBonus(
																item?.payments
															)}
													сом
												</p>
											</div>
											<div className="flex flex-col gap-[5px] pl-[30px]">
												{item?.payments?.map((item: any) => (
													<div className="flex items-center gap-[5px] leading-[12px] ml-[2px]">
														<p className="text-[12px] text-[#4E4E4E80]">
															{convertPayment(item?.paymentType)}:
														</p>
														<p className="text-[12px] text-[#101010]">
															{item?.amount}{' '}
															{isBonusOrDiscount(item.paymentType)}
														</p>
													</div>
												))}
												<div className="flex items-center gap-[5px] leading-[12px] ml-[2px]">
													<p className="text-[12px] text-[#4E4E4E80]">
														Итоговая:
													</p>
													<p className="text-[12px] text-[#101010]">
														{paymentGroupIndex === 0
															? data?.totalAmount -
																(data?.totalAmount *
																	item?.payments
																		?.filter(
																			(item: any) =>
																				item.paymentType === 'BONUS' ||
																				item.paymentType === 'DISCOUNT'
																		)
																		.reduce(
																			(acc: any, curr: any) =>
																				acc + curr.amount,
																			0
																		)) /
																	100
															: item?.payments
																	?.filter(
																		(item: any) =>
																			item.paymentType !== 'BONUS' &&
																			item.paymentType !== 'DISCOUNT'
																	)
																	.reduce(
																		(acc: any, curr: any) => acc + curr.amount,
																		0
																	)}
														сом
													</p>
												</div>
												{paymentGroupIndex ===
													data?.paymentGroups?.length - 1 &&
													data?.totalPaid - data?.totalAmount > 0 && (
														<div className="flex items-center gap-[5px] leading-[12px] ml-[2px]">
															<p className="text-[12px] text-[#4E4E4E80]">
																Переплата:
															</p>
															<p className="text-[12px] text-[#101010]">
																{data?.totalPaid - data?.totalAmount} сом
															</p>
														</div>
													)}
											</div>
										</div>
									)
								)}
							</>
						)}
						<div className="px-[20px] py-[10px] rounded-[24px] bg-white space-y-4">
							<div className="flex flex-col">
								{data?.paymentStatus === 'NOT_PAID' && (
									<div className="w-full flex gap-[7px]">
										<Dollar />
										<div className="w-full flex flex-col">
											<p className="text-[16px] text-[#101010]">
												Оплачено: {data?.totalPaid} сом
											</p>
											<p className="text-[14px] text-[#4E4E4E80]">
												Оплата:
												<span className="text-black ml-1">
													{data?.totalAmount}
													сом
												</span>
											</p>
										</div>
									</div>
								)}
							</div>
							{data?.appointment?.appointmentStatus === 'COMPLETED' ||
							data?.appointment?.appointmentStatus === 'ARRIVE' ? (
								<></>
							) : (
								<div
									onClick={() =>
										openWhatsAppChat(
											data?.appointment?.user?.phoneNumber,
											formattedMessage
										)
									}
									className="flex items-center justify-between bg-[#D6FFD4] px-[8px] py-[5px] rounded-[10px] hover:shadow-md cursor-pointer"
								>
									<div className="flex items-center gap-[5px]">
										<Whatsapp />
										<p className="text-[#3FC24C]">Напомнить в WhatsApp</p>
									</div>
									<MdKeyboardArrowRight color="#3FC24C" size={24} />
								</div>
							)}
							<div
								onClick={handleCancel}
								className="flex items-center gap-[5px] mt-2 text-[#FF5E5E] cursor-pointer"
							>
								<Paper />
								<p className="mt-[2px]">Отменить запись</p>
							</div>
						</div>
					</div>
				)}
			</SlModal>
			<PayCreate
				appointmentId={appointmentId}
				active={paymentModal}
				handleClose={() => setPaymentModal(false)}
				onSuccess={handleGetApp}
			/>
			<UserAppointments
				userId={userId}
				active={activeUser}
				handleClose={() => {
					setActiveUser(false)
				}}
			/>
			<EditModal
				active={editModal}
				handleClose={() => setEditModal(false)}
				data={data?.appointment}
				onSuccess={handleGetApp}
			/>
		</>
	)
}
