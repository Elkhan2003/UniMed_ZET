import { useEffect, useState } from 'react'
import { _KEY_AUTH } from '../../shared/lib/constants/constants'
import { LuLoader2 } from 'react-icons/lu'
import { Wrapper } from '../shared/laminant'
import { InoiInput } from '../UI/input'
import {
	usePasswordRecoveryMutation,
	useResetVerificationMutation,
} from '../../store/services/user.service'
import toast from 'react-hot-toast'
import { BackTO } from './BackTo'
import { useNavigate } from 'react-router-dom'

interface ConfirmProps {
	step: number
	setStep: (number: number) => void
    setRoles: (any: any) => void
	phoneNumber: string
}

interface FormData {
	phoneNumber: string
	password: string
}

export default function Confirm({ step, setStep, phoneNumber, setRoles }: ConfirmProps) {
	const [resetVerification, { isLoading }] = useResetVerificationMutation()
	const [passwordRecovery] = usePasswordRecoveryMutation()

	const [isDisabled, setIsDisabled] = useState(true)
	const [timer, setTimer] = useState(60)
	const [code, setCode] = useState('')

	const handleSubmit = async () => {
		try {
			const response: any = await resetVerification({
				phoneNumber: phoneNumber.replace('+', '%2B'),
				code: code,
			})
			if (response['error']) {
				toast.error(response.error?.data?.message || 'Произошла ошибка')
			}
			if (response['data']) {
				setStep(step + 1)
                setRoles(response.data)
			}
		} catch (error: any) {
			toast.error(error?.data?.message || 'Произошла ошибка')
		}
	}

	const resendCode = async () => {
		try {
			const user = await passwordRecovery(phoneNumber).unwrap()

			if (!user.status) {
				setTimer(60)
				setIsDisabled(true)
			}
		} catch (error: any) {
			toast.error(error?.data?.message || 'Произошла ошибка')
		}
	}

	useEffect(() => {
		if (step === 2) {
			if (timer > 0) {
				const interval = setInterval(() => {
					setTimer((prevTimer) => prevTimer - 1)
				}, 1000)

				return () => clearInterval(interval)
			} else {
				setIsDisabled(false)
			}
		} else {
			setTimer(60)
		}
	}, [timer, step])

	const navigate = useNavigate()

	return (
		<div className="w-full h-full flex justify-center items-center">
			<BackTO
				onClickLogo={() => navigate('/')}
				onClickArrow={() => setStep(step - 1)}
			/>
			<div>
				<Wrapper className="gap-1">
					<p className="text-text-primary text-center text-lg font-[500] noselect">
						Восстановление пароля
					</p>
					<p className="text-center text-[13px]">
						На ваш номер телефона был отправлен код. Пожалуйста, введите его
						ниже, чтобы подтвердить вашу личность.
					</p>
					<InoiInput
						title="Код"
						required
						placeholder="Введите код"
						value={code}
						onChange={(e: any) => {
							const value = e.target.value

							const filteredValue = value.replace(/[^0-9]/g, '').slice(0, 4)

							setCode(filteredValue)
						}}
					/>
					<p
						onClick={() => {
							if (!isDisabled) {
								resendCode()
							}
						}}
						className="text-end text-[13px] text-[#4E4E4E80] cursor-pointer"
					>
						{isDisabled ? (
							<span>
								Запросите новый через{' '}
								<span className="text-black font-[500]">{timer} секунд</span>
							</span>
						) : (
							<span className="text-myviolet">Запросить код</span>
						)}
					</p>
					<button
						onClick={handleSubmit}
						className="w-full text-[14px] text-white h-[37px] flex items-center justify-center focus:shadow-xl rounded-[9px] bg-myviolet mt-[7px]"
					>
						{isLoading ? (
							<LuLoader2
								size={26}
								className="text-white animate-spin font-[900]"
							/>
						) : (
							'Восстановить'
						)}
					</button>
				</Wrapper>
			</div>
		</div>
	)
}
