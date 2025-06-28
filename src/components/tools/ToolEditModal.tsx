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
	Image as ImageIcon,
	Loader2,
	Pencil,
	Save,
	Upload,
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
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<div className="flex items-center justify-between">
						<DialogTitle>
							{isEditing ? 'Edit Tool' : 'Tool Details'}
						</DialogTitle>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleEditToggle}
							disabled={isEditModalLoading}>
							<Pencil className="h-4 w-4 mr-2" />
							{isEditing ? 'Cancel' : 'Edit'}
						</Button>
					</div>
					<DialogDescription>
						{isEditing
							? 'Update your tool details below.'
							: 'View the details of your tool submission.'}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-4">
						<Label>Tool Logo</Label>
						<div className="flex items-center space-x-4">
							{logoPreview ? (
								<img
									src={logoPreview}
									alt="Tool logo"
									className="h-16 w-16 rounded-lg object-cover"
								/>
							) : (
								<div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
									<ImageIcon className="h-8 w-8 text-muted-foreground" />
								</div>
							)}
							{isEditing && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => fileInputRef.current?.click()}
									disabled={isEditModalLoading}>
									<Upload className="h-4 w-4 mr-2" />
									Change Logo
								</Button>
							)}
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								className="hidden"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="name">Tool Name</Label>
						{isEditing ? (
							<Input
								id="name"
								value={formData.name}
								onChange={handleInputChange}
								disabled={isEditModalLoading}
								required
							/>
						) : (
							<p className="text-sm text-muted-foreground">{tool.name}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="tagline">Tagline</Label>
						{isEditing ? (
							<Input
								id="tagline"
								value={formData.tagline}
								onChange={handleInputChange}
								disabled={isEditModalLoading}
								required
							/>
						) : (
							<p className="text-sm text-muted-foreground">{tool.tagline}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						{isEditing ? (
							<Textarea
								id="description"
								rows={4}
								value={formData.description}
								onChange={handleInputChange}
								disabled={isEditModalLoading}
								required
							/>
						) : (
							<p className="text-sm text-muted-foreground">
								{tool.description}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="websiteUrl">Website URL</Label>
						{isEditing ? (
							<Input
								id="websiteUrl"
								type="url"
								value={formData.websiteUrl}
								onChange={handleInputChange}
								disabled={isEditModalLoading}
								required
							/>
						) : (
							<p className="text-sm text-muted-foreground">{tool.websiteUrl}</p>
						)}
					</div>

					{isEditing && (
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={handleEditToggle}
								disabled={isEditModalLoading}>
								Cancel
							</Button>
							<Button type="submit" disabled={isEditModalLoading}>
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
