import {
	SettingOutlined,
	WalletOutlined,
	UsergroupAddOutlined 
} from '@ant-design/icons'

export const SuperAdminItems = [
	{
		name: 'Пользователи',
		link: '/company',
		icon: <UsergroupAddOutlined />,
	},
    {
		name: 'Тарифы',
		link: `/tariffs`,
		icon: <WalletOutlined />,
	},
	{
		name: 'Настройки',
		link: `/settings/addres`,
		icon: <SettingOutlined/>,
	},
]
