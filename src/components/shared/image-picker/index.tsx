import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import isEmptyImagePicker from '../../../assets/image/isEmptyImagePicker.webp'
import { CiImageOn } from 'react-icons/ci'

interface ImagePickerProps {
	width?: string
	height?: string
	border?: string
	borderRadius?: string
	backgroundColor?: string
	color?: string
	setValue: any
	value?: any
}

export const NewImagePicker = (
	{ setValue, value }: ImagePickerProps,
	props: ImagePickerProps
) => {
	const [selectedImage, setSelectedImage] = useState<string | undefined>(value)

	useEffect(() => {
		setSelectedImage(value)
	}, [value])

	const onDrop = (acceptedFiles: File[]) => {
		if (acceptedFiles.length > 0) {
			const file = acceptedFiles[0]
			const reader = new FileReader()
			reader.onloadend = () => {
				setSelectedImage(reader.result as string)
			}
			reader.readAsDataURL(file)
			setValue(file)
		}
	}

	const { getRootProps, getInputProps } = useDropzone({ onDrop })

	const IsTrueImage = () => {
		if (selectedImage === undefined) {
			return isEmptyImagePicker
		} else {
			return selectedImage
		}
	}

	return (
		<div className="w-[300px] h-[200px] rounded-[16px] bg-[#E8EAED] flex justify-center items-center">
			<div className="" {...getRootProps()} {...props}>
				{selectedImage ? (
					<img
						className="w-[300px] h-[200px] rounded-[16px] object-cover"
						src={IsTrueImage()}
						alt="ImagePicker"
						width={0}
						height={0}
						style={props}
					/>
				) : (
					<div className='flex flex-col items-center gap-2'>
						<CiImageOn fontSize={50} onClick={() => IsTrueImage()} />
						<p className="text-[#4E4E4E80] text-[12px] font-[500]">
							Нажмите здесь чтобы загрузить фото
						</p>
					</div>
				)}
				<input {...getInputProps()} />
			</div>
		</div>
	)
}
