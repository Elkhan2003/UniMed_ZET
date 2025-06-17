import { Col, Flex, Row, Timeline } from 'antd'
import { useSearchParams } from 'react-router-dom'
import Loading from '../../loading'

export const ServiceStatistic = ({ data, isLoading }: { data: any, isLoading: boolean }) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const searchparam = searchParams.get('date-type')

	const clientData = data?.serviceAnalytics
	const services = data?.serviceAnalytics?.topServices

	if (isLoading) {
		return (
			<Flex
				align="center"
				justify="center"
				className="w-full h-[calc(100vh-200px)] flex items-center justify-center"
			>
				<Loading />
			</Flex>
		)
	}

	return (
		<Flex className="w-full h-full overflow-y-scroll pb-10 px-4" vertical gap={20}>
			<Row gutter={[16, 16]}>
				<Col span={6}>
					<Flex vertical className="bg-[#F9F9F9] rounded-[24px] p-4">
						<p className="text-[#4E4E4E80] text-[14px]">
							Средняя продолжительность
						</p>
						<p className="text-[#101010] text-[24px] font-[600]">{clientData?.averageDurationMinutes} мин</p>
					</Flex>
				</Col>
				<Col span={6}>
					<Flex vertical className="bg-[#F9F9F9] rounded-[24px] p-4">
						<p className="text-[#4E4E4E80] text-[14px]">Средняя цена услуг</p>
						<p className="text-[#101010] text-[24px] font-[600]">0 с</p>
					</Flex>
				</Col>
				<Col span={12}>
					<Flex vertical className="bg-[#F9F9F9] rounded-[24px] p-4">
						<p className="text-[#101010] text-[16px] font-[600] mb-2">
							Популярные услуги
						</p>
						<Timeline
							items={services?.map((item: any) => {
								return {
									color: 'var(--myviolet)',
									children: (
										<Flex justify="space-between" align="center">
											<Flex align="center" gap={10}>
												<p className="text-[14px] text-[#101010]">
													{item.name}
												</p>
												<p className="text-[#4E4E4E80] text-[14px]">
													{item.appointmentCount}
												</p>
											</Flex>
											<p>{item.revenue}c</p>
										</Flex>
									),
								}
							})}
						/>
					</Flex>
				</Col>
			</Row>
		</Flex>
	)
}
