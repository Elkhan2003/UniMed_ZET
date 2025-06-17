import { Flex } from 'antd'
import { ClientBox } from './ui/client-box'
import { ClientStatistic } from './ui/client-static'
import { RegularChart } from './ui/regular-chart'
import { VisitStatistic } from './ui/visit-stats'
import { useSearchParams } from 'react-router-dom'
import { dateTypes } from './ui/date-type-picket'
import Loading from '../../loading'

export const Clients = ({ data, isLoading }: { data: any, isLoading: boolean }) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const searchparam = searchParams.get('date-type') || 'WEEK'
	const clientData = data?.clientAnalytics

	const commonLabel = dateTypes[searchparam]

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
		<Flex gap={20} vertical className="w-full h-full overflow-y-auto px-4">
			<div className="w-full grid grid-cols-4 gap-[20px]">
				<ClientBox
					title="Кол-во клиентов"
					durationType={commonLabel}
					count={clientData?.clientStats?.totalClients}
				/>
				<ClientBox
					title="Завершенные"
					durationType={commonLabel}
					count={clientData?.clientStats?.completedAppointments}
					bgColor="#DCFFE3"
					countColor="#3FC24C"
				/>
				<ClientBox
					title="Предстоящие"
					durationType={commonLabel}
					count={clientData?.clientStats?.upcomingAppointments}
					bgColor="#DCF3FF"
					countColor="#0EA5E9"
				/>
				<ClientBox
					title="Отмененные"
					durationType={commonLabel}
					count={clientData?.clientStats?.canceledAppointments}
					bgColor="#FFDCDC"
					countColor="#FF5E5E"
				/>
			</div>
			<div className="w-full grid grid-cols-2 gap-[20px]">
				<ClientStatistic label={commonLabel} {...clientData?.clientStats} />
				<VisitStatistic label={commonLabel} {...clientData?.visits} />
			</div>
			<Flex justify="center">
				<RegularChart {...clientData?.regularClientsPercentage} label={commonLabel} />
			</Flex>
		</Flex>
	)
}
