import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateTool } from '@/lib/api';
import { type Tool } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	setEditModalData,
	setEditModalLoading,
	updateToolInStore,
} from '@/store/slice/toolsSlice';
import { isAxiosError } from 'axios';
import {
	Camera,
	Image as ImageIcon,
	Loader2,
	Pencil,
	Save,
	Upload,
	X,
} from 'lucide-react';
import type React from 'react';
import { useRef } from 'react';
import { toast } from 'sonner';

export const EditableToolCardModal = ({
	tool,
	onClose,
	onUpdate,
}: {
	tool: Tool;
	onClose: () => void;
	onUpdate: () => void;
}) => {
	const dispatch = useAppDispatch();
	const { editModalData, isEditModalLoading } = useAppSelector(
		(state) => state.tools
	);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const isEditing = editModalData.isEditing;
	const formData = editModalData.formData;
	const logoPreview = editModalData.logoPreview || tool.logoUrl;

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		dispatch(
			setEditModalData({
				...editModalData,
				formData: { ...formData, [e.target.id]: e.target.value },
			})
		);
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
	};

	const handleEditToggle = () => {
		if (!isEditing) {
			dispatch(
				setEditModalData({
					isEditing: true,
					formData: {
						name: tool.name,
						tagline: tool.tagline,
						description: tool.description,
						websiteUrl: tool.websiteUrl,
					},
					logoFile: null,
					logoPreview: tool.logoUrl || null,
				})
			);
		} else {
			dispatch(
				setEditModalData({
					isEditing: false,
					formData: {
						name: '',
						tagline: '',
						description: '',
						websiteUrl: '',
					},
					logoFile: null,
					logoPreview: null,
				})
			);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(setEditModalLoading(true));

		try {
			const updateData = new FormData();
			updateData.append('name', formData.name);
			updateData.append('tagline', formData.tagline);
			updateData.append('description', formData.description);
			updateData.append('websiteUrl', formData.websiteUrl);

			if (editModalData.logoFile) {
				updateData.append('toolLogo', editModalData.logoFile);
			}

			const updatedTool = await updateTool(tool._id, updateData);
			dispatch(updateToolInStore(updatedTool));
			toast.success('Tool updated successfully!');
			onUpdate();
			onClose();
		} catch (error: unknown) {
			if (isAxiosError(error)) toast.error('Failed to update tool.');
			console.error(error);
		} finally {
			dispatch(setEditModalLoading(false));
		}
	};

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<DialogTitle className="text-2xl font-bold text-white flex items-center space-x-2">
								{isEditing ? (
									<>
										<Pencil className="h-6 w-6 text-blue-400" />
										<span>Edit Tool</span>
									</>
								) : (
									<>
										<ImageIcon className="h-6 w-6 text-green-400" />
										<span>Tool Details</span>
									</>
								)}
							</DialogTitle>
							<DialogDescription className="text-gray-400">
								{isEditing
									? 'Update your tool details below.'
									: 'View the details of your tool submission.'}
							</DialogDescription>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={handleEditToggle}
							className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
							{isEditing ? (
								<>
									<X className="mr-2 h-4 w-4" />
									Cancel
								</>
							) : (
								<>
									<Pencil className="mr-2 h-4 w-4" />
									Edit
								</>
							)}
						</Button>
					</div>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Tool Logo Section */}
					<div className="space-y-3">
						<Label
							htmlFor="logo"
							className="text-sm font-semibold text-gray-300">
							Tool Logo
						</Label>
						<div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
							<div className="relative group">
								{logoPreview ? (
									<div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-800 ring-2 ring-gray-600">
										<img
											src={logoPreview}
											alt="Tool logo preview"
											className="h-full w-full object-cover"
										/>
									</div>
								) : (
									<div className="w-24 h-24 rounded-xl bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center">
										<Camera className="h-8 w-8 text-gray-500" />
									</div>
								)}
								{isEditing && (
									<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
										<Camera className="h-6 w-6 text-white" />
									</div>
								)}
							</div>
							{isEditing && (
								<div className="space-y-2">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => fileInputRef.current?.click()}
										disabled={isEditModalLoading}
										className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
										<Upload className="mr-2 h-4 w-4" />
										Change Logo
									</Button>
									<p className="text-xs text-gray-500">
										Recommended: 256x256px, PNG or JPG
									</p>
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

					{/* Tool Name */}
					<div className="space-y-2">
						<Label
							htmlFor="name"
							className="text-sm font-semibold text-gray-300">
							Tool Name
						</Label>
						{isEditing ? (
							<Input
								id="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="Enter tool name"
								className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
								disabled={isEditModalLoading}
								required
							/>
						) : (
							<div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
								<span className="text-white font-medium">{tool.name}</span>
							</div>
						)}
					</div>

					{/* Tagline */}
					<div className="space-y-2">
						<Label
							htmlFor="tagline"
							className="text-sm font-semibold text-gray-300">
							Tagline
						</Label>
						{isEditing ? (
							<Input
								id="tagline"
								value={formData.tagline}
								onChange={handleInputChange}
								placeholder="Enter a compelling tagline"
								className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
								disabled={isEditModalLoading}
								required
							/>
						) : (
							<div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
								<span className="text-gray-300">{tool.tagline}</span>
							</div>
						)}
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Label
							htmlFor="description"
							className="text-sm font-semibold text-gray-300">
							Description
						</Label>
						{isEditing ? (
							<Textarea
								id="description"
								value={formData.description}
								onChange={handleInputChange}
								placeholder="Describe your tool's features and benefits"
								rows={4}
								className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 resize-none"
								disabled={isEditModalLoading}
								required
							/>
						) : (
							<div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 max-h-32 overflow-y-auto">
								<span className="text-gray-300 leading-relaxed">
									{tool.description}
								</span>
							</div>
						)}
					</div>

					{/* Website URL */}
					<div className="space-y-2">
						<Label
							htmlFor="websiteUrl"
							className="text-sm font-semibold text-gray-300">
							Website URL
						</Label>
						{isEditing ? (
							<Input
								id="websiteUrl"
								value={formData.websiteUrl}
								onChange={handleInputChange}
								placeholder="https://yourtool.com"
								type="url"
								className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
								disabled={isEditModalLoading}
								required
							/>
						) : (
							<div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
								<a
									href={tool.websiteUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-400 hover:text-blue-300 underline break-all">
									{tool.websiteUrl}
								</a>
							</div>
						)}
					</div>

					{/* Action Buttons */}
					{isEditing && (
						<DialogFooter className="flex flex-col sm:flex-row gap-3">
							<Button
								type="button"
								variant="outline"
								onClick={handleEditToggle}
								disabled={isEditModalLoading}
								className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isEditModalLoading}
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
								{isEditModalLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving...
									</>
								) : (
									<>
										<Save className="mr-2 h-4 w-4" />
										Save Changes
									</>
								)}
							</Button>
						</DialogFooter>
					)}
				</form>
			</DialogContent>
		</Dialog>
	);
};
