// src/pages/tools/components/BasicDetailsStep.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type SubmitToolFormData } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setEditModalData } from '@/store/slice/toolsSlice';
import { Upload } from 'lucide-react';

interface BasicDetailsStepProps {
	formData: SubmitToolFormData;
	logoPreview: string | null;
	fileInputRef: React.RefObject<HTMLInputElement>;
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
		<>
			<div className="space-y-2">
				<Label htmlFor="toolLogo">Tool Logo (Optional)</Label>
				<div
					className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
					onClick={() => fileInputRef.current?.click()}>
					{logoPreview ? (
						<img
							src={logoPreview}
							alt="Logo preview"
							className="mx-auto h-24 w-24 object-cover rounded-lg"
						/>
					) : (
						<div className="space-y-2">
							<Upload className="mx-auto h-12 w-12 text-muted-foreground" />
							<p className="text-sm text-muted-foreground">
								Click to upload logo
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

			<div className="space-y-2">
				<Label htmlFor="name">Tool Name</Label>
				<Input
					id="name"
					value={formData.name}
					onChange={handleFormChange}
					placeholder="Enter your tool name"
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="tagline">Tagline</Label>
				<Input
					id="tagline"
					value={formData.tagline}
					onChange={handleFormChange}
					placeholder="A brief, catchy description"
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Full Description</Label>
				<Textarea
					id="description"
					value={formData.description}
					onChange={handleFormChange}
					placeholder="Detailed description of your tool"
					className="min-h-[120px]"
					required
				/>
			</div>
		</>
	);
}
