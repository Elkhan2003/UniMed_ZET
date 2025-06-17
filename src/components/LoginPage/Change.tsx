import {  useState } from 'react'
import { InputPassword } from '../UI/Inputs/InputPassword/InputPassword'
import { setCookie } from '../../shared/lib/helpers/helpers'
import { _KEY_AUTH } from '../../shared/lib/constants/constants'
import { COOKIE } from '../../shared/lib/constants/constants'
import { LuLoader2 } from 'react-icons/lu'
import { Wrapper } from '../shared/laminant'
import {
	useResetPasswordAuthMutation,
} from '../../store/services/user.service'
import toast from 'react-hot-toast'
import { BackTO } from './BackTo'
import { useNavigate } from 'react-router-dom'

interface ChangeProps {
	step: number
	setStep: (number: number) => void
	phoneNumber: string
	roles: any
}

export default function Change({
	step,
	setStep,
	phoneNumber,
	roles,
}: ChangeProps) {
	const [resetPassword, { isLoading }] = useResetPasswordAuthMutation()

	const [password, setPassword] = useState('')

	const handleSubmit = async () => {
        if(password.length < 6){
            toast.error('Не меньше 6 символов')
            return;
        }
		try {
			const response: any = await resetPassword({
				password: password,
				token: roles.token,
			})
			if (response['error']) {
				toast.error(response.error?.data?.message || 'Произошла ошибка')
			}
			if (response['data']) {
				setCookie(
					_KEY_AUTH,
					JSON.stringify({
						token: roles.token,
						role: roles.role,
						isAuthenticated: true,
					}),
					7,
					`.${COOKIE}`
				)

				// window.location.reload()
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
					<p className="text-center text-[13px]">
						На ваш номер телефона был отправлен код. Пожалуйста, введите его
						ниже, чтобы подтвердить вашу личность.
					</p>
					<InputPassword
						required
						label="Пароль"
						htmlFor="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
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
							'Создать'
						)}
					</button>
				</Wrapper>
			</div>
		</div>
	)
}
