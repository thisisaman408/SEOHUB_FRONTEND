// src/pages/tools/ToolSubmissionPage.tsx - Fixed mobile rendering
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BasicDetailsStep } from './components/BasicDetailsStep';
import { LinksAndTagsStep } from './components/LinksAndTagsStep';
import { MediaUploadStep } from './components/MediaUploadStep';
import { StepIndicator } from './components/StepIndicator';
import { VisualsStep } from './components/VisualsStep';
import { useToolSubmissionForm } from './hooks/useToolSubmissionForm';

export function ToolSubmissionPage() {
	const isMobile = useMediaQuery('(max-width: 768px)');
	const {
		step,
		formData,
		logoPreview,
		mediaFiles,
		isLoading,
		fileInputRef,
		handleChange,
		handleFileChange,
		handleMediaUpload,
		handleMediaRemove,
		handleVisualChange,
		handleInsightChange,
		addInsight,
		removeInsight,
		handleSubmit,
		nextStep,
		prevStep,
	} = useToolSubmissionForm();

	// ✅ Render current step content
	const renderStepContent = () => {
		switch (step) {
			case 1:
				return (
					<BasicDetailsStep
						formData={formData}
						logoPreview={logoPreview}
						fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>} // ✅ Fixed: Type assertion
						onFormChange={handleChange}
						onFileChange={handleFileChange}
					/>
				);
			case 2:
				return (
					<LinksAndTagsStep formData={formData} onFormChange={handleChange} />
				);
			case 3:
				return (
					<MediaUploadStep
						mediaFiles={mediaFiles}
						onMediaUpload={handleMediaUpload}
						onMediaRemove={handleMediaRemove}
					/>
				);
			case 4:
				return (
					<VisualsStep
						formData={formData}
						onVisualChange={handleVisualChange}
						onInsightChange={handleInsightChange}
						onAddInsight={addInsight}
						onRemoveInsight={removeInsight}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className="container mx-auto py-12 px-4">
			<div className="max-w-2xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold mb-2">Submit Your Tool</h1>
					<p className="text-muted-foreground">
						Join our marketplace and reach thousands of users
					</p>
				</div>

				{/* Guidelines */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="text-lg">Submission Guidelines</CardTitle>
						<CardDescription>
							Please review before submitting your tool
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2 text-sm">
							<li>• Provide accurate and complete information</li>
							<li>• Use high-quality logos and media files</li>
							<li>• Include detailed descriptions of your tool's features</li>
							<li>• Add relevant tags to help users find your tool</li>
							<li>
								• Upload screenshots or demo videos to showcase functionality
							</li>
							<li>• Reviews typically take 24-48 hours</li>
						</ul>
					</CardContent>
				</Card>

				{/* Progress */}
				<StepIndicator currentStep={step} />

				{/* Form */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span>
								{step === 1 && 'Basic Details'}
								{step === 2 && 'Links & Tags'}
								{step === 3 && 'Media Gallery'}
								{step === 4 && 'Card Visuals'}
							</span>
							<span className="text-sm text-muted-foreground">
								Step {step} of 4
							</span>
						</CardTitle>
						<CardDescription>
							{step === 1 && 'Core information about your tool'}
							{step === 2 && 'Website, stores, and categorization'}
							{step === 3 && 'Screenshots and demo materials'}
							{step === 4 && 'Customize how your tool appears in listings'}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{renderStepContent()}

						{/* Navigation */}
						<div className="flex justify-between pt-6 border-t">
							<div>
								{step > 1 && (
									<Button
										variant="outline"
										onClick={prevStep}
										disabled={isLoading}>
										Previous
									</Button>
								)}
							</div>
							<div className="flex gap-3">
								{step < 4 ? (
									<Button onClick={nextStep} disabled={isLoading}>
										Next Step
									</Button>
								) : (
									<Button onClick={handleSubmit} disabled={isLoading}>
										{isLoading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Submitting...
											</>
										) : (
											'Submit Tool'
										)}
									</Button>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Mobile Guidelines */}
				{isMobile && (
					<Card className="mt-8">
						<CardContent className="pt-6">
							<h3 className="font-semibold mb-2">Quick Tips</h3>
							<ul className="space-y-1 text-sm text-muted-foreground">
								<li>• Provide accurate information</li>
								<li>• Use high-quality logos</li>
								<li>• Add relevant tags</li>
								<li>• Upload media to showcase features</li>
								<li>• Reviews take 24-48 hours</li>
							</ul>
						</CardContent>
					</Card>
				)}

				{/* Cancel Link */}
				<div className="text-center mt-8">
					<Link
						to="/"
						className="text-sm text-muted-foreground hover:underline">
						Cancel and return to home
					</Link>
				</div>
			</div>
		</div>
	);
}
