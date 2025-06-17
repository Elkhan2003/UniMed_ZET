import { useEffect, useMemo, useState } from 'react'
import { SlModal } from '../../../shared/sl-modal'
import {
	useLazyGetAppointmentPaymentCalculateQuery,
	usePostPaymentsClientMutation,
} from '../../../../store/services/calendar.service'
import {
	convertPaymentType,
	formatPhoneNumber,
} from '../../../../shared/lib/helpers/helpers'
import { Button } from '../../../UI/Buttons/Button/Button'

import { ReactComponent as BonusIcon } from '../../../../assets/icons/payment/bonus.svg'
import { ReactComponent as BalanceIcon } from '../../../../assets/icons/payment/balance.svg'
import { ReactComponent as CashIcon } from '../../../../assets/icons/payment/cash.svg'
import { ReactComponent as CardIcon } from '../../../../assets/icons/payment/card.svg'
import { ReactComponent as QRIcon } from '../../../../assets/icons/payment/qr-code.svg'
import { ReactComponent as ArrowLeft } from '../../../../assets/icons/arrow-up-icon.svg'
import Checkbox from '../../../UI/Checkbox'
import { ModalComponent } from '../../../UI/Modal/Modal'
import { toast } from 'react-hot-toast'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

dayjs.locale('ru')

const PAY_METHODS = [
	{
		id: 1,
		name: 'Бонусы',
		icon: <BonusIcon />,
		latin: 'BONUS_PAYMENT',
	},
	{
		id: 2,
		name: 'Баланс',
		icon: <BalanceIcon />,
		latin: 'BALANCE_PAYMENT',
	},
	{
		id: 3,
		name: 'Наличные',
		icon: <CashIcon />,
		latin: 'CASH',
	},
	{
		id: 4,
		name: 'Карта',
		icon: <CardIcon />,
		latin: 'CARD',
	},
	{
		id: 5,
		name: 'QR-код',
		icon: <QRIcon />,
		latin: 'QR_CODE',
	},
]

