import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { IoIosArrowDown, IoIosClose } from 'react-icons/io'
import { BsDatabaseX } from 'react-icons/bs'

interface SelectProp {
	placeholder: string
	title: string
	required?: boolean
	options: any[]
	value: { value: number; label: string }[]
	setValue: any
	error?: string
	noData?: any
	noIcon?: boolean
	renderOption?: any
	clear: () => void
	remove: (id: number) => void
}

export const InoiMultiSelect = ({
	title,
	required,
	options = [],
	placeholder,
	value = [],
	setValue,
	error,
	noData,
	noIcon = false,
	renderOption = (item: any) => item,
	clear,
	remove,
}: SelectProp) => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const boxRef = useRef<HTMLDivElement>(null)
	const [topHeight, setTopHeight] = useState(60)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	useEffect(() => {
		if (dropdownRef.current?.clientHeight) {
			setTopHeight(dropdownRef.current.clientHeight || 60)
		}
	}, [value])

	const handleSelect = (option: string) => {
		setValue(option)
		setIsOpen(false)
	}

	return (
		<Wrapper className="noselect" ref={dropdownRef}>
			<Title>
				{title} {required && <span className="text-red-500">*</span>}
			</Title>
			<SelectBox
				tabIndex={0}
				ref={boxRef}
				onClick={() => setIsOpen(!isOpen)}
				className="border-[1px] border-transparent focus:border-[#FF99D4] border-solid focus:shadow-lg"
			>
				{value.length ? (
					<div className="flex items-center gap-[1px] w-full flex-wrap ">
						{value.map((item) => (
							<Value key={item.value}>
								{item.label}
								<IoIosClose
									size={16}
									onClick={(e: any) => {
										e.stopPropagation()
										remove(item.value)
									}}
								/>
							</Value>
						))}
					</div>
				) : (
					<Placeholder>{placeholder}</Placeholder>
				)}
				{value.length ? (
					<div
						onClick={clear}
						className="absolute right-2 shadow-xl top-[-10px] bg-[#f1f1f1] rounded-full z-50 "
					>
						<IoIosClose onClick={clear} size={18} className="" />
					</div>
				) : (
					''
				)}
				<div className="absolute right-2 top-0 bottom-0 flex justify-center items-center">
					<IoIosArrowDown
						size={18}
						className={`text-[#999999] ${
							!isOpen ? 'rotate-0' : 'rotate-180'
						} transition-all duration-300 `}
					/>
				</div>
			</SelectBox>
			<Dropdown topHeight={topHeight} isOpen={isOpen}>
				{options.length ? (
					options.map((option: any, index) => (
						<Option key={index} onClick={() => handleSelect(option)}>
							{renderOption(option)}
						</Option>
					))
				) : (
					<div className="w-full flex justify-center items-center p-2">
						<div className="flex flex-col justify-center items-center gap-2 text-xs text-[#abadae]">
							{!noIcon && <BsDatabaseX size={26} className="text-[#abadae]" />}
							{noData || (
								<div className="text-[#abadae] text-xs font-[300]">
									Пустые данные
								</div>
							)}
						</div>
					</div>
				)}
			</Dropdown>
			{error && <Error>{error}</Error>}
		</Wrapper>
	)
}

const Wrapper = styled.div`
	width: 100%;
	position: relative;
`

const Title = styled.p`
	font-weight: 400;
	font-size: 13px;
	display: flex;
	align-items: center;
`

const Error = styled.p`
	font-size: 11px;
	color: red;
	padding-left: 10px;
	position: absolute;
`

const Value = styled.span`
	color: #101010;
	font-size: 12px;
	font-weight: 400;
	background-color: #f1f1f1;
	border-radius: 5px;
	padding: 1px 3px;
	display: flex;
	align-items: center;
`

const SelectBox = styled.div`
	width: 100%;
	min-height: 40px;
	border: #d8dadc 1px solid;
	border-radius: 10px;
	font-size: 14px;
	font-weight: 400;
	padding: 2px 10px;
	display: flex;
	align-items: center;
	cursor: pointer;
	position: relative;
	transition: box-shadow 0.2s ease-in-out;
`

const Placeholder = styled.span`
	color: #a0a0a0;
	font-size: 13px;
	font-weight: 300;
`

const Dropdown = styled.ul<{ isOpen: boolean; topHeight: number }>`
	position: absolute;
	top: ${({ topHeight }) => topHeight || 60};
	left: 0;
	width: 100%;
	border: #d8dadc 1px solid;
	border-radius: 10px;
	background-color: #fff;
	list-style: none;
	margin: 0;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	z-index: 99999;
	max-height: ${({ isOpen }) => (isOpen ? '200px' : '0')};
	overflow-y: auto;
	opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
	transition:
		max-height 0.2s ease-in-out,
		opacity 0.2s ease-in-out,
		transform 0.2s ease-in-out;
`

const Option = styled.li`
	padding: 5px 10px;
	cursor: pointer;
	font-size: 13px;
	transition: background-color 0.2s;

	&:hover {
		background-color: #f1f1f1;
	}
`
