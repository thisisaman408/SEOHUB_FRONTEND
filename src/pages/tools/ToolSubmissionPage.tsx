// src/pages/tools/ToolSubmissionPage.tsx

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useMediaQuery } from '@/hooks/use-media-query';
import { motion } from 'framer-motion';
import {
	ArrowLeft,
	ArrowRight,
	CheckCircle,
	Clock,
	Loader2,
} from 'lucide-react';
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
		handleSubmit,
		nextStep,
		prevStep,
	} = useToolSubmissionForm();

	const renderStepContent = () => {
		switch (step) {
			case 1:
				return (
					<BasicDetailsStep
						formData={formData}
						logoPreview={logoPreview}
						fileInputRef={fileInputRef}
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
				return <VisualsStep formData={formData} onFormChange={handleChange} />;
			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-gray-950">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<motion.div
					className="text-center mb-12"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
						<span className="text-white">Submit Your</span>{' '}
						<span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
							SEO Tool
						</span>
					</h1>
					<p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
						Join our marketplace and reach thousands of users looking for
						powerful SEO solutions
					</p>
				</motion.div>

				{/* Guidelines */}
				<motion.div
					className="mb-12"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}>
					<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
						<CardHeader className="border-b border-gray-800/50">
							<CardTitle className="text-2xl font-bold text-white flex items-center space-x-3">
								<div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
									<CheckCircle className="h-5 w-5 text-white" />
								</div>
								<span>Submission Guidelines</span>
							</CardTitle>
							<CardDescription className="text-gray-400 text-lg">
								Please review before submitting your tool
							</CardDescription>
						</CardHeader>
						<CardContent className="p-8">
							<div className="grid md:grid-cols-2 gap-8">
								<div className="space-y-4">
									<div className="flex items-start space-x-3">
										<div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
											<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
										</div>
										<span className="text-gray-300">
											Provide accurate and complete information
										</span>
									</div>
									<div className="flex items-start space-x-3">
										<div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
											<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
										</div>
										<span className="text-gray-300">
											Use high-quality logos and media files
										</span>
									</div>
									<div className="flex items-start space-x-3">
										<div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
											<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
										</div>
										<span className="text-gray-300">
											Include detailed descriptions of your tool's features
										</span>
									</div>
								</div>
								<div className="space-y-4">
									<div className="flex items-start space-x-3">
										<div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
											<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
										</div>
										<span className="text-gray-300">
											Add relevant tags to help users find your tool
										</span>
									</div>
									<div className="flex items-start space-x-3">
										<div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
											<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
										</div>
										<span className="text-gray-300">
											Upload screenshots or demo videos to showcase
											functionality
										</span>
									</div>
									<div className="flex items-start space-x-3">
										<div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
											<Clock className="h-3 w-3 text-green-400" />
										</div>
										<span className="text-gray-300">
											Reviews typically take 24-48 hours
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Progress */}
				<motion.div
					className="mb-12"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}>
					<StepIndicator currentStep={step} />
				</motion.div>

				{/* Form */}
				<motion.div
					className="mb-12"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.6 }}>
					<Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
						<CardHeader className="border-b border-gray-800/50">
							<CardTitle className="text-2xl font-bold text-white">
								{step === 1 && 'Basic Details'}
								{step === 2 && 'Links & Tags'}
								{step === 3 && 'Media Gallery'}
								{step === 4 && 'Card Visuals'}
							</CardTitle>
							<CardDescription className="text-gray-400 text-lg">
								Step {step} of 4 -{' '}
								{step === 1 && 'Core information about your tool'}
								{step === 2 && 'Website, stores, and categorization'}
								{step === 3 && 'Screenshots and demo materials'}
								{step === 4 && 'Customize how your tool appears in listings'}
							</CardDescription>
						</CardHeader>
						<CardContent className="p-8">{renderStepContent()}</CardContent>
					</Card>
				</motion.div>

				{/* Navigation */}
				<motion.div
					className="flex items-center justify-between"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.8 }}>
					<div>
						{step > 1 && (
							<Button
								onClick={prevStep}
								variant="outline"
								className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-6 py-3 rounded-xl">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Previous
							</Button>
						)}
					</div>
					<div>
						{step < 4 ? (
							<Button
								onClick={nextStep}
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
								Next Step
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						) : (
							<Button
								onClick={handleSubmit}
								disabled={isLoading}
								className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Submitting...
									</>
								) : (
									<>
										<CheckCircle className="mr-2 h-4 w-4" />
										Submit Tool
									</>
								)}
							</Button>
						)}
					</div>
				</motion.div>

				{/* Mobile Guidelines */}
				{isMobile && (
					<motion.div
						className="mt-12"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 1.0 }}>
						<Card className="bg-gray-900/30 border-gray-800/30">
							<CardHeader>
								<CardTitle className="text-lg font-bold text-white">
									Quick Tips
								</CardTitle>
							</CardHeader>
							<CardContent className="p-6">
								<div className="space-y-3 text-sm text-gray-400">
									<div className="flex items-center space-x-2">
										<div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
										<span>Provide accurate information</span>
									</div>
									<div className="flex items-center space-x-2">
										<div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
										<span>Use high-quality logos</span>
									</div>
									<div className="flex items-center space-x-2">
										<div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
										<span>Add relevant tags</span>
									</div>
									<div className="flex items-center space-x-2">
										<div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
										<span>Upload media to showcase features</span>
									</div>
									<div className="flex items-center space-x-2">
										<div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
										<span>Reviews take 24-48 hours</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				)}

				{/* Cancel Link */}
				<motion.div
					className="text-center mt-8"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 1.2 }}>
					<Link
						to="/"
						className="text-gray-400 hover:text-gray-300 transition-colors text-sm">
						Cancel and return to home
					</Link>
				</motion.div>
			</div>
		</div>
	);
}
