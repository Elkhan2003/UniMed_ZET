import { useEffect, useState } from 'react'
import { useLazyGetCompaniesSuperAdminQuery } from '../../../../../store/queries/company.service'
import toast from 'react-hot-toast'
import { Flex } from 'antd'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useParams } from 'react-router-dom'
import { CATEGORY_TYPE } from '../../../../../shared/lib/constants/constants'
import { formatDuration } from '../../../../../shared/lib/helpers/helpers'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
dayjs.locale('ru')

const PERSONAL_IDENT = ['personal_master', 'personal_doctor']

export const CompanyInnerInfo = () => {
	const [getCompany] = useLazyGetCompaniesSuperAdminQuery()

	const [company, setCompany] = useState<any>({})
	const { companyId } = useParams()

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
				setCompany(response?.data)
			}
		} catch (error: any) {
			toast.error(error?.data?.message || 'Произошла ошибка!')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (companyId) {
			getCompanyFunc()
		}
	}, [companyId])

	if (isLaoding) {
		return (
			<Flex align="center" justify="center" className="w-full h-full">
				<AiOutlineLoading3Quarters
					className="text-myadmin animate-spin transition-all duration-75"
					size={40}
				/>
			</Flex>
		)
	}

	const isPersonal = PERSONAL_IDENT.includes(company?.categoryType)

	return (
		<Flex gap={20}>
			<img
				className="w-[200px] h-[200px] rounded-full border-[1px] border-gray-300 border-solid object-cover shadow-md"
				src={company?.logo}
				alt="logo"
			/>
			<div className="w-full text-[#949393]">
				<p className="font-extrabold text-l text-black">
					{CATEGORY_TYPE[company.categoryType]}
				</p>
				<p className="text-sm mt-2">
					{isPersonal ? 'ФИО' : 'Название'}:{' '}
					<span className="text-md font-bold text-black">{company?.name}</span>
				</p>
				<p className="text-sm">
					Номер:{' '}
					<span className="text-md font-bold text-black">
						{isPersonal
							? company?.master?.phoneNumber
							: company?.companyPhoneNumber}
					</span>
				</p>
				<p className="text-sm">
					Адрес: <span className="text-black">{company?.address}</span>
				</p>
				{isPersonal && (
					<>
						<p className="text-sm">
							Специальность:{' '}
							{company?.master?.specialization.map((item: any) => (
								<span key={item.id} className="text-black">
									{item.name}
								</span>
							))}
						</p>
						{company?.master?.email && (
							<p className="text-sm">
								Адрес:{' '}
								<span className="text-black">{company?.master?.email}</span>
							</p>
						)}
					</>
				)}
				{!isPersonal && (
					<>
						<p className="font-extrabold text-l text-black mt-4">
							Администратор
						</p>
						<p className="text-sm mt-2">
							Имя:{' '}
							<span className="text-black font-bold">
								{company?.owner?.firstName}
							</span>
						</p>
						<p className="text-sm">
							Фамилия:{' '}
							<span className="text-black font-bold">
								{company?.owner?.lastName}
							</span>
						</p>
						<p className="text-sm">
							Номер телефона:{' '}
							<span className="text-black font-bold">
								{company?.owner?.phoneNumber}
							</span>
						</p>
						<p className="text-sm">
							Email:{' '}
							<span className="text-black font-bold">
								{company?.owner?.google}
							</span>
						</p>
					</>
				)}
				<p className="font-extrabold text-l text-black mt-4">Тариф</p>

				<p className="text-sm mt-2">
					Название тарифа:{' '}
					<span className="text-black font-bold">
						{company?.subscription?.tariff?.name}
					</span>
				</p>

				<p className="text-sm">
					Продолжительность:{' '}
					<span className="text-black font-bold">
						{formatDuration(company?.subscription?.tariff?.durationInDays)}
					</span>
				</p>

				<p className="text-sm">
					Кол-во сотрудников:{' '}
					<span className="text-black font-bold">
						{company?.subscription?.maxUsers}
					</span>
				</p>

				<p className="text-sm">
					Цена:{' '}
					<span className="text-black font-bold">
						{company?.subscription?.amount} c
					</span>
				</p>

				<p className="text-sm">
					Дата начала:{' '}
					<span className="text-black font-bold">
						{dayjs(company?.subscription?.startDate).format(
							'DD MMMM YYYY HH:mm'
						)}
					</span>
				</p>

				<p className="text-sm">
					Дата окончания:{' '}
					<span className="text-black font-bold">
						{dayjs(company?.subscription?.endDate).format('DD MMMM YYYY HH:mm')}
					</span>
				</p>

				<p className="text-sm">
					Дата создания тарифа{' '}
					<span className="text-black font-bold">
						{dayjs(company?.subscription?.createdAt).format(
							'DD MMMM YYYY HH:mm'
						)}
					</span>
				</p>
			</div>
		</Flex>
	)
}
