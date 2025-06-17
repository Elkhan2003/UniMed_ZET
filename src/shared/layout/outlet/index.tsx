import { useEffect, useState } from 'react'
import { HiOutlineMenu, HiMenuAlt3 } from 'react-icons/hi'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { _KEY_AUTH, ROLES } from '../../lib/constants/constants'
import { Button, Space, Skeleton } from 'antd'
import { getLayout, logout } from '../const'
import { useDispatch, useSelector } from 'react-redux'
import { LogoutOutlined } from '@ant-design/icons'
import { StyledLine } from '../../styles'
import { MainLogo } from '../../../assets/icons/MainLogo'
import { StyledMenu, TopMenu } from './styles'
import { getCookie, useWindowWidth } from '../../lib/helpers/helpers'
import { getBranchesAdminMasterJwt } from '../../../store/features/branch-slice'
import { AnyAction } from '@reduxjs/toolkit'
import { useGetIndividualQuery } from '../../../store/queries/individual.service'
import { useGetCompanyCurrentQuery } from '../../../store/queries/company.service'
import { RootState } from '../../../store'
import { ModalComponent } from '../../../components/UI/Modal/Modal'
import { Button as LowButton } from '../../../components/UI/Buttons/Button/Button'
import { useGetSubscriptionsCurrentQuery } from '../../../store/queries/tarrif.service'
import { PiTimer } from 'react-icons/pi'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

dayjs.extend(duration)

const TimeRemaining = ({ endDate }: { endDate: string }) => {
	const [timeLeft, setTimeLeft] = useState('')

	useEffect(() => {
		const updateTimer = () => {
			const end = dayjs(endDate)
			const now = dayjs()
			const diff = end.diff(now)

			if (diff <= 0) {
				setTimeLeft('Тариф истек')
				return
			}

			const dur = dayjs.duration(diff)

			const years = Math.floor(dur.asYears())
			const months = Math.floor(dur.asMonths() % 12)
			const days = dur.days()
			const hours = dur.hours()
			const minutes = dur.minutes()
			const seconds = dur.seconds()

			let result = ''

			function getPluralForm(
				number: number,
				one: string,
				few: string,
				many: string
			) {
				if (number % 10 === 1 && number % 100 !== 11) {
					return one
				} else if (
					number % 10 >= 2 &&
					number % 10 <= 4 &&
					(number % 100 < 10 || number % 100 >= 20)
				) {
					return few
				} else {
					return many
				}
			}

			if (years > 0) {
				const yearsText = getPluralForm(years, 'год', 'года', 'лет')
				const monthsText = getPluralForm(months, 'месяц', 'месяца', 'месяцев')
				result = `Осталось ${years} ${yearsText} ${months} ${monthsText}`
			} else if (months > 0) {
				const monthsText = getPluralForm(months, 'месяц', 'месяца', 'месяцев')
				const daysText = getPluralForm(days, 'день', 'дня', 'дней')
				result = `Осталось ${months} ${monthsText} ${days} ${daysText}`
			} else if (days > 0) {
				const daysText = getPluralForm(days, 'день', 'дня', 'дней')
				result = `Осталось ${days} ${daysText}`
			} else if (hours > 0) {
				const hoursText = getPluralForm(hours, 'час', 'часа', 'часов')
				result = `Осталось ${hours} ${hoursText}`
			} else if (minutes > 0) {
				const minutesText = getPluralForm(minutes, 'минута', 'минуты', 'минут')
				result = `Осталось ${minutes} ${minutesText}`
			} else {
				const secondsText = getPluralForm(
					seconds,
					'секунда',
					'секунды',
					'секунд'
				)
				result = `Осталось ${seconds} ${secondsText}`
			}

			setTimeLeft(result)
		}

		updateTimer()
		const timer = setInterval(updateTimer, 1000)

		return () => clearInterval(timer)
	}, [endDate])

	return (
		<div className="flex items-center gap-[5px]">
			<PiTimer size={19} color="#4E4E4E80" />
			<span className="text-xs text-[#4E4E4E80] mt-[2px]">{timeLeft}</span>
		</div>
	)
}

