// src/pages/tools/components/BasicDetailsStep.tsx

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type SubmitToolFormData } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setEditModalData } from '@/store/slice/toolsSlice';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Upload } from 'lucide-react';

interface BasicDetailsStepProps {
	formData: SubmitToolFormData;
	logoPreview: string | null;
	fileInputRef: React.RefObject<HTMLInputElement | null>; // ✅ Fix this line
	onFormChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BasicDetailsStep({
	formData,
	logoPreview,
	fileInputRef,
	onFormChange,
	onFileChange,
}: BasicDetailsStepProps) {
	const dispatch = useAppDispatch();
	const { editModalData } = useAppSelector((state) => state.tools);

	// Sync with Redux when form changes
	const handleFormChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const updatedFormData = {
			...editModalData.formData,
			[e.target.id]: e.target.value,
		};
		dispatch(
			setEditModalData({
				...editModalData,
				formData: updatedFormData,
			})
		);
		onFormChange(e);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const preview = URL.createObjectURL(file);
			dispatch(
				setEditModalData({
					...editModalData,
					logoFile: file,
					logoPreview: preview,
				})
			);
		}
		onFileChange(e);
	};

	return (
		<motion.div
			className="space-y-8"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}>
			{/* Tool Logo Section */}
			<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
				<CardContent className="p-6">
					<div className="space-y-4">
						<Label className="text-lg font-semibold text-white flex items-center space-x-2">
							<ImageIcon className="h-5 w-5 text-blue-400" />
							<span>Tool Logo (Optional)</span>
						</Label>
						<p className="text-gray-400 text-sm">
							Upload a clear logo that represents your tool. Square images work
							best.
						</p>

						<div
							className="group relative border-2 border-dashed border-gray-700 hover:border-blue-500/50 rounded-xl p-8 cursor-pointer transition-all duration-300 bg-gray-800/30 hover:bg-gray-800/50"
							onClick={() => fileInputRef.current?.click()}>
							{logoPreview ? (
								<div className="flex flex-col items-center space-y-4">
									<div className="relative">
										<img
											src={logoPreview}
											alt="Tool logo preview"
											className="w-24 h-24 object-cover rounded-xl shadow-lg ring-2 ring-gray-600 group-hover:ring-blue-500/50 transition-all duration-300"
										/>
										<div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
											<Upload className="h-6 w-6 text-white" />
										</div>
									</div>
									<p className="text-gray-300 text-sm font-medium">
										Click to change logo
									</p>
								</div>
							) : (
								<div className="flex flex-col items-center space-y-4 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
									<div className="w-20 h-20 bg-gray-700/50 rounded-xl flex items-center justify-center group-hover:bg-gray-600/50 transition-colors duration-300">
										<Upload className="h-8 w-8" />
									</div>
									<div className="text-center">
										<p className="font-medium text-lg">Click to upload logo</p>
										<p className="text-sm">PNG, JPG up to 2MB</p>
									</div>
								</div>
							)}
						</div>

						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="hidden"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Form Fields */}
			<div className="grid gap-6">
				{/* Tool Name */}
				<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
					<CardContent className="p-6">
						<div className="space-y-3">
							<Label
								htmlFor="name"
								className="text-lg font-semibold text-white">
								Tool Name *
							</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={handleFormChange}
								placeholder="Enter your tool's name"
								className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 text-lg py-3"
								required
							/>
							<p className="text-gray-400 text-sm">
								Choose a clear, memorable name that describes your tool
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Tagline */}
				<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
					<CardContent className="p-6">
						<div className="space-y-3">
							<Label
								htmlFor="tagline"
								className="text-lg font-semibold text-white">
								Tagline *
							</Label>
							<Input
								id="tagline"
								value={formData.tagline}
								onChange={handleFormChange}
								placeholder="A brief, compelling description"
								className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 text-lg py-3"
								required
							/>
							<p className="text-gray-400 text-sm">
								A concise one-liner that explains what your tool does
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Description */}
				<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
					<CardContent className="p-6">
						<div className="space-y-3">
							<Label
								htmlFor="description"
								className="text-lg font-semibold text-white">
								Full Description *
							</Label>
							<Textarea
								id="description"
								value={formData.description}
								onChange={handleFormChange}
								placeholder="Provide a detailed description of your tool's features, benefits, and use cases..."
								className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 min-h-[120px] resize-none"
								required
							/>
							<p className="text-gray-400 text-sm">
								Explain the key features, benefits, and who should use this tool
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</motion.div>
	);
}
