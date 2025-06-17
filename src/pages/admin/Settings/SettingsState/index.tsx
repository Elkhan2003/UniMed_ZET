import { useState } from 'react'
import { Password } from './Password'
import { Deletion } from './Deletion'
import { Notifications } from './Notifications'
import { IoIosArrowForward } from 'react-icons/io'
import { logout } from '../../../../shared/layout/const'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LogoutOutlined } from '@ant-design/icons'
import { DeleteModal } from '../../../../components/UI/Modal/DeleteModal/DeleteModal'
import { RootState } from '../../../../store'

export const SettingsPage = () => {
	const [open, setOpen] = useState(false)
	const [activePage, setActivePage] = useState<number>(0)
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const components = [
		{
			name: 'Шаблоны уведомлений',
			component: <Notifications />,
		},
		{
			name: 'Изменить пароль',
			component: <Password />,
		},
		{
			name: 'Удалить аккаунт',
			component: <Deletion />,
		},
	]

	return (
		<>
			<DeleteModal
				active={open}
				handleClose={() => setOpen(false)}
				title="Выход"
				handleTrueClick={() =>
					logout(dispatch, navigate, (liam: boolean) => liam)
				}
				okText="Подтвердить"
			/>
			<div className="w-full h-[calc(100vh-45px)] flex">
				<div
					style={{ borderRight: '1px solid gainsboro' }}
					className={`w-[250px] max-w-[250px] min-w-[250px] h-full flex flex-col bg-white px-2`}
				>
					<div className="w-full h-[80px] flex items-center gap-2">
						<p className="text-lg font-[500] ml-[20px]">Настройки</p>
					</div>
					<div className="flex flex-col gap-2">
						{components.map((item, i) => (
							<div
								onClick={() => setActivePage(i)}
								className={`w-full flex items-center justify-between ${
									i === activePage ? 'bg-gray-100' : 'hover:bg-gray-50'
								} rounded-lg cursor-pointer p-2`}
							>
								<p className="text-sm">{item.name}</p>
								<IoIosArrowForward size={20} className="text-[#4E4E4E80]" />
							</div>
						))}
						<div
							onClick={() => setOpen(true)}
							className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg cursor-pointer p-2"
						>
							<div className="flex items-center space-x-2">
								<LogoutOutlined className="mb-[3px]" />
								<p className="text-sm">Выход</p>
							</div>
							<IoIosArrowForward size={20} className="text-[#4E4E4E80]" />
						</div>
					</div>
				</div>
				{components[activePage].component}
			</div>
		</>
	)
}
