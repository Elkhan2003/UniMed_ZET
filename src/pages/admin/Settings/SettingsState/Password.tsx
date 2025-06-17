import { useEffect, useState } from 'react'
import { InoiInputPassword } from '../../../../components/shared/input-password'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { useChangePasswordMutation } from '../../../../store/services/user.service'
import toast from 'react-hot-toast'

export const Password = () => {
	const [oldPassword, setOldPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')

	const [changePassword] = useChangePasswordMutation()
	const [disabled, setDisabled] = useState(true)

	const clear = () => {
		setNewPassword('')
		setOldPassword('')
	}

	const handleChange = async () => {
		try {
			const res: any = await changePassword({
				oldPassword,
				newPassword,
			})
			if(res['data']){
                toast.success('Пароль успешно изменен')
            }
            if(res['error']){
                toast.error(res.error.data.message)
            }
			clear()
		} catch (error: any) {
		}
	}

	useEffect(() => {
        if(oldPassword && newPassword && oldPassword.length > 5 && newPassword.length > 5){
            setDisabled(false)
        }else{
            setDisabled(true)
        }
    }, [oldPassword, newPassword])

	return (
		<div className="w-full h-full flex items-center justify-center">
			<div className="flex flex-col gap-[20px] w-[300px]">
				<InoiInputPassword
					value={oldPassword}
					onChange={(e: any) => setOldPassword(e.target.value)}
					title="Текущий пароль"
					required
				/>
				<InoiInputPassword
					value={newPassword}
					onChange={(e: any) => setNewPassword(e.target.value)}
					title="Новый пароль"
					required
				/>
				<p
					onClick={clear}
					className="text-[#4E4E4E80] text-[14px] font-[500] text-end cursor-pointer"
				>
					Очистить
				</p>
				<Button disabled={disabled} onClick={handleChange}>
					Сохранить
				</Button>
			</div>
		</div>
	)
}
