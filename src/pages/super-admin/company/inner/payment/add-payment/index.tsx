import { title } from 'process'
import { ModalComponent } from '../../../../../../components/UI/Modal/Modal'
import { Flex } from 'antd'
import { InoiSelect } from '../../../../../../components/UI/select'
import { useEffect, useState } from 'react'
import { Button } from '../../../../../../components/UI/Buttons/Button/Button'
import toast from 'react-hot-toast'
import { useParams, useSearchParams } from 'react-router-dom'
import { usePostPaymentMutation } from '../../../../../../store/queries/tarrif.service'

interface AddPaymentProps {
	active: boolean
	handleClose: () => void
	title?: string
	tarriffs: any[]
	onSuccess: () => void
}

export const AddPayment = ({
	title = 'hello kitty',
	active,
	handleClose,
	tarriffs,
	onSuccess,
}: AddPaymentProps) => {
	const [postPayment, { isLoading }] = usePostPaymentMutation()

	const { companyId } = useParams()
	const [searchParams, setSearchParams] = useSearchParams()

	const [tarif, setTarif] = useState<any>(null)
	const [count, setCount] = useState(0)
	const [postData, setPostData] = useState({
		companyId: 0,
		tariffId: 0,
		paymentSystem: 'MANUALLY',
		amount: 0,
	})

	const type = searchParams.get('type')

	const handlePay = async () => {
		try {
			const response: any = await postPayment({
				...postData,
				companyId: Number(companyId),
				tariffId: tarif.value,
			})
			if (response['error']) {
				toast.error(
					`status: ${response?.error?.status}, ${response?.error?.data?.message || 'Произошла ошибка!'}`
				)
			} else {
				await onSuccess()
				handleClose()
				setTarif(null)
				toast.success('Успешно оплачено')
			}
		} catch (error: any) {
			toast.error(error?.data?.message || 'Произошла ошибка!')
		}
	}

	const filteredTarif =
		tarriffs?.filter((item: any) => item.tariffType === type) || []

	useEffect(() => {
		setPostData({ ...postData, amount: (tarif?.pricePerUser || 0) * count })
	}, [count, tarif])

	return (
		<ModalComponent
			title={title}
			active={active}
			handleClose={() => {
				handleClose()
				setTarif(null)
			}}
		>
			<Flex vertical gap={10} className="min-w-[300px]">
				<InoiSelect
					color="focus:border-myadmin"
					title="Тариф"
					placeholder="Выберите тариф"
					options={filteredTarif.map((item: any) => {
						return {
							name: item.name,
							value: item.id,
							pricePerUser: item.pricePerUser,
						}
					})}
					value={tarif}
					setValue={(e: any) => {
						setCount(0)
						setTarif(e)
					}}
				/>
				{tarif && type === 'COMPANY' && (
					<Flex justify="space-between" className="py-2">
						<Flex align="center" gap={5}>
							<div
								onClick={() => setCount((prev: number) => (prev || 1) - 1)}
								className="bg-[#F2F2F1] rounded-full px-[9px] cursor-pointer"
							>
								-
							</div>
							<p>{count}</p>
							<div
								onClick={() => setCount((prev: number) => prev + 1)}
								className="bg-[#F2F2F1] rounded-full px-[7px] cursor-pointer"
							>
								+
							</div>
						</Flex>
						<p className="text-[20px] font-[600]">
							{(tarif?.pricePerUser || 0) * count} c
						</p>
					</Flex>
				)}
				<Flex gap={10}>
					<Button
						borderRadius="16px"
						backgroundColor="var(--myadmin)"
						onClick={handleClose}
					>
						Отменить
					</Button>
					<Button
						loadingColor="white"
						borderRadius="16px"
						backgroundColor={!tarif ? '' : 'var(--myadmin)'}
						onClick={handlePay}
						isLoading={isLoading}
						disabled={!tarif}
					>
						Оплата{' '}
						{(tarif &&
							filteredTarif?.find((item: any) => item.id === tarif.value)
								.price +
								(tarif?.pricePerUser || 0) * count) ||
							0}{' '}
						c
					</Button>
				</Flex>
			</Flex>
		</ModalComponent>
	)
}
