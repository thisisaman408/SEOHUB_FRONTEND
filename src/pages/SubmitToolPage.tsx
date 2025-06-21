import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMediaQuery } from '@/hooks/use-media-query';
import { submitTool } from '@/lib/api';
import { type SubmitToolData } from '@/lib/types';
import { isAxiosError } from 'axios';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function SubmitToolPage() {
	const navigate = useNavigate();
	const isMobile = useMediaQuery('(max-width: 768px)');

	const [isLoading, setIsLoading] = useState(false);
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState<SubmitToolData>({
		name: '',
		tagline: '',
		description: '',
		websiteUrl: '',
		tags: '',
		appStoreUrl: '',
		playStoreUrl: '',
		visual: {
			color: 'blue',
			content: [{ icon: 'zap', text: '' }],
		},
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};
	const handleVisualChange = <T extends keyof SubmitToolData['visual']>(
		field: T,
		value: SubmitToolData['visual'][T]
	) => {
		setFormData({
			...formData,
			visual: { ...formData.visual, [field]: value },
		});
	};

	const handleInsightChange = (index: number, text: string) => {
		const newContent = [...formData.visual.content];
		newContent[index].text = text;
		handleVisualChange('content', newContent);
	};

	const addInsight = () => {
		handleVisualChange('content', [
			...formData.visual.content,
			{ icon: 'zap', text: '' },
		]);
	};

	const removeInsight = (index: number) => {
		const newContent = formData.visual.content.filter((_, i) => i !== index);
		handleVisualChange('content', newContent);
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name || !formData.tagline || !formData.websiteUrl) {
			toast.error('Please fill out all required fields.');
			return;
		}
		setIsLoading(true);
		try {
			await submitTool(formData);
			toast.success('Tool submitted for review!');
			navigate('/my-tools');
		} catch (error) {
			const message =
				isAxiosError(error) && error.response
					? error.response.data.message
					: 'Submission failed. Please try again.';
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};
	const nextStep = () => {
		if (step === 1) {
			if (!formData.name || !formData.tagline || !formData.description) {
				toast.error('Please fill out the tool name, tagline, and description.');
				return;
			}
		}
		if (step === 2) {
			if (!formData.websiteUrl) {
				toast.error('Please provide a website URL.');
				return;
			}
		}
		setStep((prev) => prev + 1);
	};

	const prevStep = () => setStep((prev) => prev - 1);

	const renderFormContent = () => {
		if (!isMobile) {
			return (
				<>
					{renderStep1()}
					{renderStep2()}
					{renderStep3()}
				</>
			);
		}
		switch (step) {
			case 1:
				return renderStep1();
			case 2:
				return renderStep2();
			case 3:
				return renderStep3();
			default:
				return renderStep1();
		}
	};

	const renderStep1 = () => (
		<>
			<div className="grid gap-2">
				<Label htmlFor="name">Tool Name</Label>
				<Input
					id="name"
					required
					value={formData.name}
					onChange={handleChange}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="tagline">Tagline</Label>
				<Input
					id="tagline"
					required
					value={formData.tagline}
					onChange={handleChange}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="description">Full Description</Label>
				<Textarea
					id="description"
					required
					value={formData.description}
					onChange={handleChange}
				/>
			</div>
		</>
	);

	const renderStep2 = () => (
		<>
			<div className="grid md:grid-cols-2 gap-4">
				<div className="grid gap-2">
					<Label htmlFor="websiteUrl">Website URL</Label>
					<Input
						id="websiteUrl"
						required
						type="url"
						value={formData.websiteUrl}
						onChange={handleChange}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="tags">Tags (comma-separated)</Label>
					<Input id="tags" value={formData.tags} onChange={handleChange} />
				</div>
			</div>
			<div className="grid md:grid-cols-2 gap-4">
				<div className="grid gap-2">
					<Label htmlFor="appStoreUrl">App Store URL (Optional)</Label>
					<Input
						id="appStoreUrl"
						type="url"
						value={formData.appStoreUrl}
						onChange={handleChange}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="playStoreUrl">Google Play URL (Optional)</Label>
					<Input
						id="playStoreUrl"
						type="url"
						value={formData.playStoreUrl}
						onChange={handleChange}
					/>
				</div>
			</div>
		</>
	);
	const renderStep3 = () => (
		<div className="space-y-6">
			<div className="grid gap-2">
				<Label>Card Color Theme</Label>
				<Select
					value={formData.visual.color}
					onValueChange={(value) => handleVisualChange('color', value)}>
					<SelectTrigger>
						<SelectValue placeholder="Select a color theme" />
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
					<div key={index} className="flex items-center gap-2">
						<Input
							placeholder={`Insight #${index + 1}`}
							value={insight.text}
							onChange={(e) => handleInsightChange(index, e.target.value)}
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => removeInsight(index)}
							disabled={formData.visual.content.length <= 1}>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				))}
				<Button type="button" variant="outline" onClick={addInsight}>
					Add Insight
				</Button>
			</div>
		</div>
	);

	return (
		<div className="flex items-center justify-center min-h-screen bg-background px-4 py-12">
			<div className="w-full max-w-2xl">
				<div className="text-center mb-8">
					<Link
						to="/"
						className="flex items-center justify-center gap-2 mb-4 group">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-8 w-8 text-primary transition-transform group-hover:scale-110">
							<path d="M12 2L2 7l10 5 10-5-10-5z" />
							<path d="M2 17l10 5 10-5" />
							<path d="M2 12l10 5 10-5" />
						</svg>
						<span className="text-2xl font-bold text-foreground">Collab</span>
					</Link>
					<p className="text-muted-foreground">
						List your tool on the marketplace.
					</p>
				</div>
				<Card>
					<form onSubmit={handleSubmit}>
						<CardHeader>
							<CardTitle>Tool Submission</CardTitle>
							<CardDescription>
								{isMobile
									? `Step ${step} of 3: ${
											step === 1
												? 'Core Details'
												: step === 2
												? 'Links & Tags'
												: 'Card Visuals'
									  }`
									: 'Fill out the details below. Our team will review your submission.'}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{renderFormContent()}
							<div className="flex items-center justify-between pt-6">
								{isMobile && step > 1 ? (
									<Button
										type="button"
										variant="outline"
										onClick={prevStep}
										disabled={isLoading}>
										Back
									</Button>
								) : (
									<div />
								)}

								{isMobile && step < 3 ? (
									<Button type="button" onClick={nextStep} disabled={isLoading}>
										Next
									</Button>
								) : (
									<Button className="w-full" type="submit" disabled={isLoading}>
										{isLoading ? 'Submitting...' : 'Submit for Review'}
									</Button>
								)}
							</div>
						</CardContent>
					</form>
				</Card>
			</div>
		</div>
	);
}
