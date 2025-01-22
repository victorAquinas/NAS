import { useState } from 'react';
import { BsFiletypeXls } from 'react-icons/bs';

interface AtFileUploaderProps {
	onFileUpload: (file: File) => void;
}

const AtFileUploader: React.FC<AtFileUploaderProps> = ({ onFileUpload }) => {
	const [dragActive, setDragActive] = useState(false);

	const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setDragActive(true);
		} else if (e.type === 'dragleave') {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const file = e.dataTransfer.files[0];
			if (
				file.type ===
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			) {
				onFileUpload(file);
			} else {
				alert('Please upload only .xlsx files');
			}
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			if (
				file.type ===
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			) {
				onFileUpload(file);
			} else {
				alert('Please upload only .xlsx files');
			}
		}
	};

	return (
		<div
			onDragEnter={handleDrag}
			onDragOver={handleDrag}
			onDragLeave={handleDrag}
			onDrop={handleDrop}
			className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition relative ${
				dragActive ? 'bg-gray-100 border-blue-500' : 'bg-white border-gray-300'
			}`}
		>
			<div className='flex flex-col items-center'>
				<span className='text-4xl mb-2'>
					<BsFiletypeXls />
				</span>
				<p className='font-semibold text-gray-700'>
					Drag & Drop or Choose file to upload
				</p>
				<p className='text-sm text-gray-500'>Only .xlsx</p>
				<input
					type='file'
					accept='.xlsx'
					className='absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer'
					onChange={handleChange}
				/>
			</div>
		</div>
	);
};

export default AtFileUploader;
