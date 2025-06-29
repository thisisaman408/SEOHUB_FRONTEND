// src/pages/tools/components/StepIndicator.tsx

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
	currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
	const steps = [
		{ number: 1, title: 'Core Details' },
		{ number: 2, title: 'Links & Tags' },
		{ number: 3, title: 'Media Gallery' },
		{ number: 4, title: 'Card Visuals' },
	];

	return (
		<div className="space-y-6">
			{/* Progress Header */}
			<div className="text-center">
				<motion.h2
					className="text-2xl font-bold text-white mb-2"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}>
					Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
				</motion.h2>
				<motion.p
					className="text-gray-400"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.1 }}>
					Complete all steps to submit your tool for review
				</motion.p>
			</div>

			{/* Progress Bar */}
			<div className="relative">
				{/* Background Line */}
				<div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-700" />

				{/* Progress Line */}
				<motion.div
					className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"
					initial={{ width: 0 }}
					animate={{
						width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
					}}
					transition={{ duration: 0.8, ease: 'easeInOut' }}
				/>

				{/* Steps */}
				<div className="relative flex justify-between">
					{steps.map((step, index) => (
						<motion.div
							key={step.number}
							className="flex flex-col items-center"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}>
							{/* Step Circle */}
							<div
								className={`
									w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
									${
										step.number < currentStep
											? 'bg-gradient-to-r from-green-500 to-green-600 border-green-500 text-white'
											: step.number === currentStep
											? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500 text-white shadow-lg shadow-blue-500/25'
											: 'bg-gray-800 border-gray-600 text-gray-400'
									}
								`}>
								{step.number < currentStep ? (
									<Check className="h-5 w-5" />
								) : (
									<span className="font-semibold">{step.number}</span>
								)}
							</div>

							{/* Step Title */}
							<div className="mt-3 text-center">
								<span
									className={`
										text-sm font-medium transition-colors duration-300
										${step.number <= currentStep ? 'text-white' : 'text-gray-500'}
									`}>
									{step.title}
								</span>
							</div>
						</motion.div>
					))}
				</div>
			</div>

			{/* Progress Percentage */}
			<motion.div
				className="text-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.3 }}>
				<div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50">
					<div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
					<span className="text-gray-300 text-sm font-medium">
						{Math.round((currentStep / steps.length) * 100)}% Complete
					</span>
				</div>
			</motion.div>
		</div>
	);
}
