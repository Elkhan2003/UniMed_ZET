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

interface LoginProps {
	step: number
	setStep: (number: number) => void
}

interface FormData {
	phoneNumber: string
	password: string
}

export default function Login({ step, setStep }: LoginProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const dispatch = useDispatch<AppDispatch>()
	const {
		register,
		handleSubmit,
		setValue,
		watch,
	} = useForm<FormData>()

	const onSubmit: SubmitHandler<FormData> = async (data: any) => {
		setIsLoading(true)
		try {
			const res = await dispatch(SignUp({ userData: data })).unwrap()
			console.log(res)
			if (res.role !== 'USER') {
				setCookie(
					_KEY_AUTH,
					JSON.stringify({
						token: res.token,
						role: res.role,
						isAuthenticated: true,
					}),
					7,
					`.${COOKIE}`
				)

				if (res.token) {
					window.location.reload()
				}
			}
		} catch (error) {
			console.error('SignUp failed:', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="w-full h-full flex justify-center items-center">
			<BackTO onClickLogo={() => false} onClickArrow={() => false} />
			<div>
				<Wrapper className="gap-1">
					<p className="text-text-primary text-center text-lg font-[500] noselect">
						Авторизация - UniBook (CRM)
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
						<InputPassword
							required
							label="Пароль"
							htmlFor="password"
							type="password"
							{...register('password', {
								required: 'Напишите пароль',
								minLength: {
									value: 6,
									message: `Минимум 6 символ`,
								},
							})}
						/>
						<p
							onClick={() => setStep(step + 1)}
							className="text-end text-[#4E4E4E80] text-[14px] cursor-pointer"
						>
							Забыли пароль?
						</p>
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
								'Войти'
							)}
						</button>
					</form>
					<p className="text-center">
						<span>Нет аккаунта?</span>
						<a
							href={`${getRoute()}register`}
							target="_blank"
							className="text-myviolet ml-2 cursor-pointer"
						>
							Регистрация
						</a>
					</p>
				</Wrapper>
			</div>
		</div>
	)
}
