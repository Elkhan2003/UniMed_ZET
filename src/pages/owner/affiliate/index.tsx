import { EditAffilate } from '../edit/affiliate'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import {
	deleteBranch,
	getBranchesOwner,
} from '../../../store/features/branch-slice'
import { AnyAction } from '@reduxjs/toolkit'
import { RootState } from '../../../store'
import Styles from './style.module.css'
import { LayoutContent } from '../../../components/UI/LayoutContent'
import { Flex } from 'antd'
import { StyledTitle } from '../../../shared/styles'
import { Button } from '../../../components/UI/Buttons/Button/Button'
import { getColumns } from './consts'
import { StyledTable } from '../../../components/UI/StyledTable'
import { useGetUnitsQuery } from '../../../store/services/branch.service'

export const AffiliatePage = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { data: Units = [] } = useGetUnitsQuery()
	const [editId, setEditId] = useState(0)
	const [loading, setLoading] = useState(true)
	const { branchData } = useSelector((state: RootState) => state.branch)

	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		dispatch(getBranchesOwner() as unknown as AnyAction)
	}, [])

	const handleDelete = (itemId: any) => {
		dispatch(
			deleteBranch({
				branchId: itemId,
			}) as unknown as AnyAction
		)
	}

	const handleEdit = (item: any) => {
		setEditId(item.id)
		setIsOpen(true)
	}

	const innerAffiliateHandler = (id: number) => {
		navigate(`${id}/admins`)
	}

	useEffect(() => {
		if (branchData?.length > 0) {
			setLoading(false)
		} else {
			setTimeout(() => {
				setLoading(false)
			}, 5000)
		}
	}, [branchData])

	return (
		<div className={Styles.afl}>
			<EditAffilate
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				Units={Units}
				branchId={editId}
			/>
			<LayoutContent>
				<div className="flex flex-col gap-[20px]">
					<Flex justify="space-between">
						<StyledTitle>Филиалы</StyledTitle>
						<Button width="120px" onClick={() => navigate('/affiliate/create')}>
							Создать
						</Button>
					</Flex>

					<StyledTable
						onRow={(record: any) => ({
							onClick: () => {
								innerAffiliateHandler(record.id)
							},
						})}
						columns={getColumns(handleDelete, handleEdit)}
						dataSource={branchData}
						loading={loading}
					/>
				</div>
			</LayoutContent>
		</div>
	)
}
