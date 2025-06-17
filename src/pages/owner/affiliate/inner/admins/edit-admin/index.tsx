import { useEffect, useState } from 'react'
import styles from '../create-admin/style.module.css'
import { ModalComponent } from '../../../../../../components/UI/Modal/Modal'
import { Input } from '../../../../../../components/UI/Inputs/Input/Input'
import { Button } from '../../../../../../components/UI/Buttons/Button/Button'
import { InputNumberMask } from '../../../../../../components/UI/Inputs/InputMask/InputMask'
import { useDispatch } from 'react-redux'
import { adminsIdPut } from '../../../../../../store/features/admin-slice'
import { AnyAction } from '@reduxjs/toolkit'
import { useParams } from 'react-router-dom'
import { LonelySelect } from '../../../../../../components/UI/Selects/LonelySelect/LonelySelect'
import { COMPENSATION_TYPE } from '../../../../../../shared/lib/constants/constants'
import { getCompensationType } from '../../../../../../shared/lib/helpers/helpers'

export const EditAdmin = ({ open, setOpen, data }: any) => {
	const [validation, setValidation] = useState(true)
	const dispatch = useDispatch()
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
	useEffect(() => {
		if (data) {
			const arr = data?.fullName.split(' ')
			setAdminData({
				firstName: arr[0],
				lastName: arr[1],
				authInfoRequest: {
					phoneNumber: data?.phoneNumber,
					password: '',
				},
				salaryRateRequest: {
					amount: data.amount,
					compensationType: {
						label: getCompensationType(data.compensationType),
						value: data.compensationType,
					},
				},
			})
		}
	}, [open, setOpen, data])

	const postData = () => {
		dispatch(
			adminsIdPut({
				adminId: data.id,
				AdminsData: {
					...adminData,
					salaryRateRequest: {
						...adminData.salaryRateRequest,
						compensationType:
							adminData.salaryRateRequest.compensationType.value,
					},
				},
				branchId: id,
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
			adminData.firstName?.trim() &&
			adminData.lastName?.trim() &&
			adminData.authInfoRequest.phoneNumber?.trim() &&
			adminData.salaryRateRequest.compensationType &&
			adminData.salaryRateRequest.amount > 0
		setValidation(!Boolean(valid))
	}, [adminData])

	return (
		<ModalComponent
			active={open}
			handleClose={() => handleClose()}
			title="Изменить Администратора"
		>
			<div className={styles.wrapper}>
				<div className={styles.wrapper_flex_input}>
					<Input
						value={adminData.firstName}
						onChange={(e) =>
							setAdminData({ ...adminData, firstName: e.target.value })
						}
						type="text"
						label="Имя"
						required
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
					<Button type="cancel" onClick={() => handleClose()}>
						Отменить
					</Button>
					<Button disabled={validation} onClick={() => postData()}>
						Изменить
					</Button>
				</div>
			</div>
		</ModalComponent>
	)
}
