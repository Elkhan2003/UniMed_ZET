import { Flex } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { WEEK } from '../../../../shared/lib/constants/constants'

interface PopularTimesWeek {
	labels: string[]
	percentages: number[]
}

interface PopularHoursProps {
	popularTimesWeek: PopularTimesWeek
}

export const PopularDays = ({ popularTimesWeek }: PopularHoursProps) => {
	const [animatedData, setAnimatedData] = useState<any[]>([])
	const [isLoaded, setIsLoaded] = useState(false)

	const data = popularTimesWeek?.labels?.map((item: string, index: number) => {
			return {
				hour: dayjs(item).format('HH'),
				percentage: popularTimesWeek.percentages[index],
			}
		})
		.filter((item) => item !== null)

	useEffect(() => {
		if (data?.length > 0 && animatedData?.length === 0) {
			setAnimatedData(data.map((item) => ({ ...item, animatedPercentage: 0 })))

			setTimeout(() => {
				setIsLoaded(true)
				setAnimatedData(data)
			}, 100)
		}
	}, [data])

	return (
		<Flex vertical gap={30} className="bg-[#F9F9F9] rounded-[24px] p-4">
			<p className="text-[#101010] text-[16px] font-[600] text-center">
				Популярные дни
			</p>
			<Flex justify="space-between" className="h-[250px]">
				{animatedData?.length > 0 &&
					animatedData?.map((item, index) => (
						<Flex
							vertical
							gap={5}
							className="h-full relative"
							key={`bar-${index}`}
						>
							<div className={`w-[40px] h-full relative`}>
								<div
									style={{
										height: isLoaded ? `${item?.percentage}%` : '0%',
										bottom: 0,
										transition:
											'height 1s cubic-bezier(0.17, 0.67, 0.34, 0.99)',
									}}
									className='w-full absolute rounded-full bg-myviolet'
								>
									{(item?.percentage || 0) > 0 && (
										<div
											style={{
												opacity: isLoaded ? 1 : 0,
												transition: 'opacity 1s ease-in-out',
											}}
											className="w-full mt-[-20px] text-center text-[#4E4E4E80] text-[12px]"
										>
											{item?.percentage}%
										</div>
									)}
								</div>
							</div>
							<p className="w-full text-[#101010] text-[13px] text-center">
								{WEEK[index]}
							</p>
						</Flex>
					))}
			</Flex>
		</Flex>
	)
}
