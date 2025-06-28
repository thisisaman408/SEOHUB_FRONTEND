// src/pages/tools/components/VisualsStep.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { type SubmitToolFormData } from '@/lib/types';
import { Trash2 } from 'lucide-react';

interface VisualsStepProps {
	formData: SubmitToolFormData;
	onVisualChange: <T extends keyof SubmitToolFormData['visual']>(
		field: T,
		value: SubmitToolFormData['visual'][T]
	) => void;
	onInsightChange: (index: number, text: string) => void;
	onAddInsight: () => void;
	onRemoveInsight: (index: number) => void;
}

export function VisualsStep({
	formData,
	onVisualChange,
	onInsightChange,
	onAddInsight,
	onRemoveInsight,
}: VisualsStepProps) {
	const handleVisualChange = <T extends keyof SubmitToolFormData['visual']>(
		field: T,
		value: SubmitToolFormData['visual'][T]
	) => {
		onVisualChange(field, value);
	};

	const handleInsightChange = (index: number, text: string) => {
		const updatedContent = [...formData.visual.content];
		updatedContent[index] = { ...updatedContent[index], text };

		handleVisualChange('content', updatedContent);
		onInsightChange(index, text);
	};

	const handleAddInsight = () => {
		const newInsight = { icon: 'zap', text: '' };
		const updatedContent = [...formData.visual.content, newInsight];

		handleVisualChange('content', updatedContent);
		onAddInsight();
	};

	const handleRemoveInsight = (index: number) => {
		const updatedContent = formData.visual.content.filter(
			(_, i) => i !== index
		);

		handleVisualChange('content', updatedContent);
		onRemoveInsight(index);
	};

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Label>Card Color Theme</Label>
				<Select
					value={formData.visual.color}
					onValueChange={(value) => handleVisualChange('color', value)}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="blue">Blue</SelectItem>
						<SelectItem value="green">Green</SelectItem>
						<SelectItem value="purple">Purple</SelectItem>
						<SelectItem value="orange">Orange</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-4">
				<Label>Generated Insights (for card visual)</Label>
				{formData.visual.content.map((insight, index) => (
					<div key={index} className="flex gap-2">
						<Input
							value={insight.text}
							onChange={(e) => handleInsightChange(index, e.target.value)}
							placeholder={`Feature highlight ${index + 1}`}
							className="flex-1"
						/>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => handleRemoveInsight(index)}
							disabled={formData.visual.content.length <= 1}>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				))}
				<Button type="button" variant="outline" onClick={handleAddInsight}>
					Add Insight
				</Button>
			</div>
		</div>
	);
}
