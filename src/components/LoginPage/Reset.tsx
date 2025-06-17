import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { InputNumberMask } from '../UI/Inputs/InputMask/InputMask'
import { AppDispatch } from '../../store'
import { SignUp } from '../../store/features/auth-slice'
import { InputPassword } from '../UI/Inputs/InputPassword/InputPassword'
import { getRoute, setCookie } from '../../shared/lib/helpers/helpers'
import { _KEY_AUTH } from '../../shared/lib/constants/constants'
import { COOKIE } from '../../shared/lib/constants/constants'
import { LuLoader2 } from 'react-icons/lu'
import { Wrapper } from '../shared/laminant'
import { BackTO } from './BackTo'
import toast from 'react-hot-toast'
import { usePasswordRecoveryMutation } from '../../store/services/user.service'
import { useNavigate } from 'react-router-dom'

interface ResetProps {
	step: number
	setStep: (number: number) => void
	setPhoneNumber: (string: string) => void
}

interface FormData {
	phoneNumber: string
	password: string
}

interface FormValues {
	phoneNumber: string
}

export default function Reset({ step, setStep, setPhoneNumber }: ResetProps) {
	const [passwordRecovery, { isLoading }] = usePasswordRecoveryMutation()
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<FormValues>()

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		const phoneNumber = data.phoneNumber.replace('+', '%2B')
		try {
			const user = await passwordRecovery(phoneNumber).unwrap()

			if (!user.status) {
				setPhoneNumber(data.phoneNumber)
				setStep(step + 1)
			}
		} catch (error: any) {
			toast.error(error?.data?.message || 'Произошла ошибка')
		}
	}

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
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-[13px]"
					>
						<InputNumberMask
							required
							label="Номер телефона"
							onChange={(value) => setValue('phoneNumber', value)}
							value={watch('phoneNumber')}
						/>
						<button
							className="w-full text-[14px] text-white h-[37px] flex items-center justify-center focus:shadow-xl rounded-[9px] bg-myviolet mt-[7px]"
							type="submit"
						>
							{isLoading ? (
								<LuLoader2
									size={26}
									className="text-white animate-spin font-[900]"
								/>
							) : (
								'Отправить'
							)}
						</button>
					</form>
				</Wrapper>
			</div>
		</div>
	)
}
