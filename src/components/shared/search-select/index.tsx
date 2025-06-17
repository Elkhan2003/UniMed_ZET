import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { IoIosArrowDown } from 'react-icons/io'
import { BsDatabaseX } from 'react-icons/bs'

interface SelectProp {
	placeholder: string
	title: string
	required?: boolean
	options: any[]
	value: any
	setValue: any
	error?: string
	noData?: any
	noIcon?: boolean
	renderOption?: any
	setSearchValue: any
}

export const InoiSearchSelect = ({
	title,
	required,
	options,
	placeholder,
	value,
	setValue,
	error,
	noData,
	noIcon = false,
	renderOption = (item: any) => item,
	setSearchValue,
}: SelectProp) => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

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

	const handleSelect = (option: any) => {
		setValue(option)
		setIsOpen(false)
	}

	return (
		<Wrapper className="noselect" ref={dropdownRef}>
			<Title>
				{title} {required && <span className="text-red-500">*</span>}
			</Title>
			<SearchInput
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={(e) => setSearchValue(e.target.value)}
				onClick={() => setIsOpen(!isOpen)}
				className='focus:border-myviolet focus:shadow-lg'
			/>
			<div className="absolute right-2 top-[25%] bottom-0 flex justify-center items-center">
				<IoIosArrowDown
					size={18}
					className={`text-[#999999] ${
						!isOpen ? 'rotate-0' : 'rotate-180'
					} transition-all duration-300 `}
				/>
			</div>
			<Dropdown onClick={() => false} isOpen={isOpen}>
				{options.length ? (
					options?.map((option: any, index) => (
						<Option key={index} onClick={() => handleSelect(option)}>
							{renderOption(option) || option.label}
						</Option>
					))
				) : (
					<NoDataWrapper>
						{!noIcon && <BsDatabaseX size={26} className="text-[#abadae]" />}
						{noData || <NoDataText>Пустые данные</NoDataText>}
					</NoDataWrapper>
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
	line-height: 15px;
	display: flex;
	align-items: center;
`

const Error = styled.p`
	font-size: 11px;
	color: red;
	padding-left: 10px;
	position: absolute;
`

const Dropdown = styled.ul<{ isOpen: boolean }>`
	position: absolute;
	top: 60px;
	left: 0;
	width: 100%;
	border: #d8dadc 1px solid;
	border-radius: 10px;
	background-color: #fff;
	list-style: none;
	padding: 5px;
	margin: 0;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	z-index: 99999;
	max-height: ${({ isOpen }) => (isOpen ? '200px' : '0')};
	overflow: auto;
	transition:
		max-height 0.2s ease-in-out,
		opacity 0.2s ease-in-out;
	opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
`

const Option = styled.li`
	width: 100%;
	padding: 3px 10px;
	cursor: pointer;
	font-size: 13px;
	border-radius: 5px;
	transition: background-color 0.2s;

	&:hover {
		background-color: #f1f1f1;
	}
	borderBottom: 1px #f1f1f1 solid;
`

const NoDataWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10px;
	text-align: center;
	color: #abadae;
	font-size: 12px;
`

const NoDataText = styled.div`
	color: #abadae;
	font-size: 12px;
	font-weight: 300;
`
const SearchInput = styled.input`
	width: 100%;
	height: 40px;
	border: #d8dadc 1px solid;
	border-radius: 10px;
	font-size: 14px;
	font-weight: 400;
	padding: 0px 10px;
	display: flex;
	align-items: center;
	cursor: pointer;
	position: relative;
	transition: box-shadow 0.2s ease-in-out;

	&::placeholder {
		color: #a0a0a0;
		font-size: 13px;
		font-weight: 200;
s		font-family: 'Involve';
	}
`
