// src/pages/tools/components/LinksAndTagsStep.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type SubmitToolFormData } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setEditModalData } from '@/store/slice/toolsSlice';

interface LinksAndTagsStepProps {
	formData: SubmitToolFormData;
	onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LinksAndTagsStep({
	formData,
	onFormChange,
}: LinksAndTagsStepProps) {
	const dispatch = useAppDispatch();
	const { editModalData } = useAppSelector((state) => state.tools);

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

	return (
		<>
			<div className="space-y-2">
				<Label htmlFor="websiteUrl">Website URL</Label>
				<Input
					id="websiteUrl"
					type="url"
					value={formData.websiteUrl}
					onChange={handleFormChange}
					placeholder="https://your-tool.com"
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="tags">Tags (comma-separated)</Label>
				<Input
					id="tags"
					value={formData.tags}
					onChange={handleFormChange}
					placeholder="AI, SEO, Content, Marketing"
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="appStoreUrl">App Store URL (Optional)</Label>
				<Input
					id="appStoreUrl"
					type="url"
					value={formData.appStoreUrl || ''}
					onChange={handleFormChange}
					placeholder="https://apps.apple.com/..."
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="playStoreUrl">Google Play URL (Optional)</Label>
				<Input
					id="playStoreUrl"
					type="url"
					value={formData.playStoreUrl || ''}
					onChange={handleFormChange}
					placeholder="https://play.google.com/..."
				/>
			</div>
		</>
	);
}
