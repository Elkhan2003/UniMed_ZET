import React, { useEffect, useState } from 'react'
import { ModalComponent } from '../../../../components/UI/Modal/Modal'
import { InputNumberMask } from '../../../../components/UI/Inputs/InputMask/InputMask'
import { Input } from '../../../../components/UI/Inputs/Input/Input'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { useDispatch } from 'react-redux'
import {
	useCheckPhoneNumberQuery,
	usePutUserMutation,
} from '../../../../store/services/user.service'
import { GENDER } from '../../../../shared/lib/constants/constants'
import { InoiSelect } from '../../../../components/UI/select'
import { NewDatePicker } from '../../../../components/shared/date-picker'
import { TextArea } from '../../../../components/UI/Inputs/TextArea/TextArea'
import toast from 'react-hot-toast'

interface EditNewUser {
	isOpenModal: boolean
	handleClose: () => void
	dataNewUser: any
	setDataNewUser: (bol: any) => void
	userId: number
	registered: boolean
	setOpen: any
}

export default function EditNewUser({
	isOpenModal,
	handleClose,
	dataNewUser,
	setDataNewUser,
	userId,
	setOpen,
	registered,
}: EditNewUser) {
	const [putUser] = usePutUserMutation()
	const [validation, setValidation] = useState(true)
	const [loading, setLoading] = useState(false)

	const forDate = new Date(dataNewUser.birthDate)

	const { data: phone_number = false } = useCheckPhoneNumberQuery(
		dataNewUser?.authInfoUpdateRequest?.phoneNumber.slice(1),
		{ skip: !dataNewUser.authInfoUpdateRequest.phoneNumber }
	)

	useEffect(() => {
		if (dataNewUser.isUnregistered) {
			setValidation(
				dataNewUser.authInfoUpdateRequest.phoneNumber === ''
					? true
					: dataNewUser.firstName === ''
						? true
						: dataNewUser.lastName === ''
							? true
							: phone_number === true
								? true
								: false
			)
		} else {
			setValidation(dataNewUser.discount === '' ? true : false)
		}
	}, [dataNewUser])

	async function handlePost() {
		try {
			setLoading(true)
			const response: any = await putUser({
				userId: userId,
				body: { ...dataNewUser, gender: dataNewUser.gender.value },
			}).unwrap()
			setOpen(false)
			handleClose()
			toast.success('Клиент успешно изменен')
		} catch (error) {
			toast.error('Произошла ошибка')
		} finally {
			setLoading(false)
		}
	}

	return (
		<ModalComponent
			title="Редактировать клиента"
			active={isOpenModal}
			handleClose={handleClose}
		>
			<div className="w-[320px] flex flex-col gap-2">
				{registered ? (
					<>
						<Input
							label="Имя"
							placeholder="Введите имя клиента"
							value={dataNewUser.firstName}
							onChange={(e) =>
								setDataNewUser({ ...dataNewUser, firstName: e.target.value })
							}
							required
						/>
						<Input
							label="Фамилия"
							placeholder="Введите фамилию клиента"
							value={dataNewUser.lastName}
							onChange={(e) =>
								setDataNewUser({ ...dataNewUser, lastName: e.target.value })
							}
							required
						/>
						<InputNumberMask
							label="Номер телефона"
							onChange={(value) =>
								setDataNewUser({
									...dataNewUser,
									authInfoUpdateRequest: {
										...dataNewUser.authInfoUpdateRequest,
										phoneNumber: value,
									},
								})
							}
							value={dataNewUser.authInfoUpdateRequest.phoneNumber}
							error={
								phone_number === true ? 'Этот номер уже используеться!' : ''
							}
							required
						/>
						<InoiSelect
							title="Пол"
							placeholder="Укажите пол клиента"
							options={GENDER}
							value={dataNewUser.gender}
							setValue={(option: any) =>
								setDataNewUser({ ...dataNewUser, gender: option })
							}
							required
						/>
						<NewDatePicker
							label="Дата рождения"
							date={forDate}
							setDate={(date: string) =>
								setDataNewUser({ ...dataNewUser, birthDate: date })
							}
						/>
					</>
				) : (
					''
				)}
				<Input
					label="Скидка %"
					placeholder="%"
					value={dataNewUser.discount}
					onChange={(e) => {
						const value = e.target.value

						if (/^\d*$/.test(value) && (value === '' || Number(value) <= 100)) {
							setDataNewUser({ ...dataNewUser, discount: value })
						}
					}}
				/>
				<TextArea
					label="Комментарий"
					placeholder="Напишите комментарий"
					value={dataNewUser.comment}
					onChange={(e: any) =>
						setDataNewUser({
							...dataNewUser,
							comment: e,
						})
					}
				/>
			</div>
			<div className="flex items-center justify-end gap-4 mt-4">
				<Button
					width="120px"
					backgroundColor="white"
					color="var(--myviolet)"
					border="1px solid var(--myviolet)"
					onClick={() => handleClose()}
				>
					Отмена
				</Button>
				<Button
					onClick={() => handlePost()}
					disabled={validation}
					width="150px"
					isLoading={loading}
				>
					Сохранить
				</Button>
			</div>
		</ModalComponent>
	)
}