export const PayEdit = ({
	appointmentId,
	active,
	handleClose,
	onSuccess,
}: {
	appointmentId: number
	active: boolean
	handleClose: () => void
	onSuccess?: () => void
}) => {
	const [postPayment] = usePostPaymentsClientMutation()
	const [paymentPost, setPaymentPost] = useState<any>({
		appointmentId: appointmentId,
		payment: {
			BONUS: 0,
			BALANCE_PAYMENT: 0,
			CASH: 0,
			CARD: 0,
			QR_CODE: 0,
			DISCOUNT: 0,
			BONUS_PAYMENT: 0,
		},
		comment: '',
		isDebtPayment: false,
	})

	const [getAppointmentPaymentCalculate] =
		useLazyGetAppointmentPaymentCalculateQuery()
	const [data, setData] = useState<any>(null)
	const [activeStep, setActiveStep] = useState(1)
	const [checkedPays, setCheckedPays] = useState<any>([])
	const [inputModal, setInputModal] = useState({
		active: false,
		latin: '',
		name: '',
		icon: <></>,
		value: 0,
	})

	useEffect(() => {
		const fetchData = async () => {
			const res = await getAppointmentPaymentCalculate({
				appointmentId,
			})
			setData(res.data)
			setPaymentPost({
				...paymentPost,
				comment: res.data.comment,
				isDebtPayment: res.data.debt > 0,
				appointmentId: appointmentId,
			})
		}
		if (active) {
			fetchData()
		} else {
			setActiveStep(1)
			setCheckedPays([])
			setPaymentPost({
				...paymentPost,
				payment: {
					BONUS: 0,
					BALANCE_PAYMENT: 0,
					CASH: 0,
					CARD: 0,
					QR_CODE: 0,
					DISCOUNT: 0,
					BONUS_PAYMENT: 0,
				},
				comment: '',
			})
		}
	}, [active])

	useEffect(() => {
		if (data) {
			if (data?.paymentStatus === 'PARTIALLY') {
				setActiveStep(2)
			}
		}
	}, [data, active, activeStep])

	const setDiscount = (e: any) => {
		const value = Number(e.target.value || 0)
		if (value > 100 || Number.isNaN(value)) return
		setPaymentPost({
			...paymentPost,
			payment: {
				...paymentPost.payment,
				DISCOUNT: value,
				BONUS: 0,
			},
		})
	}

	const setBonus = (e: any) => {
		const value = Number(e.target.value || 0)
		if (value > 100 || Number.isNaN(value)) return
		setPaymentPost({
			...paymentPost,
			payment: { ...paymentPost.payment, BONUS: value, DISCOUNT: 0 },
		})
	}

	const saveCheckedPay = () => {
		setCheckedPays([...checkedPays, inputModal.latin])
		setInputModal({
			active: false,
			latin: '',
			name: '',
			icon: <></>,
			value: 0,
		})
		setPaymentPost({
			...paymentPost,
			payment: {
				...paymentPost.payment,
				[inputModal.latin]: inputModal.value,
			},
		})
	}

	const totalPayment = Object.entries(paymentPost.payment)
		.filter(([key]) => key !== 'BONUS' && key !== 'DISCOUNT')
		.reduce((acc: number, [, value]) => acc + Number(value), 0)

	const handlePay = async () => {
		try {
			const res: any = await postPayment(paymentPost)
			if (res['error']) {
				toast.error(
					res?.error?.data?.message ||
						res?.error?.data?.error ||
						'Ошибка при оплате'
				)
				return
			}
			toast.success('Оплата прошла успешно')
			onSuccess?.()
			handleClose()
		} catch (error: any) {
			toast.error(error?.data?.message || 'Ошибка при оплате')
		}
	}

	const afterDiscountAndBonus = (discount: number, bonus: number) => {
		const discountValue = (discount / 100) * data?.totalAmount
		const bonusValue = (bonus / 100) * data?.totalAmount
		return data?.totalAmount - discountValue - bonusValue - data?.totalPaid
	}

	const checkCanShow = (method: any) => {
		switch (method.latin) {
			case 'BONUS_PAYMENT':
				return data?.bonus > 0
			case 'BALANCE_PAYMENT':
				return data?.balance > 0
			default:
				return true
		}
	}

	const isBonusOrDiscount = (payment: string) => {
		if (payment === 'BONUS') return '%'
		if (payment === 'DISCOUNT') return '%'
		return 'сом'
	}

	return (
		<SlModal
			wrapperClassName="bg-[#F5F5F5]"
			headerClassName="bg-[#F5F5F5]"
			headerContent={
				<div className="flex items-center justify-between px-4 pt-4">
					<div className="flex items-center gap-4">
						<div
							onClick={() =>
								data?.paymentStatus === 'PARTIALLY'
									? handleClose()
									: activeStep > 1
										? setActiveStep(activeStep - 1)
										: handleClose()
							}
							className="p-2 rounded-full bg-[#D8DADC]"
						>
							<ArrowLeft className="w-[20px] h-[20px] path-[#101010] fill-[#101010] text-[#101010] rotate-[-90deg]" />
						</div>
						<p className="text-[16px] font-[600]">Оформление</p>
					</div>
					<button
						onClick={handleClose}
						className="text-[#101010] text-[22px] font-[300]"
					>
						✕
					</button>
				</div>
			}
			active={active}
			title="Оформление"
			handleClose={handleClose}
		>
			<ModalComponent
				active={inputModal.active}
				handleClose={() =>
					setInputModal({
						active: false,
						latin: '',
						name: '',
						icon: <></>,
						value: 0,
					})
				}
				title="Введите число"
			>
				<div className="w-[300px] h-full flex flex-col justify-between pb-[10px] gap-4">
					<div className="flex items-center gap-2">
						{inputModal.icon}
						<p className="text-[16px] text-[#101010]">{inputModal.name}</p>
					</div>
					<input
						className="w-full border-[1px] border-[#E8EAED] border-solid rounded-[10px] px-[12px] py-[8px]"
						value={inputModal.value}
						onChange={(e) => {
							if (Number.isInteger(Number(e.target.value))) {
								setInputModal({
									...inputModal,
									value: Number(e.target.value),
								})
							}
						}}
					/>
					<div className="flex items-center justify-between gap-2">
						<Button
							border="1px solid #D8DADC"
							borderRadius="16px"
							backgroundColor="transparent"
							color="#101010"
							onClick={() => {
								setInputModal({
									...inputModal,
									value: 0,
								})
								setCheckedPays(
									checkedPays.filter((pay: any) => pay !== inputModal.latin)
								)
							}}
						>
							Отменить
						</Button>
						<Button
							disabled={inputModal.value === 0}
							onClick={saveCheckedPay}
							borderRadius="16px"
						>
							Сохранить
						</Button>
					</div>
				</div>
			</ModalComponent>
			{activeStep === 1 && (
				<div className="w-full h-full flex flex-col justify-between pb-[10px]">
					<div className="w-full flex flex-col gap-4">
						<p className="text-center text-[16px] text-[#101010]">
							Данные об оплате
						</p>
						<div className="flex flex-col gap-1">
							<p className="text-[#4E4E4E80] text-[14px]">Клиент</p>
							<div className="bg-white p-[10px] rounded-[16px]">
								<div className="flex gap-[10px]">
									<img
										className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] bg-[#F2F2F1] rounded-full mt-1 shadow-sm"
										alt={
											data?.appointment?.user?.firstName +
											data?.appointment?.user?.lastName
										}
										src={data?.appointment?.user?.avatar}
									/>
									<div className="w-full">
										<h3 className="text-[14px] leading-[17px]">
											{data?.appointment?.user?.firstName}{' '}
											{data?.appointment?.user?.lastName}
										</h3>
										<p className="text-[#101010] text-[13px] leading-[17px]">
											{formatPhoneNumber(data?.appointment?.user?.phoneNumber)}
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<p className="text-[#4E4E4E80] text-[14px]">Детали услуги</p>
							<div className="bg-white px-[10px] py-[20px] rounded-[16px] flex flex-col gap-4">
								<p className="text-[12px] text-[#4E4E4E80] leading-[15px]">
									Всего услуг: {data?.appointment?.services?.length}
								</p>
								<div
									style={{
										borderBottom: '1px solid #E8EAED',
									}}
									className="w-full grid gap-2 pb-4"
								>
									{data?.appointment?.services.map(
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
														<p className="text-[14px] text-[#101010]">
															{service?.name}
														</p>
														<p className="text-[12px] text-[#4E4E4E80]">
															{service.duration} минут
														</p>
													</div>
												</div>

												<span className="text-[14px] text-[#101010] whitespace-nowrap">
													Цена: {service.price} сом
												</span>
											</div>
										)
									)}
								</div>
								<div className="flex items-center justify-between text-[14px]">
									<p>К оплате</p>
									<p>{data?.totalAmount} сом</p>
								</div>
								<div className="flex items-center justify-between text-[14px]">
									<p>Скидка</p>
									<div className="relative">
										<input
											onChange={setDiscount}
											value={paymentPost.payment.DISCOUNT}
											className="w-[100px] border-[1px] border-[#E8EAED] border-solid rounded-[10px] px-[12px] py-[8px]"
										/>
										<p className="absolute right-4 top-0 bottom-0 flex items-center justify-center text-[14px] text-[#4E4E4E80]">
											%
										</p>
									</div>
								</div>
								<div className="flex items-center justify-between text-[14px]">
									<p>Бонус</p>
									<div className="relative">
										<input
											onChange={setBonus}
											value={paymentPost.payment.BONUS}
											className="w-[100px] border-[1px] border-[#E8EAED] border-solid rounded-[10px] px-[12px] py-[8px]"
										/>
										<p className="absolute right-4 top-0 bottom-0 flex items-center justify-center text-[14px] text-[#4E4E4E80]">
											%
										</p>
									</div>
								</div>
								<p className="text-[#101010] text-[14px] font-[300]">
									*При вводе скидки бонусы не начисляются
								</p>
								<div
									style={{ borderBottom: '1px #E8EAED solid' }}
									className="w-full"
								/>
								<div className="flex items-center justify-between text-[14px]">
									<p>Итоговая</p>
									<p>
										{afterDiscountAndBonus(
											paymentPost.payment.DISCOUNT,
											paymentPost.payment.BONUS
										)}{' '}
										сом
									</p>
								</div>
							</div>
						</div>
					</div>
					<Button onClick={() => setActiveStep(2)}>Продолжить</Button>
				</div>
			)}
			{activeStep === 2 && (
				<div className="w-full h-full flex flex-col justify-between gap-4 pb-[10px]">
					<div className="w-full flex flex-col gap-4">
						<p className="text-center text-[16px] text-[#101010]">
							Выберите способ оплаты
						</p>
						<div className="bg-white p-[10px] rounded-[16px] flex flex-col justify-center items-center space-y-4">
							<div className="flex flex-col gap-2">
								<p className="text-[14px] text-[#4E4E4E80] text-center">
									Сумма
								</p>
								<p className="text-[20px] text-[#101010] text-center">
									{afterDiscountAndBonus(
										paymentPost.payment.DISCOUNT,
										paymentPost.payment.BONUS
									)}{' '}
									сом
								</p>
							</div>
						</div>
						{data?.paymentStatus === 'PARTIALLY' && (
							<div className="bg-white p-[10px] rounded-[16px] flex flex-col justify-center items-center space-y-4">
								<div className="w-full flex flex-col gap-1">
									{data?.paymentGroups?.map((group: any) => (
										<div
											style={{ borderBottom: '1px solid #E8EAED' }}
											key={group.id}
											className="w-full flex flex-col gap-2 mb-2 pb-2"
										>
											<p className="text-[14px] text-[#101010]">
												{dayjs(group.date).format('dddd, D MMMM YYYY, HH:mm')}
											</p>
											<div className="flex flex-col">
												{group.payments?.map((payment: any) => (
													<div className="flex items-center justify-between text-[14px] text-[#101010]">
														<p>{convertPaymentType(payment.paymentType)}</p>
														<p>
															{payment.amount}{' '}
															{isBonusOrDiscount(payment.paymentType)}
														</p>
													</div>
												))}
											</div>
										</div>
									))}
									<div className="flex items-center justify-between">
										<p>Оплачено</p>
										<p>{data?.totalPaid} сом</p>
									</div>
									<div className="flex items-center justify-between text-[14px] text-[#FF5E5E]">
										<p>Долг</p>
										<p>{data?.debt} сом</p>
									</div>
								</div>
							</div>
						)}
						<div className="w-full flex flex-col gap-2">
							{PAY_METHODS.map(
								(method) =>
									checkCanShow(method) && (
										<div
											key={method.id}
											className="w-full flex items-center bg-white rounded-[10px] p-[10px] justify-between relative"
										>
											<div className="flex items-center gap-[10px] ">
												<Checkbox
													checked={checkedPays.includes(method.latin)}
													setChecked={() => {
														if (checkedPays.includes(method.latin)) {
															setCheckedPays(
																checkedPays.filter(
																	(pay: any) => pay !== method.latin
																)
															)
															setPaymentPost({
																...paymentPost,
																payment: {
																	...paymentPost.payment,
																	[method.latin]: 0,
																},
															})
														} else {
															setInputModal({
																active: true,
																latin: method.latin,
																name: method.name,
																icon: method.icon,
																value: 0,
															})
														}
													}}
												/>
												{method.icon}
												<p>{method.name}</p>
											</div>
											{method.latin === 'BONUS_PAYMENT' && data?.bonus > 0 && (
												<p className="absolute right-4 top-0 bottom-0 flex items-center justify-center text-[14px] text-[#101010]">
													{data?.bonus}
												</p>
											)}
											{method.latin === 'BALANCE_PAYMENT' &&
												data?.balance > 0 && (
													<p className="absolute right-4 top-0 bottom-0 flex items-center justify-center text-[14px] text-[#101010]">
														{data?.balance}
													</p>
												)}
										</div>
									)
							)}
						</div>
						{totalPayment > 0 && (
							<div className="bg-white rounded-[10px] p-[10px] flex flex-col gap-2">
								{Object.entries(paymentPost.payment)
									.filter(([key]) => key !== 'BONUS' && key !== 'DISCOUNT')
									.map(
										([key, value]: any) =>
											value > 0 && (
												<div
													key={key}
													className="w-full flex items-center justify-between text-[14px]"
												>
													<p>{convertPaymentType(key)}</p>
													<p>{value}</p>
												</div>
											)
									)}
								<div className="bg-[#E8EAED] h-[1px] w-full" />
								<div className="flex items-center justify-between">
									<p>Введено</p>
									<p>{totalPayment} сом</p>
								</div>
							</div>
						)}
						<div className="flex flex-col gap-2">
							<p className="text-[14px] text-[#101010]">Комментарий к оплате</p>
							<textarea
								className="w-full border-[1px] border-[#E8EAED] text-[14px] text-[#101010] border-solid rounded-[10px] px-[12px] py-[8px] placeholder:text-[#4E4E4E80] placeholder:text-[14px]"
								placeholder="Введите комментарий"
								onChange={(e) => {
									setPaymentPost({
										...paymentPost,
										comment: e.target.value,
									})
								}}
								value={paymentPost.comment}
							/>
						</div>
					</div>
					<Button disabled={totalPayment === 0} onClick={handlePay}>
						Завершить
					</Button>
				</div>
			)}
		</SlModal>
	)
}
