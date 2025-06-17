import React, { useState, useEffect } from 'react'
import { ModalComponent } from '../../../UI/Modal/Modal'
import { FaArrowLeftLong, FaRegUser } from 'react-icons/fa6'
import { PAYMENTS_CARDS } from '../../../../shared/lib/constants/constants'
import { Input } from '../../../UI/Inputs/Input/Input'
import { Button } from '../../../UI/Buttons/Button/Button'
import { usePostPaymentsClientMutation } from '../../../../store/services/calendar.service'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import styled from 'styled-components'

export const PaymentModal = (props: any) => {
	const [selectedCards, setSelectedCards] = useState<string[]>([])
	const [amounts, setAmounts] = useState<{ [key: string]: string }>({})
	const [overpaidAmount, setOverpaidAmount] = useState(0)
	const [remainingAmount, setRemainingAmount] = useState<number>(
		props?.paymentData?.sum || 0
	)

	const [postPaymentsClient, { isLoading }] = usePostPaymentsClientMutation()

	const {
		control,
		handleSubmit: formHandleSubmit,
		formState: { errors },
		setValue,
		reset,
	} = useForm({
		defaultValues: {
			amounts: amounts,
		},
	})

	useEffect(() => {
		const totalEntered = Object.values(amounts).reduce(
			(sum, amount) => sum + parseFloat(amount || '0'),
			0
		)
		const remaining = (props?.paymentData?.sum || 0) - totalEntered
		const overpaid = totalEntered - (props?.paymentData?.sum || 0)

		if (remaining <= 0) {
			setRemainingAmount(0)
			setOverpaidAmount(overpaid)
		} else {
			setRemainingAmount(remaining)
			setOverpaidAmount(0)
		}
	}, [amounts, props?.paymentData?.sum])

	const handleCardSelect = (name: string) => {
		setSelectedCards((prevSelectedCards) => {
			if (prevSelectedCards.includes(name)) {
				setAmounts((prevAmounts) => ({
					...prevAmounts,
					[name]: '0',
				}))
				setValue(`amounts.${name}`, '0')
				return prevSelectedCards.filter((card) => card !== name)
			} else {
				return [...prevSelectedCards, name]
			}
		})
	}

	const handlePaymentModalClose = () => {
		props.handleClose()
		setSelectedCards([])
		setAmounts({})
		setRemainingAmount(props?.paymentData?.sum || 0)
		reset()
	}

	const handleAmountChange = (card: string, value: string) => {
		setAmounts((prevAmounts) => ({
			...prevAmounts,
			[card]: value || '',
		}))
	}

	const handleSubmit = async (data: any) => {
		const PAYMENT_TYPE: { [key: string]: string } = {
			MBANK: 'MBANK',
			'Optima Bank': 'OPTIMA',
			Бонусы: 'BONUS',
			Карта: 'CARD',
			Наличные: 'CASH',
		}

		const paymentData: {
			appointmentId?: string
			payment: { [key: string]: any }
			comment?: string
		} = {
			appointmentId: props?.appointmentId,
			payment: selectedCards.reduce((acc: any, card: string) => {
				const paymentType = PAYMENT_TYPE[card]
				if (paymentType && data.amounts[card] != null) {
					acc[paymentType] = data.amounts[card]
				}
				return acc
			}, {}),
			comment: data.comment,
		}

		Object.keys(paymentData.payment).forEach((key) => {
			if (!paymentData.payment[key]) {
				delete paymentData.payment[key]
			}
		})

		// if (paymentData.comment === '') {
		// 	delete paymentData.comment
		// }

		try {
			const response = await postPaymentsClient(paymentData).unwrap()
			props.onAddSuccesPaymentData(response)
			reset()
			setSelectedCards([])
			setAmounts({})
			props.setAppointmentCalendarModal({
				create: false,
				update: false,
			})
			toast.success('Успешно оплачено!')
		} catch (error: any) {
			toast.error(error?.data?.message || 'Произошла ошибка')
		}
		finally {
			props.getCalendarRefetch()
		}
	}

	function formatPhoneNumber(phoneNumber: string) {
		const cleaned = ('' + phoneNumber).replace(/\D/g, '')
		const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{3})$/)

		if (match) {
			return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`
		}

		return phoneNumber
	}

	return (
		<StyledModal
			handleClose={handlePaymentModalClose}
			title={
				<div className="flex items-center gap-[10px] pl-[20px] ">
					<div
						className="flex items-center justify-center w-[44px] h-[44px] rounded-lg bg-[#D8DADC] cursor-pointer"
						onClick={handlePaymentModalClose}
					>
						<FaArrowLeftLong />
					</div>
					<h1 className="text-lg font-semibold">Оформление</h1>
				</div>
			}
			active={props.active}
		>
			<div className="p-[20px] pt-[5px]">
				<div className="mb-6">
					<p className="font-medium text-[#4E4E4E80]">Клиент</p>
					<div className="flex items-center gap-[10px]">
						<button className="w-[30px] h-[30px] bg-[#F2F2F1] rounded-[50%] flex items-center justify-center">
							<FaRegUser className="fill-[#FF99D4]" />
						</button>
						<div className="text-sm text-medium text-[#101010]">
							<p>{props?.title}</p>
							<p>{formatPhoneNumber(props.phoneNumber)}</p>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-3 gap-4">
					{PAYMENTS_CARDS.map((option) => (
						<div key={option.name} className="flex flex-col">
							<button
								onClick={() => handleCardSelect(option.name)}
								className={`p-3 border rounded-lg w-[160px] ${
									selectedCards.includes(option.name)
										? 'border-blue-500 bg-[#FF99D4] group'
										: 'border-gray-200 bg-[#FFFFFF]'
								}`}
							>
								<option.Icon
									color={
										selectedCards.includes(option.name) ? 'white' : '#FF99D4'
									}
								/>
								<p
									className={`text-start mt-[5px] text-base font-medium ${
										selectedCards.includes(option.name)
											? 'text-white'
											: 'text-[#000]'
									}`}
								>
									{option.name}
								</p>
							</button>
						</div>
					))}
				</div>

				<div className="mt-1 mb-[10px] flex justify-between items-center">
					<p className="text-lg font-semibold text-[#101010]">К оплате</p>
					<p className="text-lg font-semibold text-[#101010]">
						{props?.paymentData?.sum} сом
					</p>
				</div>
				{selectedCards.length ? (
					<>
						<div className="mt-1 flex justify-between items-center">
							<p className="text-[16px] font-medium text-black-500">Введено</p>
							<p className="text-[16px] font-medium text-black-500">
								{Math.min(
									Object.values(amounts).reduce(
										(sum, amount) => sum + parseFloat(amount || '0'),
										0
									),
									props?.paymentData?.sum
								)}{' '}
								сом
								{Object.values(amounts).reduce(
									(sum, amount) => sum + parseFloat(amount || '0'),
									0
								) > props?.paymentData?.sum && (
									<span className="text-[#3FC24C] text-sm">
										{' '}
										+
										{Object.values(amounts).reduce(
											(sum, amount) => sum + parseFloat(amount || '0'),
											0
										) - props?.paymentData?.sum}{' '}
										сом
									</span>
								)}
							</p>
						</div>

						{remainingAmount > 0 && (
							<div className="mt-1 mb-[10px] flex justify-between items-center">
								<p className="text-[16px] font-medium text-red-500">Осталось</p>
								<p className="text-[16px] font-medium text-red-500">
									{Math.abs(remainingAmount)} сом
								</p>
							</div>
						)}
					</>
				) : null}

				{selectedCards.map((card) => (
					<div key={card} className="mt-[10px]">
						<label htmlFor="">{card}</label>
						<Controller
							name={`amounts.${card}`}
							control={control}
							rules={{
								required: {
									value: true,
									message: 'Сумма обязательна для этого способа',
								},

								pattern: {
									value: /^\d+(\.\d+)?$/,
									message: 'Введите корректную сумму',
								},
							}}
							render={({ field }) => (
								<Input
									{...field}
									placeholder="Введите сумму"
									onChange={(e) => {
										handleAmountChange(card, e.target.value)
										field.onChange(e)
									}}
								/>
							)}
						/>

						{errors.amounts?.[card] && (
							<p className="text-red-500 text-sm">
								{errors.amounts[card]?.message}
							</p>
						)}
					</div>
				))}

				<div className="mt-4">
					<Button
						onClick={formHandleSubmit(handleSubmit)}
						isLoading={isLoading}
						disabled={selectedCards?.length === 0}
					>
						Завершить
					</Button>
				</div>
			</div>
		</StyledModal>
	)
}

const StyledModal = styled(ModalComponent)`
	.ant-modal-content {
		max-height: 714px;
		overflow-y: scroll;
		background: #f9f9f9;
	}
	.ant-modal-header {
		background: none;
	}
`
