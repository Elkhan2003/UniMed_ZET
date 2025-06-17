import { useParams } from 'react-router-dom'
import { useGetMasterByIdQuery } from '../../../../../../../store/services/master.service'

const getYearLabel = (years: number): string => {
	if (years % 10 === 1 && years % 100 !== 11) {
		return 'год'
	} else if (
		[2, 3, 4].includes(years % 10) &&
		![12, 13, 14].includes(years % 100)
	) {
		return 'года'
	} else {
		return 'лет'
	}
}

export const AboutMaster: React.FC = () => {
	const { masterID } = useParams<{ masterID: string }>()
	const { data } = useGetMasterByIdQuery(
		{ masterId: masterID },
		{ skip: !masterID }
	)

	return (
		<div>
			<p className="text-lg text-gray-700 font-medium">О Специалисте</p>
			<p className="text-sm text-gray-600">
				Стаж: {data?.experience} {getYearLabel(data?.experience ?? 0)}
			</p>
			<p className="text-sm text-gray-600">
				{!data?.description ? 'Нет информация о специалисте' : data?.description}
			</p>
		</div>
	)
}
