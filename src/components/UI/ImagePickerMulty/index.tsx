import { useDropzone } from 'react-dropzone'
import { LuImagePlus } from 'react-icons/lu'
import { InputHTMLAttributes, MouseEvent, useCallback } from 'react'
import { RxCross2 } from 'react-icons/rx'
import styles from './styles.module.css'

interface ImgPickerProps {
	onChange: (files: File[]) => void
	value: File[]
}

export const ImagePickerMulty = (
	props: ImgPickerProps & InputHTMLAttributes<HTMLInputElement>
) => {
	const { value = [], onChange } = props

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			onChange(acceptedFiles)
		},
		[onChange]
	)

	const { getRootProps, getInputProps } = useDropzone({
		onDrop: onDrop,
		accept: {
			'image/jpeg': [],
			'image/png': [],
			'image/jpg': [],
		},
		multiple: true,
	})

	const Reset = (event: MouseEvent) => {
		event.stopPropagation()
		onChange([])
	}

	return (
		<div className={styles.picker_container}>
			<div className={styles.containerdrop} {...getRootProps()} {...props}>
				{value?.length === 0 ? (
					<div className={styles.is_empty_wrapper}>
						<p className={styles.is_empty_content}>
							<LuImagePlus size={30} />
							Перенесите сюда файл или выберите <br /> Требования: jpeg, png,
							jpg, Менее 5 Mb
						</p>
					</div>
				) : (
					<div className={styles.img_wrapper}>
						{value?.map((file, index) => (
							<div key={index + 1}>
								<img
									className={styles.img}
									src={URL?.createObjectURL(file)}
									alt=""
									width={0}
									height={0}
								/>
								<RxCross2 size={36} className={styles.delete} onClick={Reset} />
							</div>
						))}
					</div>
				)}
				<input {...getInputProps()} />
			</div>
		</div>
	)
}
