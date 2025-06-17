import { useEffect, useState } from 'react'
import {
	useGetEmployeeAccessQuery,
	usePutEmployeeAccessMutation,
} from '../../../../store/services/master.service'
import { RootState } from '../../../../store'
import { Switch } from '../../../../components/shared/switch'
import Loading from '../../../loading'
import { useSelector } from 'react-redux'

interface EmployeeAccess {
	id: number
	canMastersAcceptPayments: boolean
	canMastersGiveDiscounts: boolean
	canMastersCancelAppointments: boolean
}

const translateAccess: Record<keyof Omit<EmployeeAccess, 'id'>, string> = {
	canMastersAcceptPayments: 'Возможность принимать оплату',
	canMastersGiveDiscounts: 'Возможность делать скидку',
	canMastersCancelAppointments: 'Возможность отменять запись',
}

export const EmployeeAccessPage = () => {
	const { ownerData } = useSelector((state: RootState) => state.ownerCompany)
	const [employeeAccess, setEmployeeAccess] = useState<EmployeeAccess | null>(
		null
	)
	const [error, setError] = useState<string | null>(null)
	const [updatingKey, setUpdatingKey] = useState<keyof EmployeeAccess | null>(
		null
	)

	const {
		data,
		isLoading: isFetching,
		error: fetchError,
	} = useGetEmployeeAccessQuery(ownerData?.id, {
		skip: !ownerData?.id,
	})

	const [putEmployeeAccess] = usePutEmployeeAccessMutation()

	useEffect(() => {
		if (data) {
			setEmployeeAccess(data)
		}
	}, [data])

	const handlePutEmployeeAccess = async (
		key: keyof Omit<EmployeeAccess, 'id'>,
		value: boolean
	) => {
		setError(null)
		setUpdatingKey(key)

		if (!employeeAccess) return

		const updatedAccess = {
			canMastersAcceptPayments: employeeAccess.canMastersAcceptPayments,
			canMastersGiveDiscounts: employeeAccess.canMastersGiveDiscounts,
			canMastersCancelAppointments: employeeAccess.canMastersCancelAppointments,
			[key]: value,
		}

		try {
			await putEmployeeAccess({
				companyId: ownerData?.id,
				body: updatedAccess,
			}).unwrap()

			setEmployeeAccess((prev) => (prev ? { ...prev, [key]: value } : prev))
		} catch (err) {
			setError('Ошибка при обновлении доступа. Попробуйте ещё раз.')
			console.error(err)
		} finally {
			setUpdatingKey(null)
		}
	}

	if (isFetching) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<Loading />
			</div>
		)
	}

	if (fetchError) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<p className="text-red-500 text-center mt-4">
					Ошибка при загрузке данных. Попробуйте обновить страницу.
				</p>
			</div>
		)
	}

	return (
		<div className="w-full h-fit">
			<div
				style={{ borderBottom: '1px solid #F2F2F1' }}
				className="w-full pb-[10px]"
			>
				<p className="text-[#101010] text-[16px] font-[600] p-[20px]">
					Доступы сотрудников
				</p>
			</div>
			{error && (
				<div className="text-red-500 text-sm text-center mb-4">{error}</div>
			)}

			<div className='w-full p-[20px]'>
				{employeeAccess &&
					(
						Object.keys(translateAccess) as Array<keyof typeof translateAccess>
					).map((key) => (
						<div
							key={key}
							className="w-full h-[50px] flex items-center justify-between"
						>
							<p className="text-[16px] text-[#101010]">
								{translateAccess[key]}
							</p>
							<Switch
								active={employeeAccess[key]}
								setActive={(flag) => handlePutEmployeeAccess(key, flag)}
								onClick={() => {}}
							/>
						</div>
					))}
			</div>
		</div>
	)
}
