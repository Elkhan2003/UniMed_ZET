import { useState, useEffect } from 'react'
import {
	useDeleteUserMutation,
	useGetUsersAdminQuery,
} from '../../../store/services/user.service'
import { StyledTitle } from '../../../shared/styles'
import { Flex } from 'antd'
import { Input } from '../../../components/UI/Inputs/Input/Input'
import { StyledTable } from '../../../components/UI/StyledTable'
import { getColumnsClient } from './consts'
import { Button } from '../../../components/UI/Buttons/Button/Button'
import NewUser from './Add'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { InnerClient } from './innerClient'
import toast from 'react-hot-toast'
import EditNewUser from './Edit'
import { GENDER_CONVERT } from '../../../shared/lib/constants/constants'

export default function PersonalClients() {
	const { individualData } = useSelector((state: RootState) => state.individual)
	const [deleteUser] = useDeleteUserMutation()
	const [innerData, setInnerData] = useState(null)

	const [search, setSearch] = useState<string>('')
	const [active, setActive] = useState<boolean>(false)
	const [open, setOpen] = useState<any>(false)
	const [isOpenModal, setIsOpenModal] = useState(false)
	const [userId, setUserId] = useState<number>(0)
	const [registered, setRegistered] = useState(false)

	const [dataNewUser, setDataNewUser] = useState<any>({
		firstName: '',
		lastName: '',
		gender: { name: 'Мужчина', value: 'MALE' },
		birthDate: '2025-01-17',
		discount: 0,
		comment: '',
		authInfoUpdateRequest: {
			phoneNumber: '+996',
			oldPassword: '',
			newPassword: '',
		},
	})

	const [paginationValue, setPaginationValue] = useState<any>({
		page: 1,
		pageSize: 6,
		totalPages: 1,
		totalElements: 0,
	})

	const {
		data: userAdmin,
		isLoading: isLoadingUsers,
		refetch,
	} = useGetUsersAdminQuery(
		{
			page: paginationValue.page,
			size: paginationValue.pageSize,
			search: search,
		},
		{ skip: individualData === undefined }
	)

	useEffect(() => {
		if (userAdmin) {
			const totalPages = userAdmin.totalPages
			const totalElements = userAdmin.totalElements
			const currentPage = paginationValue.page
			const newPage = currentPage > totalPages ? 1 : currentPage

			setPaginationValue({
				...paginationValue,
				totalPages: totalPages,
				totalElements: totalElements,
				page: newPage,
			})
		}
	}, [userAdmin])

	const paginationChange = (page: any, pageSize: any) => {
		setOpen(false)
		setPaginationValue({
			...paginationValue,
			page,
			pageSize,
		})
	}

	const handleClose = async () => {
		if (userAdmin) refetch()
		setActive(false)
	}

	const handleDelete = async (id: number) => {
		try {
			await deleteUser(id).unwrap()
			setOpen(false)
			refetch()
			toast.success('Клиент успешно удален')
		} catch (error) {
			toast.error('Произошла ошибка')
		}
	}

	const handleEdit = (record: any) => {
		setRegistered(record.isUnregistered)
		setUserId(record.id)
		setIsOpenModal(true)
		setDataNewUser({
			firstName: record.firstName || '',
			lastName: record.lastName || '',
			gender: {
				name: GENDER_CONVERT[record.gender],
				value: record.gender,
			},
			birthDate: record.birthDate || '2000-01-01',
			discount: record?.clientStatistics?.discount || 0,
			comment: record?.clientStatistics?.comment || '',
			authInfoUpdateRequest: {
				phoneNumber: record.phoneNumber,
				oldPassword: '',
				newPassword: '',
			},
		})
	}

	return (
		<div
			style={{ gap: open ? '10px' : '0px' }}
			className="w-full min-h-100vh bg-white flex "
		>
			<EditNewUser
				setOpen={setOpen}
				registered={registered}
				userId={userId}
				isOpenModal={isOpenModal}
				dataNewUser={dataNewUser}
				setDataNewUser={setDataNewUser}
				handleClose={() => {
					setIsOpenModal(false)
					refetch()
				}}
			/>
			<NewUser isOpenModal={active} handleClose={handleClose} />
			<div
			 
				className="rounded-[8px] w-full bg-white p-[20px]"
			>
				<Flex justify="space-between">
					<Flex vertical>
						<StyledTitle>Клиенты</StyledTitle>
						<p className="myfont">
							Общ количество: {paginationValue.totalElements}
						</p>
					</Flex>
					<Flex gap={10} align="end">
						<div className="w-[300px]">
							<Input
								width="100%"
								label="Поиск"
								value={search}
								placeholder="Искать клиента"
								onChange={(e) => {
									if (open) setOpen(false)
									setSearch(e.target.value)
								}}
							/>
						</div>
						<Button
							width="120px"
							onClick={() => {
								setOpen(false)
								setActive(true)
							}}
						>
							Добавить
						</Button>
					</Flex>
				</Flex>
				<StyledTable
					className="mt-4 w-full"
					columns={getColumnsClient(
						handleDelete,
						handleEdit,
						paginationValue.page,
						paginationValue.pageSize,
						setInnerData,
						setUserId,
						setRegistered,
						setOpen
					)}
					dataSource={userAdmin?.content}
					loading={isLoadingUsers}
					pagination={{
						current: paginationValue.page,
						pageSize: paginationValue.pageSize,
						total: paginationValue.totalElements,
						onChange: paginationChange,
						showSizeChanger: false,
					}}
					onRow={(record: any) => ({
						onClick: () => {
							setInnerData(record)
							setOpen(true)
						},
					})}
				/>
			</div>
			{open ? (
				<InnerClient
					innerData={innerData}
					setOpen={setOpen}
					refetch={refetch}
					setRegistered={setRegistered}
					setIsOpenModal={setIsOpenModal}
					setUserId={setUserId}
					setDataNewUser={setDataNewUser}
				/>
			) : (
				''
			)}
		</div>
	)
}
