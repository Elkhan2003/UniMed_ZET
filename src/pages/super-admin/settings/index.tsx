import { Tabs } from '../../../components/UI/Tabs/Tabs'
import { Outlet } from 'react-router-dom'
// import styles from '../company/Company.module.css'

export const SettingsPage = () => {
	const TabsValue = [
		{
			value: 'Адрес',
			to: 'addres',
		},
		{
			value: 'Удобства',
			to: 'facilities',
		},
		{
			value: 'Специальность',
			to: 'speciality',
		},
		{
			value: 'Сервис Категория',
			to: 'service',
		},
	]
	return (
		<div className="w-full min-h-[calc(100vh-45px)] p-4 bg-white">
			<div className=''>
				<h1 className="name_page">Настройки</h1>
			</div>
			<Tabs TabsValue={TabsValue} />
			<Outlet />
		</div>
	)
}

