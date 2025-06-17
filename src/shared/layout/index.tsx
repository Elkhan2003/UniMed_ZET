import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { MainLogo } from '../../assets/icons/MainLogo'
import { ReactComponent as MenuIcon } from '../../assets/icons/layout/menu.svg'
import { ReactComponent as Logout } from '../../assets/icons/layout/logout.svg'
import { logout } from './const'
import { SLTooltip } from '../../components/shared/sl-tooltip'
import { SlPopconfirm } from '../../components/shared/sl-pop-confirm'

interface ILayout {
	items: any[]
	children: React.ReactNode
}

interface IItem {
	name: string
	link: string
	icon: React.ReactNode
}

const GeneralLayout = ({
	items,
	collapsed,
	setCollapsed,
	pathname,
}: {
	items: IItem[]
	collapsed: boolean
	setCollapsed: (collapsed: boolean) => void
	pathname: string
}) => {
	return (
		<div
			style={{
				boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.02)',
				backdropFilter: 'blur(100px)',
			}}
			className={`${collapsed ? 'w-[75px]' : 'w-[180px]'} py-[15px] px-[10px] h-full transition-all duration-200 bg-white z-10`}
		>
			<div className="w-full flex flex-col gap-[30px] relative">
				<div className="w-full flex items-center px-[18px] h-[40px] overflow-x-clip">
					<div className="w-[22px] h-[22px] !min-w-[22px] !min-h-[22px]">
						<MainLogo width="22" height="22" />
					</div>
					<p
						className={`${collapsed ? 'hidden' : ''} text-myviolet baloo-cheatan font-[800] text-[28px] leading-[38px]`}
					>
						niWork
					</p>
				</div>
				<div
					className={`${collapsed ? 'left-[80px]' : 'left-[180px]'} absolute top-[0px] transition-all duration-200`}
				>
					<div
						className="p-1 rounded-[10px] hover:bg-[#FFDEEE] cursor-pointer transition-all duration-200"
						onClick={() => setCollapsed(!collapsed)}
					>
						<MenuIcon />
					</div>
				</div>
				<div className="w-full flex flex-col gap-1">
					{items.map((item) => (
						<SLTooltip
							content={item.name}
							position="right"
							classNameContent={`${!collapsed ? 'hidden' : ''}`}
						>
							<Link
								key={item.name}
								to={item.link}
								className={`w-full flex items-center gap-[6px] rounded-[16px] group hover:bg-[#FFDEEE] transition-all duration-200 h-[42px] px-[20px] cursor-pointer overflow-x-clip ${
									pathname === item.link ? 'bg-[#FFDEEE]' : 'hover:bg-[#FFDEEE]'
								}`}
							>
								<div
									className={`text-[#101010] group-hover:text-[#FF4BAF] transition-all duration-200 !w-[20px] !min-w-[20px] ${
										pathname === item.link ? 'text-[#FF4BAF]' : 'text-[#101010]'
									}`}
								>
									{item.icon}
								</div>
								<p
									className={`${collapsed ? 'hidden opacity-0' : ' opacity-100'} text-[#101010] text-[14px] group-hover:text-[#FF4BAF] transition-all duration-200 ${
										pathname === item.link ? 'text-[#FF4BAF]' : 'text-[#101010]'
									}`}
								>
									{item.name}
								</p>
							</Link>
						</SLTooltip>
					))}
					<SlPopconfirm
						title="Вы точно хотите выйти?"
						onConfirm={() => logout()}
						onCancel={() => {}}
					>
						<div className="w-full flex items-center gap-[6px] rounded-[16px] group hover:bg-[#FFDEEE] transition-all duration-200 h-[42px] px-[20px] cursor-pointer overflow-x-clip">
							<div className="text-[#101010] group-hover:text-[#FF4BAF] transition-all duration-200 !w-[20px] !min-w-[20px]">
								<Logout />
							</div>
							<p
								className={`${collapsed ? 'hidden opacity-0' : ' opacity-100'} text-[#101010] text-[14px] group-hover:text-[#FF4BAF] transition-all duration-200`}
							>
								Выйти
							</p>
						</div>
					</SlPopconfirm>
				</div>
			</div>
		</div>
	)
}

export const Layout = ({ children, items }: ILayout) => {
	const [collapsed, setCollapsed] = useState(false)
	const { pathname } = useLocation()
	return (
		<div
			style={{
				boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.02)',
				backdropFilter: 'blur(100px)',
			}}
			className="w-full h-[100vh] flex transition-all duration-200"
		>
			<GeneralLayout
				items={items}
				collapsed={collapsed}
				setCollapsed={setCollapsed}
				pathname={pathname}
			/>
			<div className="w-full h-full overflow-y-auto bg-[#F5F5F5] z-0 transition-all duration-200">
				{children}
				<Outlet />
			</div>
		</div>
	)
}
