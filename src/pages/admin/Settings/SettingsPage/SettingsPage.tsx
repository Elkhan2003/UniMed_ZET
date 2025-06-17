import { Tabs } from '../../../../components/UI/Tabs/Tabs'
import { Outlet } from 'react-router-dom'
import styles from './SettingsPage.module.css'

const TabsValue = [
	{
		value: 'Удобства',
		to: 'facilities',
	},
	{
		value: 'Наши работы',
		to: 'works',
	},
	{
		value: 'Баннер',
		to: 'sample',
	},
]

export const SettingsPage = () => {
	return (
		<div className={styles.container_settings}>
			<Tabs TabsValue={TabsValue} />
			<Outlet />
		</div>
	)
}
