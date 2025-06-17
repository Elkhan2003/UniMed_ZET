import { useEffect, useState } from 'react'
import styles from './style.module.css'
import { ModalComponent } from '../../../../../../components/UI/Modal/Modal'
import { Input } from '../../../../../../components/UI/Inputs/Input/Input'
import { InputNumberMask } from '../../../../../../components/UI/Inputs/InputMask/InputMask'
import { Button } from '../../../../../../components/UI/Buttons/Button/Button'
import { useDispatch } from 'react-redux'
import { adminsRegistration } from '../../../../../../store/features/admin-slice'
import { AnyAction } from '@reduxjs/toolkit'
import { useParams } from 'react-router-dom'
import { LonelySelect } from '../../../../../../components/UI/Selects/LonelySelect/LonelySelect'
import { COMPENSATION_TYPE } from '../../../../../../shared/lib/constants/constants'

export const CreateAdmin = ({ open, setOpen }: any) => {
	const [validation, setValidation] = useState(true)
	const { id } = useParams()
	const [adminData, setAdminData] = useState({
		firstName: '',
		lastName: '',
		authInfoRequest: {
			phoneNumber: '+996',
			password: '',
		},
		salaryRateRequest: {
			amount: 0,
			compensationType: { label: 'Фиксированный', value: 'FIXED' },
		},
	})
	const handleClose = () => {
		setOpen(false)
		setAdminData({
			firstName: '',
			lastName: '',
			authInfoRequest: {
				phoneNumber: '+996',
				password: '',
			},
			salaryRateRequest: {
				amount: 0,
				compensationType: { label: 'Фиксированный', value: 'FIXED' },
			},
		})
	}
	const dispatch = useDispatch()
	const postData = () => {
		dispatch(
			adminsRegistration({
				branchId: id,
				AdminsData: {
					...adminData,
					salaryRateRequest: {
						...adminData.salaryRateRequest,
						compensationType:
							adminData.salaryRateRequest.compensationType.value,
					},
				},
			}) as unknown as AnyAction
		)
		setOpen(false)
		setAdminData({
			firstName: '',
			lastName: '',
			authInfoRequest: {
				phoneNumber: '+996',
				password: '',
			},
			salaryRateRequest: {
				amount: 0,
				compensationType: { label: 'Фиксированный', value: 'FIXED' },
			},
		})
	}

	useEffect(() => {
		const valid =
			adminData.firstName.trim() &&
			adminData.lastName.trim() &&
			adminData.authInfoRequest.phoneNumber.trim() &&
			adminData.authInfoRequest.password.trim() &&
			adminData.salaryRateRequest.compensationType &&
			adminData.salaryRateRequest.amount > 0;
		setValidation(!Boolean(valid));
	}, [adminData]); 

	return (
		<ModalComponent
			active={open}
			handleClose={() => handleClose()}
			title="Создать Администратора"
		>
			<div className={styles.wrapper}>
				<div className={styles.wrapper_flex_input}>
					<Input
						value={adminData.firstName}
						onChange={(e) =>
							setAdminData({ ...adminData, firstName: e.target.value })
						}
						required
						type="text"
						label="Имя"
					/>
					<Input
						value={adminData.lastName}
						onChange={(e) =>
							setAdminData({ ...adminData, lastName: e.target.value })
						}
						type="text"
						label="Фамилия"
						required
					/>
				</div>
				<div className={styles.wrapper_flex_input}>
					<InputNumberMask
						value={adminData.authInfoRequest.phoneNumber}
						onChange={(e) =>
							setAdminData({
								...adminData,
								authInfoRequest: {
									...adminData.authInfoRequest,
									phoneNumber: e,
								},
							})
						}
						label="Номер"
						required
					/>
					<Input
						value={adminData.authInfoRequest.password}
						onChange={(e) =>
							setAdminData({
								...adminData,
								authInfoRequest: {
									...adminData.authInfoRequest,
									password: e.target.value,
								},
							})
						}
						type="text"
						label="Пароль"
						required
					/>
				</div>
				<div className={styles.wrapper_flex_input}>
					<LonelySelect
						value={adminData.salaryRateRequest.compensationType}
						options={COMPENSATION_TYPE}
						onChange={(e) =>
							setAdminData((prevState: any) => ({
								...prevState,
								salaryRateRequest: {
									amount: adminData.salaryRateRequest.amount,
									compensationType: e,
								},
							}))
						}
						isClearable={false}
						isLoading={false}
						noOptionsMessage={() => 'Нет вариантов'}
						placeholder=""
						label="Тип ставки"
						required
					/>
					<Input
						type="number"
						label="Cумма"
						placeholder=""
						value={adminData.salaryRateRequest.amount}
						onChange={(e) =>
							setAdminData((prevState: any) => ({
								...prevState,
								salaryRateRequest: {
									amount: e.target.value,
									compensationType:
										adminData.salaryRateRequest.compensationType,
								},
							}))
						}
						required
					/>
				</div>
				<div className={styles.wrapper_flex_input}>
					<Button type='cancel' height='37px'  
					borderRadius='10px'
					onClick={() => handleClose()}>
						Отменить
					</Button>
					<Button disabled={validation} onClick={() => postData()}>Создать</Button>
				</div>
			</div>
		</ModalComponent>
	)
}
