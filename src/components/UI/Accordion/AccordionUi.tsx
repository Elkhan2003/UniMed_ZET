import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { BiSolidCircle } from 'react-icons/bi'
import { AiOutlineRightCircle } from 'react-icons/ai'
import styles from './Accordion.module.css'
import { Link, useLocation } from 'react-router-dom'
import { Divider } from '@mui/material'
import { useSelector } from 'react-redux'

interface AccordionProps {
	backgroundColor?: string
	data: any[]
	ifBranchId?: string
	branchAll?: any
	branchData?: any
	showLoginModalHandler?: any
}

const SubAccordion = ({
	item,
	isAuthenticated,
	path,
	branchAll,
	showLoginModalHandler,
	ifBranchId,
}: any) => (
	<Accordion
		className={styles['MuiPaper-root']}
		sx={{ boxShadow: 'none' }}
		key={item.id}
	>
		<AccordionSummary
			expandIcon={<ExpandMoreIcon />}
			aria-controls="panel1a-content"
			id="panel1a-header"
		>
			<Typography>{item.name}</Typography>
		</AccordionSummary>
		<Divider />
		<AccordionDetails className={styles.details}>
			{item.serviceResponses.map((elem: any) => (
				<div className={styles.blockItem} key={elem.id}>
					<div className={styles.title}>
						<p>{elem.name}</p>
						<p className={styles.timePrice}>
							{elem.price} сом <BiSolidCircle size={8} />
							<span className={styles.duration}> {elem.duration} минут</span>
						</p>
					</div>
					{isAuthenticated ? (
						<Link
							to={`/${branchAll?.branchId}/service/${elem.id}`}
							className={
								path === 'barbershop' ? styles.barber_icon : styles.iconLink
							}
						>
							<span className={styles.badge}>Записаться!</span>
							<AiOutlineRightCircle />
						</Link>
					) : (
						<div
							onClick={() => showLoginModalHandler(elem.id)}
							className={
								path === 'barbershop' ? styles.barber_icon : styles.iconLink
							}
						>
							<span className={styles.badge}>Записаться!</span>
							<AiOutlineRightCircle />
						</div>
					)}
				</div>
			))}
		</AccordionDetails>
	</Accordion>
)

export const AccordionUi = (props: AccordionProps) => {
	const {
		data,
		backgroundColor,
		ifBranchId,
		branchAll,
		showLoginModalHandler,
	} = props
	const { pathname } = useLocation()
	const path = pathname.slice(1)

	const { isAuthenticated } = useSelector((state: any) => state.auth)

	return (
		<>
			{data?.map((el: any, index: number) => (
				<div key={index}>
					<Accordion
						className={styles['MuiPaper-root']}
						sx={{
							boxShadow: 'none',
							margin: '5px',
							backgroundColor: backgroundColor || '',
						}}
					>
						<AccordionSummary
							className={styles['MuiAccordionSummary-content']}
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<img
								className={styles.icon}
								src={el.icon}
								alt={el.icon}
								style={{ objectFit: 'cover' }}
							/>
							<p>{el.name}</p>
						</AccordionSummary>
						<AccordionDetails>
							{el.subCategoryServices.map((item: any, index: number) => (
								<div key={index}>
									<SubAccordion
										item={item}
										isAuthenticated={isAuthenticated}
										path={path}
										branchAll={branchAll}
										showLoginModalHandler={showLoginModalHandler}
										ifBranchId={ifBranchId}
									/>
								</div>
							))}
						</AccordionDetails>
					</Accordion>
				</div>
			))}
		</>
	)
}
