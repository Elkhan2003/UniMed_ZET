import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useDeleteCompanyMutation } from '../../../../store/services/branch.service'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../../../shared/layout/const'

export const Deletion = () => {
	const [count, setCount] = useState(20)
	const [disabled, setDisabled] = useState(true)
	const [deleteCompany] = useDeleteCompanyMutation()
	const navigate = useNavigate()
	const dispatch = useDispatch()

	useEffect(() => {
		if (count > 0) {
			setTimeout(() => {
				setCount(count - 1)
			}, 1000)
		} else {
			setDisabled(false)
		}
	}, [count])

	const handleDelete = async () => {
		try {
			await deleteCompany()
			toast.success('Компания успешно удалена')
            logout(dispatch, navigate, (liam: boolean) => liam)
		} catch (error) {

        }
	}

	return (
		<div className="w-full h-full flex items-center justify-center">
			<div className="flex flex-col gap-[20px] w-[500px]">
				<div className="w-full flex space-x-2">
					<div className="w-2 min-w-2 h-2 rounded-full bg-black mt-2s" />
					<p className="text-[16px]">
						Все данные пропадут, для повторного использования приложения
						потребуется новая регистрация. Вы действительно хотите удалить
						аккаунт?
					</p>
				</div>
				<p className="text-[16px] text-center">Кнопка будет доступна через:</p>
				<p className="text-[34px] font-[500] text-black text-center">
					00:{count}
				</p>
				<div className="w-full flex justify-center">
					<div
						onClick={() => {
							if (!disabled) {
                                handleDelete()
							}
						}}
						className={clsx(
							'rounded-[16px] cursor-pointer px-[20px] py-[12px]',
							{
								'bg-[#b6b6b680]': disabled,
								'bg-[#FF5E5E]': !disabled,
								'text-white': !disabled,
								'text-[#4E4E4E80]': disabled,
							}
						)}
					>
						Удалить профиль
					</div>
				</div>
			</div>
		</div>
	)
}
