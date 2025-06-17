import React, { useEffect, useState } from 'react'
import { ModalComponent } from '../../../../components/UI/Modal/Modal'
import { InputNumberMask } from '../../../../components/UI/Inputs/InputMask/InputMask'
import { Input } from '../../../../components/UI/Inputs/Input/Input'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { useDispatch } from 'react-redux'
import { postUsersRegistrationByAdmin } from '../../../../store/features/user-slice'
import { AnyAction } from '@reduxjs/toolkit'
import { useCheckPhoneNumberQuery } from '../../../../store/services/user.service'
import { InputPassword } from '../../../../components/UI/Inputs/InputPassword/InputPassword'

export default function NewUser({ isOpenModal, handleClose }: any) {
	const [validation, setValidation] = useState(true)
	const [loading, setLoading] = useState(false)
	const [dataNewUser, setDataNewUser] = useState({
		firstName: '',
		lastName: '',
		authInfoRequest: {
			email: '',
			phoneNumber: '+996',
			password: '',
		},
	})
	const { data: phone_number = false } = useCheckPhoneNumberQuery(
		dataNewUser?.authInfoRequest.phoneNumber.slice(1),
		{ skip: !dataNewUser?.authInfoRequest.phoneNumber }
	)

	const dispatch = useDispatch()

	useEffect(() => {
		setValidation(
			dataNewUser.authInfoRequest.phoneNumber === ''
				? true
				: dataNewUser.firstName === ''
					? true
					: phone_number === true
						? true
						: false
		)
	}, [dataNewUser])

	const clear = () => {
		setDataNewUser({
			firstName: '',
			lastName: '',
			authInfoRequest: {
				email: '',
				phoneNumber: '+996',
				password: '',
			},
		})
	}

	async function handlePost() {
		try {
			setLoading(true)
			await dispatch(
				postUsersRegistrationByAdmin({
					firstName: dataNewUser.firstName,
					lastName: dataNewUser.lastName,
					authInfoRequest: {
						email: dataNewUser.authInfoRequest.email,
						phoneNumber: dataNewUser.authInfoRequest.phoneNumber,
						password: dataNewUser.authInfoRequest.password,
					},
				}) as unknown as AnyAction
			)
			handleClose()
			clear()
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	return (
		<ModalComponent
			title="Добавить клиента"
			active={isOpenModal}
			handleClose={() => {
				handleClose()
				clear()
			}}
		>
			<div className="w-[320px] flex flex-col gap-2">
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
							authInfoRequest: {
								...dataNewUser.authInfoRequest,
								phoneNumber: value,
							},
						})
					}
					value={dataNewUser.authInfoRequest.phoneNumber}
					error={phone_number === true ? 'Этот номер уже используеться!' : ''}
					required
				/>
				{/* <InputPassword
					label="Пароль"
					htmlFor="password"
					type="password"
					value={dataNewUser.authInfoRequest.password}
					onChange={(e) =>
						setDataNewUser({
							...dataNewUser,
							authInfoRequest: {
								...dataNewUser.authInfoRequest,
								password: e.target.value,
							},
						})
					}
				/>
				<Input
					label="Почта"
					placeholder="Введите вашу почту"
					value={dataNewUser.authInfoRequest.email}
					onChange={(e) =>
						setDataNewUser({
							...dataNewUser,
							authInfoRequest: {
								...dataNewUser.authInfoRequest,
								email: e.target.value,
							},
						})
					}
					required
				/> */}
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
