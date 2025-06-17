import React, { useState } from 'react'
import styles from './ServiceAccordion.module.css'
import { ReactComponent as DeleteIcon } from '../../../assets/icons/delete-icon.svg'
import { ReactComponent as RenameIcon } from '../../../assets/icons/rename-icon.svg'
import { ReactComponent as AddCategoryIcon } from '../../../assets/icons/add-category-icon.svg'
import { ReactComponent as ArrowDownIcon } from '../../../assets/icons/arrow-down-icon.svg'
import { ReactComponent as ArrowUpIcon } from '../../../assets/icons/arrow-up-icon.svg'
import { ServiceResponse, Category } from '../../../common/service'

interface AccordionProps {
	data: Category[]
	onDeleteService: (id: number) => void
	onAddCategoryService: (id: number) => void
	onUpdateCategory: (editId: ServiceResponse, subId: number) => void
}
export const ServicesAccordion: React.FC<AccordionProps> = ({
	data = [],
	onDeleteService,
	onAddCategoryService,
	onUpdateCategory,
}) => {
	const [openCategory, setOpenCategory] = useState<number | null>(
		data.length > 0 ? data[0].id : null
	)
	const [openSubCategory, setOpenSubCategory] = useState<
		Record<number, boolean>
	>({})
	const [openSubCategories, setOpenSubCategories] = useState<
		Record<number, boolean>
	>({})

	const toggleCategory = (id: number) => {
		setOpenCategory(openCategory === id ? null : id)
	}

	const toggleSubCategory = (id: number) => {
		setOpenSubCategory((prevState) => ({
			...prevState,
			[id]: !prevState[id],
		}))
	}

	const toggleServiceCategory = (id: number) => {
		setOpenSubCategories((prevState) => ({
			...prevState,
			[id]: !prevState[id],
		}))
	}

	return (
		<div className={styles.accordion}>
			{data.map((category) => (
				<div key={category.id} className={styles.category}>
					<div
						className={styles.header}
						onClick={() => toggleCategory(category.id)}
					>
						<div className={styles.iconAndName}>
							<img
								src={category.icon}
								alt={category.name}
								className={styles.icon}
							/>
							<h3>{category.name}</h3>
						</div>
						<div className={styles.bordered} />
						<button className={styles.toggleButton}>
							{openCategory === category.id ? (
								<ArrowUpIcon />
							) : (
								<ArrowDownIcon />
							)}
						</button>
					</div>
					{openCategory === category.id &&
						category.subCategoryServices.map((subCategory) => (
							<div key={subCategory.id} className={styles.subCategory}>
								<div
									className={styles.subHeader}
									onClick={() => toggleSubCategory(subCategory.id)}
								>
									<div className={styles.iconAndName}>
										<h4>{subCategory.name}</h4>
									</div>
									<div className={styles.bordered} />
									<button className={styles.toggleButton}>
										{openSubCategory[subCategory.id] ? (
											<ArrowUpIcon />
										) : (
											<ArrowDownIcon />
										)}
									</button>
									<button onClick={() => onAddCategoryService(subCategory.id)}>
										<AddCategoryIcon />
									</button>
								</div>
								<section className={styles.wrapper_subService}>
									{openSubCategory[subCategory.id] &&
										subCategory.serviceResponses.map((service) => (
											<div key={service.id} className={styles.service}>
												<div
													className={styles.subHeader}
													onClick={() => toggleServiceCategory(service.id)}
												>
													<div className={styles.iconAndName}>
														<p>Название: {service.name}</p>
													</div>
													<div className={styles.bordered} />
													<button className={styles.toggleButton}>
														{openSubCategories[service.id] ? (
															<ArrowUpIcon />
														) : (
															<ArrowDownIcon />
														)}
													</button>
												</div>
												<article className={styles.wrapper}>
													{openSubCategories[service.id] && (
														<section className={styles.serviceInfo}>
															<div className={styles.box_service_info}>
																<div className={styles.wrapper_image}>
																	<img src={service.image} alt={service.name} />
																</div>
																<div className={styles.first_block}>
																	<div>
																		<p>Цена</p>
																		<div>{service.price} сом</div>
																	</div>
																	<div>
																		<p>Длительность</p>
																		<div>{service.duration}</div>
																	</div>
																	<div>
																		<p>Описание услуги</p>
																		<p>{service.description}</p>
																	</div>
																</div>
															</div>
															<div className={styles.third_block}>
																<button
																	className={styles.icon_button}
																	onClick={() => onDeleteService(service.id)}
																>
																	<DeleteIcon />
																</button>
																<button
																	className={styles.icon_button}
																	onClick={() =>
																		onUpdateCategory(service, subCategory.id)
																	}
																>
																	<RenameIcon />
																</button>
															</div>
														</section>
													)}
												</article>
											</div>
										))}
								</section>
							</div>
						))}
				</div>
			))}
		</div>
	)
}
