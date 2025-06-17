import { Flex } from 'antd'
import { companyBreadCrumbItems } from '../const'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import {
	useBlockCompanyMutation,
	useDeleteCompanyByIdMutation,
	useLazyGetCompaniesSuperAdminQuery,
	useUnblockCompanyMutation,
} from '../../../../store/queries/company.service'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { StyledBreadCrumb } from '../../../../components/UI/styled-bread-crumb'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { STATUS } from '../const'
import { StyledTabs } from '../../../../components/UI/StyledTabs'
import { ModalComponent } from '../../../../components/UI/Modal/Modal'

export const CompanyInnerPage = () => {
	const [getCompany] = useLazyGetCompaniesSuperAdminQuery()
	const [blockCompany] = useBlockCompanyMutation()
	const [unblockCompany] = useUnblockCompanyMutation()
	const [deleteCompany, { isLoading: deleteLoading }] =
		useDeleteCompanyByIdMutation()

	const [openDelete, setOpenDelete] = useState(false)
	const [company, setCompany] = useState<any>({})
	const { companyId } = useParams()
	const pathname = useLocation()
	const navigate = useNavigate()

	const [isLaoding, setIsLoading] = useState(true)

	const getCompanyFunc = async () => {
		try {
			setIsLoading(true)
			const response = await getCompany(companyId)
			if (response['error']) {
				toast.error(
					`status: ${response?.error?.status}, ${response?.error?.data?.message || 'Произошла ошибка!'}`
				)
			}
			if (response['data']) {
				setCompany({ ...response?.data })
			}
		} catch (error: any) {
			toast.error(error?.data?.message || 'Произошла ошибка!')
		} finally {
			setIsLoading(false)
		}
	}

	const handleBlock = async () => {
		try {
			const response: any = await blockCompany(companyId)
			if (response['error']) {
				toast.error(
					`status: ${response?.error?.status}, ${response?.error?.data?.message || 'Произошла ошибка!'}`
				)
			} else {
				setCompany((prev: any) => ({ ...prev, isNonLocked: false }))
			}
		} catch (error: any) {
			toast.error(error?.data?.message || 'Произошла ошибка!')
		}
	}

	const handleUnblock = async () => {
		try {
			const response: any = await unblockCompany(companyId)
			if (response['error']) {
				toast.error(
					`status: ${response?.error?.status}, ${response?.error?.data?.message || 'Произошла ошибка!'}`
				)
			} else {
				setCompany((prev: any) => ({ ...prev, isNonLocked: true }))
			}
		} catch (error: any) {
			toast.error(error?.data?.message || 'Произошла ошибка!')
		}
	}

	const handleDelete = async () => {
		try {
			const response: any = await deleteCompany(companyId)
			if (response['error']) {
				toast.error(
					`status: ${response?.error?.status}, ${response?.error?.data?.message || 'Произошла ошибка!'}`
				)
			} else {
				navigate(
					`/company?type=${company.master === null ? 'COMPANY' : 'PERSONAL'}`
				)
			}
		} catch (error: any) {
			toast.error(error?.data?.message || 'Произошла ошибка!')
		}
	}

	useEffect(() => {
		if (companyId) {
			getCompanyFunc()
		}
		if (
			!pathname.pathname.includes('/info') &&
			!pathname.pathname.includes('/chat') &&
			!pathname.pathname.includes('/payment')
		) {
			navigate('info')
		}
	}, [companyId])

	const TabsValue = [
		{
			value: 'Информация',
			to: 'info',
		},
		{
			value: 'История оплаты',
			to: 'payment',
		},
		{
			value: 'Чат',
			to: 'chat',
		},
	]

	if (isLaoding) {
		return (
			<Flex
				align="center"
				justify="center"
				className="w-full h-full min-h-[calc(100vh-45px)] p-4"
			>
				<AiOutlineLoading3Quarters
					className="text-myadmin animate-spin transition-all duration-75"
					size={50}
				/>
			</Flex>
		)
	}

	return (
		<Flex
			vertical
			gap={10}
			className="w-full h-full min-h-[calc(100vh-45px)] p-4"
		>
			<ModalComponent
				handleClose={() => {
					setOpenDelete(false)
				}}
				title=""
				active={openDelete}
			>
				<div className="flex flex-col justify-center items-center gap-4 w-[200px] my-2 mx-3">
					<p className="text-md xs:text-sm mt-1 text-center">
						Вы действительно <br /> хотите удалить?
					</p>

					<div className=" flex justify-between items-center gap-2">
						<Button
							onClick={() => {
								setOpenDelete(false)
							}}
							backgroundColor="transparent"
							border="1px var(--myadmin) solid"
							color="var(--myadmin)"
						>
							нет
						</Button>
						<Button isLoading={deleteLoading} backgroundColor="var(--myadmin)" onClick={handleDelete}>
							да
						</Button>
					</div>
				</div>
			</ModalComponent>
			<Flex justify="space-between" align="start" className="w-full h-fit">
				<StyledBreadCrumb
					items={companyBreadCrumbItems(
						company?.name,
						`/company?type=${company?.master === null ? 'COMPANY' : 'PERSONAL'}` ||
							''
					)}
					colorbgcontainer="tranparent"
				/>
				<Flex gap={10} align="center">
					<Button
						borderRadius="16px"
						border="1px solid #E8EAED"
						width="140px"
						backgroundColor="#E8EAED"
						color="black"
						onClick={company.isNonLocked ? handleBlock : handleUnblock}
						isLoading={isLaoding}
					>
						{company.isNonLocked ? 'Заблокировать' : 'Разблокировать'}
					</Button>{' '}
					<Button
						loadingColor="white"
						borderRadius="16px"
						backgroundColor="#D80E0C"
						width="100px"
						onClick={() => setOpenDelete(true)}
					>
						Удалить
					</Button>
				</Flex>
			</Flex>
			<Flex align="center" gap={10}>
				<p className="text-xl font-bold">{company?.name}</p>
				<div
					style={{
						backgroundColor: `${STATUS[Number(!company.isNonLocked)].value}50`,
					}}
					className="flex justify-center items-center rounded-[20px] py-[3px] w-[110px]"
				>
					<p
						className="text-xs"
						style={{ color: STATUS[Number(!company.isNonLocked)].value }}
					>
						{STATUS[Number(!company.isNonLocked)].label}
					</p>
				</div>
			</Flex>
			<StyledTabs
				color="--myadmin"
				defaultActiveKey={pathname.pathname.split('/')[3]}
				onChange={(key) =>
					navigate(
						`${key}?type=${company?.master === null ? 'COMPANY' : 'PERSONAL'}`
					)
				}
			>
				{TabsValue.map((tab) => (
					<StyledTabs.TabPane tab={tab.value} key={tab.to} />
				))}
			</StyledTabs>
			<Outlet />
		</Flex>
	)
}
