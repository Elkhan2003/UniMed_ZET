import styled from 'styled-components'
import { FaArrowLeftLong } from 'react-icons/fa6'

interface WidgetWrapperProps {
	active: boolean
}

const Overlay: any = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.5);
	display: ${({ active }: any) => (active ? 'block' : 'none')};
	z-index: 999;
`

const WidgetWrapper: any = styled.div`
	position: fixed;
	top: 0;
	right: ${({ active, width }: any) => (active ? '0' : `-${width}px`)};
	height: 100vh;
	width: ${({ width }: any) => `${width}px`};
	background: white;
	box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	transition: right 0.3s ease;
`

const CloseButton = styled.button`
	position: absolute;
	top: 10px;
	left: 20px;
	background: none;
	border: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 10px;
`
const Container = styled.div`
	background: 'white';
`

const Widget = ({
	active,
	handleClose,
	children,
	back,
	width = '650',
}: {
	active: boolean
	handleClose: () => void
	children: any
	back: any
	width?: string
}) => {
	return (
		<>
			<Overlay active={active} onClick={handleClose} />
			<WidgetWrapper width={width} active={active}>
				<Container>
					<CloseButton onClick={back}>
						<FaArrowLeftLong />
						<p>Назад</p>
					</CloseButton>
				</Container>
				{children}
			</WidgetWrapper>
		</>
	)
}

export default Widget
