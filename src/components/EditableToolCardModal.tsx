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
import { isAxiosError } from 'axios';
import {
	Image as ImageIcon,
	Loader2,
	Pencil,
	Save,
	Upload,
} from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';

export const EditableToolCardModal = ({
	tool,
	onClose,
	onUpdate,
}: {
	tool: Tool;
	onClose: () => void;
	onUpdate: () => void;
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: tool.name,
		tagline: tool.tagline,
		description: tool.description,
		websiteUrl: tool.websiteUrl,
	});
	const [logoFile, setLogoFile] = useState<File | null>(null);
	const [logoPreview, setLogoPreview] = useState<string | null>(
		tool.logoUrl || null
	);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setLogoFile(file);
			setLogoPreview(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const updateData = new FormData();
			updateData.append('name', formData.name);
			updateData.append('tagline', formData.tagline);
			updateData.append('description', formData.description);
			updateData.append('websiteUrl', formData.websiteUrl);

			if (logoFile) {
				updateData.append('toolLogo', logoFile);
			}
			await updateTool(tool._id, updateData);

			toast.success('Tool updated successfully!');
			onUpdate();
			onClose();
		} catch (error: unknown) {
			if (isAxiosError(error)) toast.error('Failed to update tool.');
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle className="flex justify-between items-center">
							{isEditing ? 'Edit Tool' : 'Tool Details'}
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setIsEditing(!isEditing)}>
								<Pencil className="h-4 w-4 mr-2" />
								{isEditing ? 'Cancel' : 'Edit'}
							</Button>
						</DialogTitle>
						<DialogDescription>
							{isEditing
								? 'Update your tool details below.'
								: 'View the details of your tool submission.'}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-6 py-6">
						<div className="flex items-center gap-6">
							<div className="relative w-24 h-24 flex-shrink-0">
								{logoPreview ? (
									<img
										src={logoPreview}
										alt="logo"
										className="w-full h-full object-cover rounded-lg border"
									/>
								) : (
									<div className="w-full h-full bg-muted rounded-lg flex items-center justify-center border">
										<ImageIcon className="h-8 w-8 text-muted-foreground" />
									</div>
								)}
								{isEditing && (
									<Button
										type="button"
										size="icon"
										variant="outline"
										className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-background"
										onClick={() => fileInputRef.current?.click()}
										disabled={isLoading}>
										<Upload className="h-4 w-4" />
									</Button>
								)}
								<input
									type="file"
									ref={fileInputRef}
									className="hidden"
									onChange={handleFileChange}
									accept="image/*"
									disabled={!isEditing || isLoading}
								/>
							</div>
							<div className="flex-grow space-y-2">
								<Label htmlFor="name">Tool Name</Label>
								{isEditing ? (
									<Input
										id="name"
										value={formData.name}
										onChange={handleInputChange}
										disabled={isLoading}
									/>
								) : (
									<p className="font-semibold text-lg">{tool.name}</p>
								)}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="tagline">Tagline</Label>
							{isEditing ? (
								<Input
									id="tagline"
									value={formData.tagline}
									onChange={handleInputChange}
									disabled={isLoading}
								/>
							) : (
								<p>{tool.tagline}</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							{isEditing ? (
								<Textarea
									id="description"
									value={formData.description}
									onChange={handleInputChange}
									disabled={isLoading}
									className="min-h-[120px]"
								/>
							) : (
								<p className="text-sm text-muted-foreground">
									{tool.description}
								</p>
							)}
						</div>
					</div>
					{isEditing && (
						<DialogFooter>
							<Button
								type="button"
								variant="ghost"
								onClick={onClose}
								disabled={isLoading}>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Save className="mr-2 h-4 w-4" />
								)}
								Save Changes
							</Button>
						</DialogFooter>
					)}
				</form>
			</DialogContent>
		</Dialog>
	);
};
