import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useGetStuffCurrent } from '../../../queries/bracnhes.queries'
import { useGetNotificationsCount } from '../../../queries/notification-service.queries'
import { ReactComponent as Location } from '../../../../assets/icons/layout/branches.svg'
import { ReactComponent as Notification } from '../../../../assets/icons/layout/notification.svg'
import { AnyAction } from '@reduxjs/toolkit'
import { getBranchesAdminMasterJwt } from '../../../../store/features/branch-slice'
import { useDispatch } from 'react-redux'
import { adminLinks } from '../../../links'

export const AdminHeader = () => {
	const { pathname } = useLocation()
	const { data: admin } = useGetStuffCurrent()
	const { data: notificationsCount = 0 } = useGetNotificationsCount(pathname)

	// for delete
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(getBranchesAdminMasterJwt() as unknown as AnyAction)
	}, [dispatch])

	return (
		<div
			style={{
				boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.02)',
				backdropFilter: 'blur(100px)',
			}}
			className="bg-white w-[98.7%] flex items-center justify-between h-[60px] rounded-br-[24px] pr-[10px] pl-[60px] sticky top-0 z-50"
		>
			<div className="flex items-center gap-[4px]">
				<Location />
				<p className="text-[14px] text-[#101010]">{admin?.address}</p>
			</div>
			<div className="flex items-center gap-[20px]">
				<Link
					to={adminLinks.notification}
					className="w-[37px] h-[37px] flex items-center justify-center bg-[#F2F2F1] rounded-full cursor-pointer relative"
				>
					<Notification />
					{notificationsCount > 0 && (
						<div className="absolute top-[-4px] right-[-4px] w-[18px] h-[18px] flex items-center justify-center bg-[#FF4BAF] rounded-full text-white text-[10px]">
							{notificationsCount}
						</div>
					)}
				</Link>
				<div className="flex items-center gap-2 rounded-full cursor-pointer">
					<img
						src={admin?.image}
						className="w-[37px] h-[37px] rounded-full object-cover"
					/>
					<p className="text-[14px] text-[#101010] min-w-[100px]">
						{admin?.companyName}
					</p>
				</div>
			</div>
		</div>
	)
}
