import { useState } from 'react'
import { HiOutlineMenu, HiMenuAlt3 } from 'react-icons/hi'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { _KEY_AUTH } from '../../lib/constants/constants'
import { Button } from 'antd'
import { logout } from '../const'
import { useDispatch } from 'react-redux'
import { LogoutOutlined } from '@ant-design/icons'
import { MainLogo } from '../../../assets/icons/MainLogo'
import { StyledMenu, TopMenu } from './styles'
import { ModalComponent } from '../../../components/UI/Modal/Modal'
import { Button as LowButton } from '../../../components/UI/Buttons/Button/Button'
import { SuperAdminItems } from './const'

export default function CustomOutlet() {
	const [openClose, setOpenClose] = useState(false)

	const [open, setOpen] = useState(false)
	const location = useLocation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	return (
		<div style={{ display: 'flex', minHeight: '100vh' }}>
			<ModalComponent
				handleClose={() => {
					setOpenClose(false)
				}}
				title=""
				active={openClose}
			>
				<div className="flex flex-col justify-center items-center gap-4 w-[200px] my-2 mx-3">
					<p className="text-md xs:text-sm mt-1 text-center">
						Вы действительно <br /> хотите выйти?
					</p>

					<div className=" flex justify-between items-center gap-2">
						<LowButton
							onClick={() => {
								setOpenClose(false)
							}}
							backgroundColor="transparent"
							border="1px var(--myviolet) solid "
							color="var(--myviolet)"
						>
							нет
						</LowButton>
						<LowButton onClick={() => logout(dispatch, navigate, setOpen)}>
							да
						</LowButton>
					</div>
				</div>
			</ModalComponent>
			<StyledMenu
				mode="inline"
				inlineCollapsed={!open}
				style={{
					width: open ? 250 : 80,
					paddingTop: '80px',
					minWidth: open ? 250 : 80,
				}}
				selectedKeys={[
					location.pathname.startsWith('/settings')
						? '/settings'
						: location.pathname,
				]}
				items={SuperAdminItems.map((item) => ({
					key: item.link.startsWith('/settings') ? '/settings' : item.link,
					icon: item.icon,
					label: (
						<Link to={item.link} style={{ color: 'inherit' }}>
							{item.name}
						</Link>
					),
				}))}
			/>

			<div
				style={{
					width: open ? 250 : 80,
					display: 'flex',
					position: 'absolute',
					left: '0px',
					top: '10px',
					height: '60px',
					justifyContent: open ? 'start' : 'center',
					alignItems: 'center',
					paddingLeft: open ? '28px' : '0px',
				}}
			>
				<MainLogo width="20" height="20" color="#5865F2" />
				{open && (
					<p className="text-myadmin baloo-cheatan font-[800] text-[28px] leading-[38px]">
						niBook admin
					</p>
				)}
			</div>
			<div style={{ flex: 1, backgroundColor: 'rgb(246, 246, 246)' }}>
				<TopMenu style={{ height: '45px' }}>
					<Button
						type="text"
						icon={open ? <HiMenuAlt3 size={23} /> : <HiOutlineMenu size={23} />}
						onClick={() => setOpen(!open)}
					/>

					<Button
						type="text"
						icon={<LogoutOutlined size={20} />}
						onClick={() => setOpenClose(true)}
					/>
				</TopMenu>
				<div className="w-full h-[calc(100vh-45px)] overflow-y-auto">
					<Outlet />
				</div>
			</div>
		</div>
	)
}
