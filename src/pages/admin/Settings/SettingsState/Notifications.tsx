import { useState } from 'react'
import { useGetTemplateQuery } from '../../../../store/services/push-template.service'
import clsx from 'clsx'
import { Deletion } from './notification/Deletion'
import { Creation } from './notification/Creation'
import { Notificate } from './notification/Notificate'
import { ITemplate } from '../../../../common/template'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { ROLES } from '../../../../shared/lib/constants/constants'

export const Notifications = () => {
	const { role } = useSelector((state: RootState) => state.auth)
	const { branchAdminMasterJwt } = useSelector(
		(state: RootState) => state.branch
	)
	const { individualData } = useSelector((state: RootState) => state.individual)
	const branchId =
		role === ROLES.PERSONAl_MASTER
			? individualData?.branchId
			: branchAdminMasterJwt?.branchId
	const { data, refetch } = useGetTemplateQuery(branchId, {
		skip: !branchId,
	})

	const [activeTemplate, setActiveTemplate] = useState<number>(0)

	const components = [
		{
			name: 'Шаблон о создании записи',
			classNames: 'rounded-l-[20px]',
			component: (
				<Creation
					ByType={
						data?.filter(
							(item: ITemplate) => item.pushTemplateType === 'CREATION'
						)[0] || []
					}
					branchId={branchId}
					refetch={refetch}
				/>
			),
			type: 'CREATION',
		},
		{
			name: 'Шаблон напоминаний',
			classNames: '',
			component: (
				<Notificate
					ByType={
						data?.filter(
							(item: ITemplate) => item.pushTemplateType === 'NOTIFICATION'
						)[0] || []
					}
					branchId={branchId}
					refetch={refetch}
				/>
			),
			type: 'NOTIFICATION',
		},
		{
			name: 'Шаблон об отмене',
			classNames: 'rounded-r-[20px]',
			component: (
				<Deletion
					ByType={
						data?.filter(
							(item: ITemplate) => item.pushTemplateType === 'DELETION'
						)[0] || []
					}
					branchId={branchId}
					refetch={refetch}
				/>
			),
			type: 'DELETION',
		},
	]

	return (
		<div className="w-full h-[calc(100vh-45px)] overflow-y-auto">
			<div className="w-full flex p-4 items-center relative">
				{components.map((item, i) => (
					<div
						key={i}
						onClick={() => setActiveTemplate(i)}
						className={clsx(
							'w-full h-[40px] !min-h-[40px] flex items-center justify-center cursor-pointer',
							item.classNames,
							{
								'bg-myviolet text-white': i === activeTemplate,
								'bg-white': i !== activeTemplate,
							}
						)}
					>
						{item.name}
					</div>
				))}
			</div>
			{components[activeTemplate].component}
		</div>
	)
}
