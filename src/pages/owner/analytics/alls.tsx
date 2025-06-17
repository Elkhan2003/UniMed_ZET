import { Flex } from 'antd'
import { BoxStatistic } from './ui/box-statistics'
import { PopularHours } from './ui/popular-hours'
import { PopularDays } from './ui/popular-days'
import { AppointmentStatistic } from './ui/appointment-statistic'
import { ClientBox } from './ui/client-box'
import { useSearchParams } from 'react-router-dom'
import { dateTypes } from './ui/date-type-picket'
import Loading from '../../loading'

export const GeneralAnalytics = ({
	data,
	isLoading,
}: {
	data: any
	isLoading: boolean
}) => {
	const [searchParams] = useSearchParams()
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
		<Flex
			className="w-full h-full overflow-y-scroll pb-10 px-4"
			vertical
			gap={20}
		>
			<div className="w-full grid grid-cols-3 gap-[20px]">
				<ClientBox
					title="Кол-во клиентов"
					durationType=""
					count={clientData?.clientStats?.totalClients}
				/>
				<BoxStatistic
					{...data?.generalAnalytics?.revenue}
					showExceeds
					title="Выручка"
					durationTypes={commonLabel}
				/>
				<BoxStatistic
					{...data?.generalAnalytics?.averageCheck}
					showExceeds
					title="Средний чек"
					durationTypes={commonLabel}
				/>
			</div>
			<div className="w-full grid grid-cols-2 gap-[20px]">
				<AppointmentStatistic
					label={commonLabel}
					{...data?.generalAnalytics?.appointmentStats}
				/>
				<PopularHours
					popularTimesDay={data?.generalAnalytics?.popularTimesDay}
				/>
			</div>
			<div className="w-full grid grid-cols-3 gap-[20px]">
				<PopularDays
					popularTimesWeek={data?.generalAnalytics?.popularTimesWeek}
				/>
			</div>
		</Flex>
	)
}