export default function CustomOutlet() {
	const { role } = useSelector((state: RootState) => state.auth)
	const { ownerData } = useSelector((state: RootState) => state.ownerCompany)
	const { individualData } = useSelector((state: RootState) => state.individual)
	const windowWidth = useWindowWidth()
	const [openClose, setOpenClose] = useState(false)
	const cookieDataString = getCookie(_KEY_AUTH)
	const convertObj = cookieDataString ? JSON.parse(cookieDataString) : {}
	const { data = undefined, isLoading: individualLoading } =
		useGetIndividualQuery(undefined, {
			skip: convertObj?.role !== ROLES.PERSONAl_MASTER,
		})

	const companyId = role === 'OWNER' ? ownerData?.id : individualData?.companyId
	const shouldSkipTariffQuery =
		role === 'OWNER'
			? ownerData?.id === undefined
			: individualData?.companyId === undefined

	const { data: Tarriff, isLoading: tariffLoading } =
		useGetSubscriptionsCurrentQuery(companyId, {
			skip:
				shouldSkipTariffQuery ||
				!(role === 'OWNER' || role === ROLES.PERSONAl_MASTER),
		})

	const { data: CompanyData = undefined, isLoading: companyLoading } =
		useGetCompanyCurrentQuery(undefined, {
			skip: convertObj?.role !== ROLES.OWNER,
		})

	const { branchAdminMasterJwt } = useSelector(
		(state: RootState) => state.branch
	)

	// Determine if we need to show loading instead of content
	const needsTariff = role === 'OWNER' || role === ROLES.PERSONAl_MASTER
	const isTariffLoading = needsTariff && tariffLoading
	const isDataLoading =
		(convertObj?.role === ROLES.PERSONAl_MASTER && individualLoading) ||
		(convertObj?.role === ROLES.OWNER && companyLoading)
	const isLoading = isDataLoading || isTariffLoading

	const shouldHaveTariff = needsTariff && !shouldSkipTariffQuery
	const tariffMissing = shouldHaveTariff && !tariffLoading && !Tarriff

	const showLoading = isLoading || tariffMissing

	const COMPANY_DATA = {
		image:
			convertObj?.role === ROLES.ADMIN
				? branchAdminMasterJwt?.image
				: convertObj?.role === ROLES.PERSONAl_MASTER
					? data?.avatar
					: CompanyData?.logo,
		address:
			convertObj?.role === ROLES.ADMIN
				? branchAdminMasterJwt?.address
				: convertObj?.role === ROLES.PERSONAl_MASTER
					? undefined
					: undefined,
		companyName:
			convertObj?.role === ROLES.ADMIN
				? branchAdminMasterJwt?.companyName
				: convertObj?.role === ROLES.PERSONAl_MASTER
					? data?.latinName
					: CompanyData?.name,
		phoneNumber:
			convertObj?.role === ROLES.ADMIN
				? branchAdminMasterJwt?.phoneNumber
				: convertObj?.role === ROLES.PERSONAl_MASTER
					? data?.phoneNumber
					: CompanyData?.phoneNumber,

		firstName:
			convertObj?.role === ROLES.ADMIN
				? branchAdminMasterJwt?.firstName
				: convertObj?.role === ROLES.PERSONAl_MASTER
					? data?.firstName
					: CompanyData?.firstName,
	}

	const [open, setOpen] = useState(false)
	const location = useLocation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	useEffect(() => {
		if (convertObj?.role === ROLES.ADMIN) {
			dispatch(getBranchesAdminMasterJwt() as unknown as AnyAction)
		}
	}, [dispatch, convertObj?.role])

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
					width: open ? 200 : windowWidth < 641 ? 40 : 80,
					paddingTop: '80px',
					minWidth: open ? 200 : windowWidth < 641 ? 40 : 80,
				}}
				selectedKeys={[location.pathname]}
				items={getLayout(convertObj?.role).map((item) => ({
					key: item.link,
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
					width: open ? 200 : windowWidth < 641 ? 40 : 80,
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
				<MainLogo width="20" height="20" />
				{open && (
					<p className="text-myviolet baloo-cheatan font-[800] text-[28px] leading-[38px]">
						niWork
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
					<div className="w-full flex items-center justify-end gap-8 pr-8">
						{isLoading ? (
							<Space>
								<Skeleton.Avatar active shape="circle" />
								<Skeleton.Button active />
							</Space>
						) : (
							<>
								{(role === ROLES.OWNER || role === ROLES.PERSONAl_MASTER) &&
									Tarriff?.endDate && (
										<TimeRemaining endDate={Tarriff?.endDate} />
									)}
								<StyledLine />
								<img
									src={COMPANY_DATA?.image}
									className="w-8 h-8 rounded-full object-cover"
									alt={COMPANY_DATA?.companyName}
								/>
								<StyledLine />
								<div className="flex flex-col">
									<p className="text-[12px] tracking-widest font-light">
										{COMPANY_DATA?.companyName}
									</p>
									{COMPANY_DATA?.firstName ? (
										<p className="text-[12px] tracking-widest font-light">
											{COMPANY_DATA?.firstName}
										</p>
									) : null}
								</div>
								<StyledLine />
								<p className="text-[12px] font-light tracking-widest">
									{COMPANY_DATA?.phoneNumber}
								</p>
								{COMPANY_DATA?.address && (
									<>
										<StyledLine />
										<p className="text-[12px] font-light tracking-widest">
											{COMPANY_DATA?.address}
										</p>
										<StyledLine />
									</>
								)}
							</>
						)}
					</div>
					<Button
						type="text"
						icon={<LogoutOutlined size={20} />}
						onClick={() => setOpenClose(true)}
					/>
				</TopMenu>
				<div className="w-full overflow-y-auto">
					{showLoading ? (
						<div className="flex justify-center items-center h-full">
							<AiOutlineLoading3Quarters
								className="text-myviolet animate-spin transition-all duration-50"
								size={50}
							/>
						</div>
					) : (
						<Outlet />
					)}
				</div>
			</div>
		</div>
	)
}
